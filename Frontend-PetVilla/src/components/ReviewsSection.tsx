import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Star, ThumbsUp, Flag, MessageSquare } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsAPI } from "../lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuthStore } from "../stores/authStore";

const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Selecciona una calificación")
    .max(5, "La calificación máxima es 5"),
  comment: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

interface ReviewsSectionProps {
  targetId: string;
  targetType: "clinic" | "freelancer";
  averageRating?: number;
  totalReviews?: number;
  canReview?: boolean;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  targetId,
  targetType,
  averageRating = 0,
  totalReviews = 0,
  canReview = false,
}) => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "rating">("recent");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: [`reviews-${targetType}`, targetId],
    queryFn: async () => {
      const response =
        targetType === "clinic"
          ? await reviewsAPI.getByClinic(targetId)
          : await reviewsAPI.getByFreelancer(targetId);
      return response.data || [];
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: {
      targetId: string;
      rating: number;
      comment?: string;
    }) => reviewsAPI.create(data),
    onSuccess: () => {
      toast.success("¡Reseña publicada exitosamente!");
      setShowReviewForm(false);
      queryClient.invalidateQueries({
        queryKey: [`reviews-${targetType}`, targetId],
      });
    },
    onError: () => {
      toast.error("Error al publicar la reseña. Inténtalo nuevamente.");
    },
  });

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const watchedRating = useWatch({
    control: form.control,
    name: "rating",
  });

  const onSubmit = (data: ReviewFormData) => {
    createReviewMutation.mutate({
      targetId,
      rating: data.rating,
      comment: data.comment,
    });
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.rating - a.rating;
    }
  });

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : "cursor-default"
            }`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review: Review) => {
      distribution[review.rating - 1]++;
    });
    return distribution.reverse(); // 5 stars first
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Reseñas y Calificaciones
          </CardTitle>
          <CardDescription>
            Opiniones de clientes sobre este{" "}
            {targetType === "clinic" ? "veterinario" : "profesional"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-muted-foreground">
                Basado en {totalReviews} reseña{totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {getRatingDistribution().map((count, index) => {
                const rating = 5 - index;
                const percentage =
                  totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{rating}★</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Write Review Button */}
          {canReview && isAuthenticated && (
            <div className="mt-6 pt-6 border-t">
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                variant="outline"
                className="w-full"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {showReviewForm ? "Cancelar reseña" : "Escribir una reseña"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Write Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Escribe tu reseña</CardTitle>
            <CardDescription>
              Comparte tu experiencia para ayudar a otros usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Calificación *
                </label>
                {renderStars(watchedRating, true, (rating) =>
                  form.setValue("rating", rating)
                )}
                {form.formState.errors.rating && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.rating.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="text-sm font-medium mb-2 block"
                >
                  Comentario (opcional)
                </label>
                <Textarea
                  id="comment"
                  placeholder="Comparte los detalles de tu experiencia..."
                  className="min-h-[100px]"
                  {...form.register("comment")}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createReviewMutation.isPending}>
                  {createReviewMutation.isPending
                    ? "Publicando..."
                    : "Publicar reseña"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Todas las reseñas</CardTitle>
            <CardDescription>
              {reviews.length} reseña{reviews.length !== 1 ? "s" : ""} en total
            </CardDescription>
          </div>

          <div className="flex gap-2">
            <Button
              variant={sortBy === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("recent")}
            >
              Más recientes
            </Button>
            <Button
              variant={sortBy === "rating" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("rating")}
            >
              Mejor valoradas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : sortedReviews.length > 0 ? (
            <div className="space-y-6">
              {sortedReviews.map((review: Review) => (
                <div
                  key={review.id}
                  className="border-b last:border-b-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.author.avatarUrl} />
                      <AvatarFallback>
                        {review.author.firstName[0]}
                        {review.author.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {review.author.firstName} {review.author.lastName}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            Usuario verificado
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(
                            new Date(review.createdAt),
                            "dd 'de' MMMM, yyyy",
                            { locale: es }
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">
                          {review.rating}/5
                        </span>
                      </div>

                      {review.comment && (
                        <p className="text-muted-foreground mb-3">
                          {review.comment}
                        </p>
                      )}

                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Útil
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Flag className="w-4 h-4 mr-1" />
                          Reportar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aún no hay reseñas</h3>
              <p className="text-muted-foreground mb-4">
                Sé el primero en compartir tu experiencia
              </p>
              {canReview && isAuthenticated && (
                <Button onClick={() => setShowReviewForm(true)}>
                  Escribir primera reseña
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
