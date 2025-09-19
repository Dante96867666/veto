import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, User, AlertCircle } from 'lucide-react';

const MOCK_CREDENTIALS = {
  username: 'admin',
  password: '123456'
};

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEnd, setLockoutEnd] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  
  const navigate = useNavigate();

  // Check for existing lockout on component mount
  useEffect(() => {
    const storedAttempts = localStorage.getItem('loginAttempts');
    const storedLockoutEnd = localStorage.getItem('lockoutEnd');
    
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts));
    }
    
    if (storedLockoutEnd) {
      const lockoutEndTime = parseInt(storedLockoutEnd);
      const now = Date.now();
      
      if (now < lockoutEndTime) {
        setIsLocked(true);
        setLockoutEnd(lockoutEndTime);
        setRemainingTime(Math.ceil((lockoutEndTime - now) / 1000));
      } else {
        // Lockout has expired, reset attempts
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockoutEnd');
        setAttempts(0);
      }
    }
  }, []);

  // Update remaining time countdown
  useEffect(() => {
    if (isLocked && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setLockoutEnd(null);
            setAttempts(0);
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('lockoutEnd');
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked, remainingTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) return;
    
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!password || password.trim() === '') {
      setError('Senha incorreta');
      setIsLoading(false);
      return;
    }

    if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
      // Successful login - reset attempts
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockoutEnd');
      setIsLoading(false);
      navigate('/dashboard');
    } else {
      // Failed login
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      
      if (newAttempts >= MAX_ATTEMPTS) {
        // Lock the account
        const lockoutEndTime = Date.now() + LOCKOUT_DURATION;
        setIsLocked(true);
        setLockoutEnd(lockoutEndTime);
        setRemainingTime(LOCKOUT_DURATION / 1000);
        localStorage.setItem('lockoutEnd', lockoutEndTime.toString());
        setError(`Muitas tentativas de login. Tente novamente em 15 minutos.`);
      } else {
        setError(`Senha incorreta. ${MAX_ATTEMPTS - newAttempts} tentativa(s) restante(s).`);
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      
      <Card className="w-full max-w-md bg-glass backdrop-blur-xl border-glass shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-secondary opacity-50"></div>
        <div className="relative p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Login</h1>
            <p className="text-muted-foreground">Entre com suas credenciais</p>
          </div>

          {error && (
            <Alert className="mb-6 border-destructive/20 bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {isLocked && (
            <Alert className="mb-6 border-warning/20 bg-warning/10">
              <Lock className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning">
                Conta bloqueada. Tempo restante: {formatTime(remainingTime)}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">Nome de usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-input/50 border-border/50 focus:border-primary/50 transition-colors"
                  disabled={isLocked}
                  data-cy="username-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-input/50 border-border/50 focus:border-primary/50 transition-colors"
                  disabled={isLocked}
                  data-cy="password-input"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={isLoading || isLocked}
              data-cy="login-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Usuário de teste: admin</p>
            <p>Senha de teste: 123456</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;