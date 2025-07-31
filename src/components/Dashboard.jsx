import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Dog, Users } from "lucide-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DFF",
  "#FF6F61",
  "#6B5B95",
  "#88B04B",
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_perros: 0,
    perros_por_raza: [],
    categorias_edad: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/dashboard/stats");
      if (!response.ok) {
        throw new Error("Error al cargar estadísticas");
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Dashboard - Gestión de Perros</h1>
      </div>

      {/* Estadística principal */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Perros Registrados
          </CardTitle>
          <Dog className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_perros}</div>
          <p className="text-xs text-muted-foreground">
            Perros registrados en el sistema
          </p>
        </CardContent>
      </Card>

      {/* Gráfico de perros por raza */}
      <Card>
        <CardHeader>
          <CardTitle>Perros por Raza</CardTitle>
          <CardDescription>
            Distribución de perros registrados según su raza
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.perros_por_raza}
                dataKey="count"
                nameKey="raza"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                {stats.perros_por_raza.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} perros`,
                  props.payload.raza,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de categorías de edad */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías de Edad</CardTitle>
          <CardDescription>
            Distribución de perros por grupos de edad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categorias_edad} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="categoria"
                type="category"
                width={120}
                fontSize={12}
              />
              <Tooltip />
              <Bar dataKey="count">
                {stats.categorias_edad.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
