import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dog, Users, PieChart } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_perros: 0,
    perros_por_raza: [],
    categorias_edad: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
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
          <CardTitle className="text-sm font-medium">Total de Perros Registrados</CardTitle>
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
            <BarChart data={stats.perros_por_raza}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="raza" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
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
            <BarChart data={stats.categorias_edad}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="categoria" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

