import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Chrome } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Microsoft icon component
const MicrosoftIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 21 21">
    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
  </svg>
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      toast({
        title: "Prihlásenie úspešné",
        description: "Vitajte späť v AINBOX MANAGER",
      });
      navigate('/app');
    }, 1000);
  };

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Prihlásenie úspešné",
        description: "Vitajte späť v AINBOX MANAGER",
      });
      navigate('/app');
    }, 1000);
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast({
        title: "Email je povinný",
        description: "Prosím zadajte váš pracovný email",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Magic link odoslaný",
        description: `Skontrolujte email ${email}`,
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary mb-4">
            <Mail className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">AINBOX MANAGER</h1>
          <p className="text-muted-foreground mt-2">Sign in to your organization</p>
        </div>

        <Card>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Choose your preferred sign in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* OAuth Buttons */}
            <Button
              variant="outline"
              className="w-full h-11 gap-3"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Chrome className="h-5 w-5" />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 gap-3"
              onClick={handleMicrosoftLogin}
              disabled={isLoading}
            >
              <MicrosoftIcon />
              Continue with Microsoft
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Magic Link */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleMagicLink}
                disabled={isLoading}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send magic link
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground pt-2">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-xs"
                onClick={() => navigate('/join')}
              >
                Join your organization
              </Button>
            </p>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
