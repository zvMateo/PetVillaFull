// ============================================================================
// 🐾 PETVILLA - COMPONENTES DE ESTADÍSTICAS CON RECHARTS
// ============================================================================
// Gráficos y visualizaciones para el dashboard del usuario
// ============================================================================

import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { TrendingUp, Calendar, Award, PawPrint } from "lucide-react";

// ============================================================================
// 📊 DATOS DE EJEMPLO
// ============================================================================

const appointmentsByMonth = [
  { month: "Jul", turnos: 2 },
  { month: "Ago", turnos: 3 },
  { month: "Sep", turnos: 1 },
  { month: "Oct", turnos: 4 },
  { month: "Nov", turnos: 2 },
  { month: "Dic", turnos: 5 },
];

const pointsHistory = [
  { month: "Jul", puntos: 50 },
  { month: "Ago", puntos: 120 },
  { month: "Sep", puntos: 180 },
  { month: "Oct", puntos: 320 },
  { month: "Nov", puntos: 450 },
  { month: "Dic", puntos: 620 },
];

const serviceBreakdown = [
  { name: "Consultas", value: 45, color: "#22c55e" },
  { name: "Vacunas", value: 25, color: "#3b82f6" },
  { name: "Peluquería", value: 20, color: "#f59e0b" },
  { name: "Otros", value: 10, color: "#8b5cf6" },
];

const petActivityData = [
  { name: "Luna", consultas: 8, vacunas: 3, peluqueria: 4 },
  { name: "Toby", consultas: 5, vacunas: 2, peluqueria: 6 },
  { name: "Max", consultas: 3, vacunas: 4, peluqueria: 2 },
];

// ============================================================================
// 📈 GRÁFICO DE LÍNEA - HISTORIAL DE TURNOS
// ============================================================================

interface AppointmentsChartProps {
  data?: Array<{ month: string; turnos: number }>;
  className?: string;
}

export const AppointmentsChart: React.FC<AppointmentsChartProps> = ({
  data = appointmentsByMonth,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-pet-primary" />
          Historial de Turnos
        </CardTitle>
        <CardDescription>Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTurnos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="turnos"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTurnos)"
              name="Turnos"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// 📈 GRÁFICO DE LÍNEA - EVOLUCIÓN DE PUNTOS
// ============================================================================

interface PointsChartProps {
  data?: Array<{ month: string; puntos: number }>;
  className?: string;
}

export const PointsChart: React.FC<PointsChartProps> = ({
  data = pointsHistory,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="w-5 h-5 text-amber-500" />
          Evolución de Puntos
        </CardTitle>
        <CardDescription>Tu progreso en PetVilla</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="puntos"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                stroke: "#f59e0b",
                strokeWidth: 2,
                fill: "white",
              }}
              name="Puntos"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// 🥧 GRÁFICO CIRCULAR - DISTRIBUCIÓN DE SERVICIOS
// ============================================================================

interface ServicesPieChartProps {
  data?: Array<{ name: string; value: number; color: string }>;
  className?: string;
}

export const ServicesPieChart: React.FC<ServicesPieChartProps> = ({
  data = serviceBreakdown,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Servicios Utilizados
        </CardTitle>
        <CardDescription>Distribución por tipo</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={{ stroke: "#6b7280", strokeWidth: 1 }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// 📊 GRÁFICO DE BARRAS - ACTIVIDAD POR MASCOTA
// ============================================================================

interface PetActivityChartProps {
  data?: Array<{
    name: string;
    consultas: number;
    vacunas: number;
    peluqueria: number;
  }>;
  className?: string;
}

export const PetActivityChart: React.FC<PetActivityChartProps> = ({
  data = petActivityData,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PawPrint className="w-5 h-5 text-pet-primary" />
          Actividad por Mascota
        </CardTitle>
        <CardDescription>Comparativa de servicios</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend />
            <Bar
              dataKey="consultas"
              fill="#22c55e"
              name="Consultas"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="vacunas"
              fill="#3b82f6"
              name="Vacunas"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="peluqueria"
              fill="#f59e0b"
              name="Peluquería"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// 📊 DASHBOARD DE ESTADÍSTICAS COMPLETO
// ============================================================================

interface StatsDashboardProps {
  className?: string;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  className = "",
}) => {
  return (
    <div className={`grid gap-6 ${className}`}>
      {/* Primera fila - 2 gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        <AppointmentsChart />
        <PointsChart />
      </div>

      {/* Segunda fila - 2 gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        <ServicesPieChart />
        <PetActivityChart />
      </div>
    </div>
  );
};

// ============================================================================
// 📊 MINI STATS CARDS
// ============================================================================

interface MiniStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const MiniStatCard: React.FC<MiniStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
            {trend && (
              <p
                className={`text-xs flex items-center gap-1 ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                <TrendingUp
                  className={`w-3 h-3 ${!trend.isPositive && "rotate-180"}`}
                />
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}% vs mes anterior
              </p>
            )}
          </div>
          <div className="p-3 rounded-full bg-pet-primary/10 text-pet-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsDashboard;
