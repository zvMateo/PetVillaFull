import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Badge } from "../components/ui/badge";
import { Layout } from "../components/Layout";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { petsAPI } from "../lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  PawPrint,
  Calendar as CalendarIcon,
  Upload,
  ArrowLeft,
  Heart,
  Weight,
  Scissors,
  FileText,
  Save,
  X,
} from "lucide-react";

const petSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  species: z.enum(["DOG", "CAT", "BIRD", "OTHER"]),
  breed: z.string().optional(),
  birthDate: z.date().optional(),
  weight: z.number().min(0.1, "El peso debe ser mayor a 0").optional(),
  notes: z.string().optional(),
});

type PetFormData = z.infer<typeof petSchema>;

const speciesOptions = [
  { value: "DOG", label: "Perro", icon: "🐕" },
  { value: "CAT", label: "Gato", icon: "🐱" },
  { value: "BIRD", label: "Ave", icon: "🐦" },
  { value: "OTHER", label: "Otro", icon: "🐾" },
];

const commonBreeds = {
  DOG: [
    "Labrador Retriever",
    "Golden Retriever",
    "Bulldog",
    "Poodle",
    "Beagle",
    "Rottweiler",
    "German Shepherd",
    "Yorkshire Terrier",
    "Boxer",
    "Dachshund",
    "Siberian Husky",
    "Great Dane",
    "Chihuahua",
    "Pug",
    "Border Collie",
  ],
  CAT: [
    "Siamés",
    "Persa",
    "Maine Coon",
    "British Shorthair",
    "Ragdoll",
    "Sphynx",
    "Abyssinian",
    "Scottish Fold",
    "Bengal",
    "Oriental Shorthair",
  ],
  BIRD: [
    "Canario",
    "Periquito",
    "Cacatúa",
    "Loro",
    "Agapornis",
    "Nymphicus hollandicus",
    "Cotorra",
    "Guacamayo",
  ],
  OTHER: [],
};

const PetRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [birthDate, setBirthDate] = useState<Date>();
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      species: undefined,
      breed: "",
      weight: undefined,
      notes: "",
    },
  });

  // Fetch user's pets to show existing ones
  const { data: existingPets = [] } = useQuery({
    queryKey: ["pets"],
    queryFn: () => petsAPI.getAll(),
  });

  const createPetMutation = useMutation({
    mutationFn: async (data: PetFormData) => {
      const formData = {
        ...data,
        birthDate: birthDate?.toISOString(),
      };
      return petsAPI.create(formData);
    },
    onSuccess: () => {
      toast.success("¡Mascota registrada exitosamente!");
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      navigate("/profile");
    },
    onError: () => {
      toast.error("Error al registrar la mascota. Inténtalo nuevamente.");
    },
  });

  const handleSpeciesChange = (species: string) => {
    setSelectedSpecies(species);
    form.setValue("species", species as "DOG" | "CAT" | "BIRD" | "OTHER");
    // Reset breed when species changes
    form.setValue("breed", "");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: PetFormData) => {
    createPetMutation.mutate(data);
  };

  const selectedSpeciesData = speciesOptions.find(
    (s) => s.value === selectedSpecies
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/profile")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al perfil
          </Button>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <PawPrint className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Registrar Nueva Mascota</h1>
            <p className="text-muted-foreground">
              Agrega la información de tu mascota para poder agendar citas
              veterinarias
            </p>
          </div>
        </div>

        {/* Existing Pets Alert */}
        {Array.isArray(existingPets) && existingPets.length > 0 && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">
                    Ya tienes {existingPets.length} mascota
                    {existingPets.length > 1 ? "s" : ""} registrada
                    {existingPets.length > 1 ? "s" : ""}
                  </h4>
                  <p className="text-sm text-blue-800 mb-2">
                    Puedes registrar múltiples mascotas para agendar citas para
                    cada una.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(existingPets) &&
                      existingPets
                        .slice(0, 3)
                        .map(
                          (pet: {
                            id: string;
                            name: string;
                            species: string;
                          }) => (
                            <Badge
                              key={pet.id}
                              variant="secondary"
                              className="bg-blue-100 text-blue-800"
                            >
                              {pet.name} ({pet.species})
                            </Badge>
                          )
                        )}
                    {Array.isArray(existingPets) && existingPets.length > 3 && (
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800"
                      >
                        +
                        {Array.isArray(existingPets) && existingPets.length - 3}{" "}
                        más
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Photo Upload */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Foto de la Mascota</CardTitle>
                  <CardDescription>
                    Una foto ayuda a identificar a tu mascota
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <div className="w-full aspect-square bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Haz clic para subir foto
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  {imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setImagePreview("")}
                      className="w-full"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Quitar foto
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Columns - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PawPrint className="w-5 h-5" />
                    Información Básica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre de la Mascota *</Label>
                      <Input
                        id="name"
                        placeholder="Ej: Max, Luna, Coco..."
                        {...form.register("name")}
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Especie *</Label>
                      <Select onValueChange={handleSpeciesChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la especie">
                            {selectedSpeciesData && (
                              <div className="flex items-center gap-2">
                                <span>{selectedSpeciesData.icon}</span>
                                <span>{selectedSpeciesData.label}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {speciesOptions.map((species) => (
                            <SelectItem
                              key={species.value}
                              value={species.value}
                            >
                              <div className="flex items-center gap-2">
                                <span>{species.icon}</span>
                                <span>{species.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.species && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.species.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breed">Raza (opcional)</Label>
                    {selectedSpecies &&
                    commonBreeds[selectedSpecies as keyof typeof commonBreeds]
                      .length > 0 ? (
                      <Select
                        onValueChange={(value) => form.setValue("breed", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una raza común o escribe una personalizada" />
                        </SelectTrigger>
                        <SelectContent>
                          {commonBreeds[
                            selectedSpecies as keyof typeof commonBreeds
                          ].map((breed) => (
                            <SelectItem key={breed} value={breed}>
                              {breed}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">
                            Otra raza (especificar abajo)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : null}
                    <Input
                      id="breed"
                      placeholder="Ej: Labrador, Siamés, Canario..."
                      {...form.register("breed")}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Physical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Información Física
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha de Nacimiento (opcional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {birthDate ? (
                              format(birthDate, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={birthDate}
                            onSelect={setBirthDate}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Peso (kg) (opcional)</Label>
                      <div className="relative">
                        <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          min="0.1"
                          placeholder="Ej: 12.5"
                          className="pl-10"
                          {...form.register("weight", { valueAsNumber: true })}
                        />
                      </div>
                      {form.formState.errors.weight && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.weight.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Información Médica
                  </CardTitle>
                  <CardDescription>
                    Información importante sobre la salud de tu mascota
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Médicas (opcional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Alergias, medicamentos, condiciones especiales, comportamiento, etc."
                      className="min-h-25"
                      {...form.register("notes")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Esta información será visible para los veterinarios
                      durante las consultas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/profile")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createPetMutation.isPending}
              className="min-w-35"
            >
              {createPetMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registrando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Registrar Mascota
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Tips Card */}
        <Card className="mt-8 bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Scissors className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">
                  💡 Consejos para el registro
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>
                    • Incluye información precisa sobre alergias y medicamentos
                  </li>
                  <li>
                    • Menciona comportamientos especiales (miedo, agresividad,
                    etc.)
                  </li>
                  <li>
                    • Actualiza regularmente el peso y la información médica
                  </li>
                  <li>
                    • Una buena foto ayuda a los veterinarios a reconocer a tu
                    mascota
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PetRegistrationPage;
