import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Dog, User, MapPin, Calendar } from 'lucide-react';

const DogClassification = () => {
  const [perros, setPerros] = useState([]);
  const [filteredPerros, setFilteredPerros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    nombre: '',
    raza: '',
    tamano: '',
    comportamiento: '',
    calle: '',
    dueno: ''
  });

  useEffect(() => {
    fetchPerros();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [perros, filters]);

  const fetchPerros = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/perros');
      if (!response.ok) {
        throw new Error('Error al cargar los perros');
      }
      const data = await response.json();
      setPerros(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = perros;

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(perro => {
          const fieldValue = key === 'dueno' ? perro.dueno_nombre : perro[key];
          return fieldValue && fieldValue.toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    setFilteredPerros(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      nombre: '',
      raza: '',
      tamano: '',
      comportamiento: '',
      calle: '',
      dueno: ''
    });
  };

  const getSizeColor = (tamano) => {
    switch (tamano) {
      case 'Pequeño': return 'bg-green-100 text-green-800';
      case 'Mediano': return 'bg-yellow-100 text-yellow-800';
      case 'Grande': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <Button onClick={fetchPerros}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Clasificación de Perros</h1>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
          <CardDescription>
            Use los filtros para encontrar perros específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Perro</Label>
              <Input
                id="nombre"
                value={filters.nombre}
                onChange={(e) => handleFilterChange('nombre', e.target.value)}
                placeholder="Buscar por nombre..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="raza">Raza</Label>
              <Input
                id="raza"
                value={filters.raza}
                onChange={(e) => handleFilterChange('raza', e.target.value)}
                placeholder="Buscar por raza..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tamano">Tamaño</Label>
              <Select onValueChange={(value) => handleFilterChange('tamano', value)} value={filters.tamano}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tamaños" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tamaños</SelectItem>
                  <SelectItem value="Pequeño">Pequeño</SelectItem>
                  <SelectItem value="Mediano">Mediano</SelectItem>
                  <SelectItem value="Grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comportamiento">Comportamiento</Label>
              <Input
                id="comportamiento"
                value={filters.comportamiento}
                onChange={(e) => handleFilterChange('comportamiento', e.target.value)}
                placeholder="Buscar por comportamiento..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calle">Calle</Label>
              <Input
                id="calle"
                value={filters.calle}
                onChange={(e) => handleFilterChange('calle', e.target.value)}
                placeholder="Buscar por calle..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueno">Dueño</Label>
              <Input
                id="dueno"
                value={filters.dueno}
                onChange={(e) => handleFilterChange('dueno', e.target.value)}
                placeholder="Buscar por dueño..."
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredPerros.length} de {perros.length} perros
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Perros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPerros.map((perro) => (
          <Card key={perro.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Dog className="h-5 w-5 text-primary" />
                  {perro.nombre}
                </CardTitle>
                <Badge className={getSizeColor(perro.tamano)}>
                  {perro.tamano}
                </Badge>
              </div>
              <CardDescription className="font-medium">
                {perro.raza}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span><strong>Dueño:</strong> {perro.dueno_nombre}</span>
              </div>

              {perro.edad && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span><strong>Edad:</strong> {perro.edad} años</span>
                </div>
              )}

              {perro.calle && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span><strong>Dirección:</strong> {perro.calle}</span>
                </div>
              )}

              {perro.comportamiento && (
                <div className="text-sm">
                  <strong>Comportamiento:</strong>
                  <p className="text-muted-foreground mt-1">{perro.comportamiento}</p>
                </div>
              )}

              <div className="text-xs text-muted-foreground pt-2 border-t">
                Registrado: {new Date(perro.fecha_registro).toLocaleDateString('es-ES')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPerros.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Dog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No se encontraron perros</p>
            <p className="text-muted-foreground">
              Intente ajustar los filtros de búsqueda o registre un nuevo perro
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DogClassification;

