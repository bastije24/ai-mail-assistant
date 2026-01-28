import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Route,
  ChevronRight,
  ChevronLeft,
  Building2,
  User,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockRoutingRules, mockDepartments, mockUsers } from '../../data/mockData';
import { RoutingRule, EmailPriority } from '../../types';
import { useToast } from '@/hooks/use-toast';

type WizardStep = 'conditions' | 'actions' | 'review';

export const RoutingPage = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState(mockRoutingRules);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<WizardStep>('conditions');
  
  // Wizard state
  const [ruleName, setRuleName] = useState('');
  const [conditions, setConditions] = useState({
    senderDomain: '',
    subjectKeywords: '',
    recipientAlias: '',
    aiCategory: '',
    priorityGte: '' as EmailPriority | '',
  });
  const [actions, setActions] = useState({
    assignTo: 'department' as 'department' | 'user',
    assignToId: '',
    priorityOverride: '' as EmailPriority | '',
    deadlineHours: '',
    requireApproval: false,
  });

  const toggleRuleEnabled = (ruleId: string) => {
    setRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
    toast({
      title: "Rule updated",
      description: "Routing rule has been updated",
    });
  };

  const resetWizard = () => {
    setCurrentStep('conditions');
    setRuleName('');
    setConditions({
      senderDomain: '',
      subjectKeywords: '',
      recipientAlias: '',
      aiCategory: '',
      priorityGte: '',
    });
    setActions({
      assignTo: 'department',
      assignToId: '',
      priorityOverride: '',
      deadlineHours: '',
      requireApproval: false,
    });
  };

  const handleCreateRule = () => {
    if (!ruleName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a rule name",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Rule created",
      description: `${ruleName} has been created`,
    });
    setWizardOpen(false);
    resetWizard();
  };

  const getAssignToName = () => {
    if (!actions.assignToId) return 'Not selected';
    if (actions.assignTo === 'department') {
      return mockDepartments.find(d => d.id === actions.assignToId)?.name || 'Unknown';
    }
    return mockUsers.find(u => u.id === actions.assignToId)?.name || 'Unknown';
  };

  const renderWizardStep = () => {
    switch (currentStep) {
      case 'conditions':
        return (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rule Name</Label>
              <Input
                placeholder="e.g., VIP Clients"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sender domain contains</Label>
              <Input
                placeholder="e.g., partner.com"
                value={conditions.senderDomain}
                onChange={(e) => setConditions({ ...conditions, senderDomain: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Subject contains keywords</Label>
              <Input
                placeholder="e.g., urgent, invoice (comma-separated)"
                value={conditions.subjectKeywords}
                onChange={(e) => setConditions({ ...conditions, subjectKeywords: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Recipient alias equals</Label>
              <Input
                placeholder="e.g., support@"
                value={conditions.recipientAlias}
                onChange={(e) => setConditions({ ...conditions, recipientAlias: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ai-primary" />
                AI Topic/Category
              </Label>
              <Select 
                value={conditions.aiCategory}
                onValueChange={(v) => setConditions({ ...conditions, aiCategory: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="billing">Billing & Payments</SelectItem>
                  <SelectItem value="support">Support Request</SelectItem>
                  <SelectItem value="sales">Sales Inquiry</SelectItem>
                  <SelectItem value="legal">Legal & Compliance</SelectItem>
                  <SelectItem value="hr">HR & Recruitment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Priority is at least</Label>
              <Select 
                value={conditions.priorityGte}
                onValueChange={(v) => setConditions({ ...conditions, priorityGte: v as EmailPriority })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'actions':
        return (
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Assign to</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={actions.assignTo === 'department' ? 'secondary' : 'outline'}
                  onClick={() => setActions({ ...actions, assignTo: 'department', assignToId: '' })}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Department
                </Button>
                <Button
                  type="button"
                  variant={actions.assignTo === 'user' ? 'secondary' : 'outline'}
                  onClick={() => setActions({ ...actions, assignTo: 'user', assignToId: '' })}
                >
                  <User className="h-4 w-4 mr-2" />
                  User
                </Button>
              </div>
              <Select 
                value={actions.assignToId}
                onValueChange={(v) => setActions({ ...actions, assignToId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${actions.assignTo}`} />
                </SelectTrigger>
                <SelectContent>
                  {actions.assignTo === 'department'
                    ? mockDepartments.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))
                    : mockUsers.filter(u => u.status === 'active').map(u => (
                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Priority override (optional)</Label>
              <Select 
                value={actions.priorityOverride}
                onValueChange={(v) => setActions({ ...actions, priorityOverride: v as EmailPriority })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Keep original priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Deadline (hours)</Label>
              <Select 
                value={actions.deadlineHours}
                onValueChange={(v) => setActions({ ...actions, deadlineHours: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No deadline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                  <SelectItem value="72">72 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label>Require approval</Label>
                <p className="text-xs text-muted-foreground">
                  Replies need manager approval
                </p>
              </div>
              <Switch
                checked={actions.requireApproval}
                onCheckedChange={(v) => setActions({ ...actions, requireApproval: v })}
              />
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4 py-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{ruleName || 'Untitled Rule'}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <p className="font-medium text-muted-foreground mb-1">When:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {conditions.senderDomain && <li>Sender domain contains "{conditions.senderDomain}"</li>}
                    {conditions.subjectKeywords && <li>Subject contains "{conditions.subjectKeywords}"</li>}
                    {conditions.recipientAlias && <li>Recipient is "{conditions.recipientAlias}"</li>}
                    {conditions.aiCategory && <li>AI category is "{conditions.aiCategory}"</li>}
                    {conditions.priorityGte && <li>Priority is at least "{conditions.priorityGte}"</li>}
                    {!conditions.senderDomain && !conditions.subjectKeywords && !conditions.recipientAlias && !conditions.aiCategory && !conditions.priorityGte && (
                      <li className="text-muted-foreground">No conditions set (matches all emails)</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Then:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Assign to {actions.assignTo}: {getAssignToName()}</li>
                    {actions.priorityOverride && <li>Set priority to "{actions.priorityOverride}"</li>}
                    {actions.deadlineHours && <li>Set deadline: {actions.deadlineHours} hours</li>}
                    {actions.requireApproval && <li>Require approval for replies</li>}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Routing Rules</h1>
          <p className="text-sm text-muted-foreground">
            Automatically route emails based on conditions
          </p>
        </div>
        <Button onClick={() => { resetWizard(); setWizardOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {rules.length === 0 ? (
        <EmptyState
          icon={Route}
          title="No routing rules"
          description="Create routing rules to automatically assign emails to departments or users."
          actionLabel="Create Rule"
          onAction={() => setWizardOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRuleEnabled(rule.id)}
                    />
                    <div>
                      <p className="font-medium">{rule.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          → {rule.actions.assignToName}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Last edited: {format(rule.lastEdited, 'MMM d')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Rule Wizard */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Routing Rule</DialogTitle>
            <DialogDescription>
              {currentStep === 'conditions' && 'Step 1: Define when this rule should apply'}
              {currentStep === 'actions' && 'Step 2: Define what should happen'}
              {currentStep === 'review' && 'Step 3: Review and save'}
            </DialogDescription>
          </DialogHeader>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {['conditions', 'actions', 'review'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`h-2 w-2 rounded-full ${
                  currentStep === step ? 'bg-primary' : 'bg-muted'
                }`} />
                {index < 2 && <div className="h-px w-8 bg-muted mx-1" />}
              </div>
            ))}
          </div>

          {renderWizardStep()}

          <DialogFooter className="flex-row justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep === 'conditions') {
                  setWizardOpen(false);
                } else if (currentStep === 'actions') {
                  setCurrentStep('conditions');
                } else {
                  setCurrentStep('actions');
                }
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep === 'conditions' ? 'Cancel' : 'Back'}
            </Button>
            <Button
              onClick={() => {
                if (currentStep === 'conditions') {
                  setCurrentStep('actions');
                } else if (currentStep === 'actions') {
                  setCurrentStep('review');
                } else {
                  handleCreateRule();
                }
              }}
            >
              {currentStep === 'review' ? 'Create Rule' : 'Next'}
              {currentStep !== 'review' && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
