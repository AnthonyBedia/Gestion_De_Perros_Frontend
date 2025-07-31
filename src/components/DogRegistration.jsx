import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';

const DogRegistration = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    raza: '',
    tamano: '',
    comportamiento: '',
    calle: '',
    edad: '',
    dueno_nombre: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validar campos requeridos
      if (!formData.nombre || !formData.raza || !formData.tamano || !formData.dueno_nombre) {
        throw new Error('Por favor complete todos los campos requeridos');
      }

      const submitData = {
        ...formData,
        edad: formData.edad ? parseInt(formData.edad) : null
      };

      const response = await fetch('http://localhost:5000/api/perros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar el perro');
      }

      const result = await response.json();
      setMessage({ 
        type: 'success', 
        text: `Perro "${result.nombre}" registrado exitosamente` 
      });
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        raza: '',
        tamano: '',
        comportamiento: '',
        calle: '',
        edad: '',
        dueno_nombre: ''
      });

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Registrar Perro</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Perro y Dueño</CardTitle>
          <CardDescription>
            Complete todos los campos para registrar un nuevo perro en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Información del Perro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Perro *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Max, Bella, Rocky"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="raza">Raza *</Label>
                <Input
                  id="raza"
                  name="raza"
                  value={formData.raza}
                  onChange={handleInputChange}
                  placeholder="Ej: Labrador, Chihuahua, Pastor Alemán"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tamano">Tamaño *</Label>
                <Select onValueChange={(value) => handleSelectChange('tamano', value)} value={formData.tamano}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pequeño">Pequeño</SelectItem>
                    <SelectItem value="Mediano">Mediano</SelectItem>
                    <SelectItem value="Grande">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edad">Edad (años)</Label>
                <Input
                  id="edad"
                  name="edad"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.edad}
                  onChange={handleInputChange}
                  placeholder="Ej: 3"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comportamiento">Comportamiento</Label>
              <Textarea
                id="comportamiento"
                name="comportamiento"
                value={formData.comportamiento}
                onChange={handleInputChange}
                placeholder="Ej: Amigable y juguetón, Protector y leal"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calle">Calle/Dirección</Label>
              <Input
                id="calle"
                name="calle"
                value={formData.calle}
                onChange={handleInputChange}
                placeholder="Ej: Calle 123, Avenida Central"
              />
            </div>

            {/* Información del Dueño */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Información del Dueño</h3>
              <div className="space-y-2">
                <Label htmlFor="dueno_nombre">Nombre del Dueño *</Label>
                <Input
                  id="dueno_nombre"
                  name="dueno_nombre"
                  value={formData.dueno_nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Juan Pérez, María García"
                  required
                />
              </div>
            </div>

            {/* Mensaje de estado */}
            {message.text && (
              <div className={`flex items-center gap-2 p-3 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Perro'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DogRegistration;

