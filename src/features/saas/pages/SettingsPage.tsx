import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  User,
  Bell,
  Pen,
  Clock,
  Mail,
  Link2,
  Check,
  Smartphone,
  Chrome,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
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

export const SettingsPage = () => {
  const { currentUser, setCurrentUser } = useApp();
  const { toast } = useToast();
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser.whatsappNumber || '');

  const handleSave = (field: string) => {
    toast({
      title: "Settings saved",
      description: `Your ${field} has been updated`,
    });
  };

  const handleVerifyWhatsApp = () => {
    if (!whatsappNumber) {
      toast({
        title: "Number required",
        description: "Please enter your WhatsApp number",
        variant: "destructive",
      });
      return;
    }
    setOtpDialogOpen(true);
  };

  const handleOtpSubmit = () => {
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }
    setCurrentUser({ ...currentUser, whatsappNumber });
    setOtpDialogOpen(false);
    setOtpCode('');
    toast({
      title: "WhatsApp verified",
      description: "Your number has been verified successfully",
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="accounts" className="gap-2">
            <Link2 className="h-4 w-4" />
            <span className="hidden sm:inline">Accounts</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="writing" className="gap-2">
            <Pen className="h-4 w-4" />
            <span className="hidden sm:inline">Writing</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your basic profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  defaultValue={currentUser.name}
                  onBlur={() => handleSave('name')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={currentUser.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue={currentUser.timezone || 'Europe/Bratislava'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Bratislava">Europe/Bratislava (CET)</SelectItem>
                    <SelectItem value="Europe/Prague">Europe/Prague (CET)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connected Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>
                Connect your email accounts to receive and send emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Gmail */}
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <Chrome className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium">Gmail</p>
                    <p className="text-sm text-muted-foreground">Google Workspace</p>
                  </div>
                </div>
                {currentUser.connectedAccounts?.gmail ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-ai-success-light text-ai-success">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button variant="ghost" size="sm">Disconnect</Button>
                  </div>
                ) : (
                  <Button>Connect</Button>
                )}
              </div>

              {/* Outlook */}
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-ai-primary-light flex items-center justify-center">
                    <MicrosoftIcon />
                  </div>
                  <div>
                    <p className="font-medium">Outlook</p>
                    <p className="text-sm text-muted-foreground">Microsoft 365</p>
                  </div>
                </div>
                {currentUser.connectedAccounts?.outlook ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-ai-success-light text-ai-success">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button variant="ghost" size="sm">Disconnect</Button>
                  </div>
                ) : (
                  <Button>Connect</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Notifications</CardTitle>
              <CardDescription>
                Get urgent email notifications via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number (E.164 format)</Label>
                <div className="flex gap-2">
                  <Input
                    id="whatsapp"
                    placeholder="+421901234567"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                  <Button onClick={handleVerifyWhatsApp}>
                    Verify
                  </Button>
                </div>
                {currentUser.whatsappNumber && (
                  <Badge variant="outline" className="bg-ai-success-light text-ai-success">
                    <Check className="h-3 w-3 mr-1" />
                    Verified: {currentUser.whatsappNumber}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Urgent Mode</CardTitle>
              <CardDescription>
                Configure when you receive urgent notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <Label>Enable urgent mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive instant notifications for urgent emails
                  </p>
                </div>
                <Switch
                  checked={currentUser.urgentMode}
                  onCheckedChange={(checked) => {
                    setCurrentUser({ ...currentUser, urgentMode: checked });
                    handleSave('urgent mode');
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Notification threshold</Label>
                <Select 
                  value={currentUser.urgentThreshold}
                  onValueChange={(v) => {
                    setCurrentUser({ ...currentUser, urgentThreshold: v as 'urgent' | 'high_urgent' });
                    handleSave('threshold');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent only</SelectItem>
                    <SelectItem value="high_urgent">High + Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quiet hours</Label>
                <div className="flex items-center gap-2">
                  <Input type="time" defaultValue="22:00" className="w-32" />
                  <span className="text-muted-foreground">to</span>
                  <Input type="time" defaultValue="07:00" className="w-32" />
                </div>
                <p className="text-xs text-muted-foreground">
                  No notifications during these hours
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Brief</CardTitle>
              <CardDescription>
                Get a daily summary of your inbox
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Delivery time</Label>
                <Input 
                  type="time" 
                  defaultValue={currentUser.dailyBriefTime || '08:00'} 
                  className="w-32"
                  onChange={() => handleSave('daily brief time')}
                />
              </div>

              <div className="space-y-2">
                <Label>Delivery channels</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="brief-email"
                      checked={currentUser.dailyBriefChannels.includes('email')}
                      onCheckedChange={(checked) => {
                        const channels = checked
                          ? [...currentUser.dailyBriefChannels, 'email' as const]
                          : currentUser.dailyBriefChannels.filter(c => c !== 'email');
                        setCurrentUser({ ...currentUser, dailyBriefChannels: channels });
                      }}
                    />
                    <Label htmlFor="brief-email" className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="brief-push"
                      checked={currentUser.dailyBriefChannels.includes('push')}
                      onCheckedChange={(checked) => {
                        const channels = checked
                          ? [...currentUser.dailyBriefChannels, 'push' as const]
                          : currentUser.dailyBriefChannels.filter(c => c !== 'push');
                        setCurrentUser({ ...currentUser, dailyBriefChannels: channels });
                      }}
                    />
                    <Label htmlFor="brief-push" className="flex items-center gap-1">
                      <Smartphone className="h-4 w-4" />
                      Push
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Writing Style Tab */}
        <TabsContent value="writing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Writing Style</CardTitle>
              <CardDescription>
                Configure your preferred tone for AI-generated replies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default tone</Label>
                <Select 
                  value={currentUser.tone}
                  onValueChange={(v) => {
                    setCurrentUser({ ...currentUser, tone: v as 'formal' | 'friendly' | 'short' });
                    handleSave('writing tone');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="short">Short & Direct</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This affects how AI generates reply suggestions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* OTP Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify WhatsApp Number</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code sent to {whatsappNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground text-center">
              Didn't receive the code? <Button variant="link" className="p-0 h-auto text-xs">Resend</Button>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOtpDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleOtpSubmit}>
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
