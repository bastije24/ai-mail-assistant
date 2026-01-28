import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, Info } from 'lucide-react';
import { mockPolicies } from '../../data/mockData';
import { OrgPolicies } from '../../types';
import { useToast } from '@/hooks/use-toast';

export const PoliciesPage = () => {
  const { toast } = useToast();
  const [policies, setPolicies] = useState<OrgPolicies>(mockPolicies);

  const handleChange = (key: keyof OrgPolicies, value: any) => {
    setPolicies(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Policy updated",
      description: "Your changes have been saved",
    });
  };

  const handleChannelChange = (channel: keyof OrgPolicies['allowedChannels'], checked: boolean) => {
    setPolicies(prev => ({
      ...prev,
      allowedChannels: {
        ...prev.allowedChannels,
        [channel]: checked,
      },
    }));
    toast({
      title: "Policy updated",
      description: "Notification channel settings saved",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Policies</h1>
        <p className="text-sm text-muted-foreground">
          Configure organization-wide security and communication policies
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Enterprise Safety Defaults:</strong> These policies help maintain security and compliance standards for your organization.
        </AlertDescription>
      </Alert>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Allowed Notification Channels</CardTitle>
          <CardDescription>
            Control which channels can be used for urgent notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'email' as const, label: 'Email', description: 'Standard email notifications' },
            { key: 'push' as const, label: 'Push Notifications', description: 'Browser and mobile push' },
            { key: 'teams' as const, label: 'Microsoft Teams', description: 'Teams channel integration' },
            { key: 'slack' as const, label: 'Slack', description: 'Slack channel integration' },
            { key: 'whatsapp' as const, label: 'WhatsApp', description: 'WhatsApp messaging for urgent alerts' },
          ].map(channel => (
            <div key={channel.key} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Checkbox
                  id={channel.key}
                  checked={policies.allowedChannels[channel.key]}
                  onCheckedChange={(checked) => 
                    handleChannelChange(channel.key, checked as boolean)
                  }
                />
                <div>
                  <Label htmlFor={channel.key} className="cursor-pointer">
                    {channel.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{channel.description}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reply Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Reply Policies</CardTitle>
          <CardDescription>
            Control how AI-generated replies are handled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <Label>Disable auto-send replies</Label>
              <p className="text-xs text-muted-foreground">
                AI suggestions require manual review before sending
              </p>
            </div>
            <Switch
              checked={policies.autoSendDisabled}
              onCheckedChange={(checked) => handleChange('autoSendDisabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <Label>Require approval for external replies</Label>
              <p className="text-xs text-muted-foreground">
                Replies to external emails need manager approval
              </p>
            </div>
            <Switch
              checked={policies.requireApprovalExternal}
              onCheckedChange={(checked) => handleChange('requireApprovalExternal', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
          <CardDescription>
            Configure how long email data is retained
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Retention period</Label>
            <Select 
              value={policies.dataRetentionDays.toString()}
              onValueChange={(v) => handleChange('dataRetentionDays', parseInt(v) as 30 | 90 | 180)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              Emails older than this period will be automatically archived
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
