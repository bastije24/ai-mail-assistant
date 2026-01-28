import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Copy,
  RefreshCw,
  Plus,
  X,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '../../context/AppContext';
import { useToast } from '@/hooks/use-toast';

export const SeatsPage = () => {
  const { organization, setOrganization } = useApp();
  const { toast } = useToast();
  const [newDomain, setNewDomain] = useState('');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(organization.joinCode);
    toast({
      title: "Copied!",
      description: "Join code copied to clipboard",
    });
  };

  const handleRotateCode = () => {
    const newCode = `ACME-${Date.now().toString(36).toUpperCase()}`;
    setOrganization({
      ...organization,
      joinCode: newCode,
      joinCodeExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    toast({
      title: "Code Rotated",
      description: "New join code has been generated",
    });
  };

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;
    if (organization.allowedDomains.includes(newDomain.trim())) {
      toast({
        title: "Domain exists",
        description: "This domain is already in the list",
        variant: "destructive",
      });
      return;
    }
    setOrganization({
      ...organization,
      allowedDomains: [...organization.allowedDomains, newDomain.trim()],
    });
    setNewDomain('');
    toast({
      title: "Domain added",
      description: `${newDomain} has been added to allowed domains`,
    });
  };

  const handleRemoveDomain = (domain: string) => {
    setOrganization({
      ...organization,
      allowedDomains: organization.allowedDomains.filter(d => d !== domain),
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Seats & Code</h1>
        <p className="text-sm text-muted-foreground">
          Manage your organization's subscription and join settings
        </p>
      </div>

      {/* Seats Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-ai-primary" />
            <CardTitle>Seats Usage</CardTitle>
          </div>
          <CardDescription>
            Your organization's seat allocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-4xl font-bold">{organization.seatsUsed}</span>
                <span className="text-2xl text-muted-foreground"> / {organization.seatsTotal}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {organization.seatsTotal - organization.seatsUsed} seats available
              </p>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-ai-primary transition-all"
                style={{ width: `${(organization.seatsUsed / organization.seatsTotal) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Join Code */}
      <Card>
        <CardHeader>
          <CardTitle>Join Code</CardTitle>
          <CardDescription>
            Share this code with team members to join your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 rounded-lg bg-muted font-mono text-lg tracking-wider">
              {organization.joinCode}
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyCode}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleRotateCode}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Expires: {format(organization.joinCodeExpiry, 'MMMM d, yyyy')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Domain Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle>Allowed Domains</CardTitle>
          <CardDescription>
            Only emails from these domains can join your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <Label>Restrict to allowed domains</Label>
              <p className="text-xs text-muted-foreground">
                Only allow users with email addresses from listed domains
              </p>
            </div>
            <Switch
              checked={organization.restrictToDomains}
              onCheckedChange={(checked) => 
                setOrganization({ ...organization, restrictToDomains: checked })
              }
            />
          </div>

          {organization.restrictToDomains && (
            <>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., company.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
                />
                <Button onClick={handleAddDomain}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {organization.allowedDomains.map(domain => (
                  <Badge key={domain} variant="secondary" className="gap-1 pr-1">
                    {domain}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveDomain(domain)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Approval Mode */}
      <Card>
        <CardHeader>
          <CardTitle>Join Approval</CardTitle>
          <CardDescription>
            Control how new members join your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <Label>Admin approval required</Label>
              <p className="text-xs text-muted-foreground">
                New members need admin approval before joining
              </p>
            </div>
            <Switch
              checked={organization.joinMode === 'approval'}
              onCheckedChange={(checked) => 
                setOrganization({ ...organization, joinMode: checked ? 'approval' : 'open' })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Billing (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>
            Your subscription details (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plan</span>
              <Badge>{organization.plan}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline" className="bg-ai-success-light text-ai-success">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Invoice contact</span>
              <span>billing@acme.sk</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
