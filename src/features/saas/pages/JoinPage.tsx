import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type JoinState = 'input' | 'pending' | 'success' | 'error';

export const JoinPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [state, setState] = useState<JoinState>('input');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setErrorMessage('Organization code is required');
      setState('error');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    // Simulate API call
    setTimeout(() => {
      if (code.toUpperCase() === 'ACME-2024-XYZ') {
        // Simulate approval mode
        setState('pending');
        toast({
          title: "Request submitted",
          description: "Your request has been sent to the admin",
        });
      } else if (code.toUpperCase() === 'INSTANT-JOIN') {
        setState('success');
        toast({
          title: "Successfully joined",
          description: "Welcome to ACME s.r.o.",
        });
        setTimeout(() => navigate('/app'), 1500);
      } else {
        setState('error');
        setErrorMessage('Invalid or expired organization code');
      }
      setIsLoading(false);
    }, 1000);
  };

  const renderContent = () => {
    switch (state) {
      case 'pending':
        return (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-ai-warning-light mb-2">
              <Clock className="h-8 w-8 text-ai-warning" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Pending Approval</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Your request to join has been submitted. The organization admin will review your request.
            </p>
            <p className="text-xs text-muted-foreground">
              You'll receive an email when your request is approved.
            </p>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Back to login
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-ai-success-light mb-2">
              <CheckCircle2 className="h-8 w-8 text-ai-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Welcome!</h3>
            <p className="text-muted-foreground text-sm">
              You've successfully joined the organization.
            </p>
            <p className="text-xs text-muted-foreground">Redirecting to dashboard...</p>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            {state === 'error' && errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="code">Organization Code</Label>
              <Input
                id="code"
                placeholder="e.g., ACME-2024-XYZ"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  if (state === 'error') setState('input');
                }}
                disabled={isLoading}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                The code is provided by your organization admin
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? 'Verifying...' : 'Join Organization'}
            </Button>

            <p className="text-xs text-center text-muted-foreground pt-2">
              Already have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-xs"
                onClick={() => navigate('/login')}
              >
                Sign in
              </Button>
            </p>
          </div>
        );
    }
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
          <p className="text-muted-foreground mt-2">Join your organization</p>
        </div>

        <Card>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Enter your code</CardTitle>
            <CardDescription>
              Use the code provided by your admin to join the organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
