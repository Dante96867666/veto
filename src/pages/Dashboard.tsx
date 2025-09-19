import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle, User, Shield } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored login data
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutEnd');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      
      <div className="relative max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-success/10 rounded-full">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Bem-vindo ao sistema</p>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-glass bg-glass/50 hover:bg-glass/70 transition-colors"
            data-cy="logout-button"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-glass backdrop-blur-xl border-glass p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Perfil</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Gerenciar informações do usuário e configurações de conta.
            </p>
            <Button variant="outline" className="w-full" data-cy="profile-button">
              Ver Perfil
            </Button>
          </Card>

          <Card className="bg-glass backdrop-blur-xl border-glass p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-success/10 rounded-full">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Segurança</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Configurações de segurança e histórico de acesso.
            </p>
            <Button variant="outline" className="w-full" data-cy="security-button">
              Configurações
            </Button>
          </Card>

          <Card className="bg-glass backdrop-blur-xl border-glass p-6 md:col-span-2 lg:col-span-1">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Login Realizado</h3>
              <p className="text-muted-foreground">
                Você foi autenticado com sucesso no sistema.
              </p>
            </div>
          </Card>
        </div>

        <Card className="bg-glass backdrop-blur-xl border-glass mt-6 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Informações do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="text-success font-medium">Online</p>
            </div>
            <div>
              <p className="text-muted-foreground">Último Login</p>
              <p className="text-foreground font-medium">{new Date().toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Usuário</p>
              <p className="text-foreground font-medium">admin</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;