import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Dashboard from './components/Dashboard';
import DogRegistration from './components/DogRegistration';
import DogClassification from './components/DogClassification';
import { Home, PlusCircle, Filter, Dog } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, component: Dashboard },
    { id: 'register', label: 'Registrar Perro', icon: PlusCircle, component: DogRegistration },
    { id: 'classify', label: 'Clasificar Perros', icon: Filter, component: DogClassification }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dog className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Sistema de Gestión de Perros</h1>
                <p className="text-sm text-muted-foreground">
                  Registro y clasificación de perros y sus dueños
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ActiveComponent />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Sistema de Gestión de Perros - Desarrollado con React y Flask</p>
            <p className="mt-1">Dashboard de uso general sin necesidad de login</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

