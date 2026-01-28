import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  UserPlus,
  MoreHorizontal,
  Clock,
  Building2,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { mockEmails, mockDepartments, mockUsers } from '../data/mockData';
import { EmailItem, EmailPriority } from '../types';
import { cn } from '@/lib/utils';

export const MyInboxPage = () => {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [suggestedReply, setSuggestedReply] = useState('');
  const [assignType, setAssignType] = useState<'department' | 'user'>('department');
  const [requireApproval, setRequireApproval] = useState(false);

  // Filter emails assigned to current user or unassigned
  const myEmails = mockEmails.filter(e => 
    e.assignedToId === 'user-1' || (!e.assignedToId && !e.departmentId)
  );

  const filteredEmails = selectedTab === 'all' 
    ? myEmails 
    : myEmails.filter(e => e.priority === selectedTab);

  const priorityCounts = {
    all: myEmails.length,
    urgent: myEmails.filter(e => e.priority === 'urgent').length,
    high: myEmails.filter(e => e.priority === 'high').length,
    medium: myEmails.filter(e => e.priority === 'medium').length,
    low: myEmails.filter(e => e.priority === 'low').length,
  };

  const handleEmailClick = (email: EmailItem) => {
    setSelectedEmail(email);
    setSuggestedReply(email.suggestedReply || '');
    setIsDetailOpen(true);
  };

  const toggleSelectEmail = (emailId: string) => {
    setSelectedEmails(prev =>
      prev.includes(emailId)
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEmails.length === filteredEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(filteredEmails.map(e => e.id));
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 border-b bg-card">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-foreground">My Inbox</h1>
          {selectedEmails.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedEmails.length} selected
              </span>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Assign
              </Button>
              <Button variant="outline" size="sm">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Done
              </Button>
            </div>
          )}
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">
              All <Badge variant="secondary" className="ml-2">{priorityCounts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="urgent">
              Urgent <Badge variant="secondary" className="ml-2">{priorityCounts.urgent}</Badge>
            </TabsTrigger>
            <TabsTrigger value="high">
              High <Badge variant="secondary" className="ml-2">{priorityCounts.high}</Badge>
            </TabsTrigger>
            <TabsTrigger value="medium">
              Medium <Badge variant="secondary" className="ml-2">{priorityCounts.medium}</Badge>
            </TabsTrigger>
            <TabsTrigger value="low">
              Low <Badge variant="secondary" className="ml-2">{priorityCounts.low}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-auto">
        {filteredEmails.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="All caught up!"
            description="No emails in this category. Great job staying on top of things."
          />
        ) : (
          <div className="divide-y">
            {/* Header row */}
            <div className="hidden md:flex items-center gap-4 px-4 md:px-6 py-3 bg-muted/50 text-sm font-medium text-muted-foreground">
              <Checkbox
                checked={selectedEmails.length === filteredEmails.length && filteredEmails.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <div className="flex-1 min-w-0">Sender</div>
              <div className="flex-[2] min-w-0">Subject</div>
              <div className="w-20">Priority</div>
              <div className="w-24">Status</div>
              <div className="w-28">Received</div>
              <div className="w-10"></div>
            </div>

            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className={cn(
                  "flex flex-col md:flex-row md:items-center gap-2 md:gap-4 px-4 md:px-6 py-4 hover:bg-muted/50 cursor-pointer transition-colors",
                  selectedEmails.includes(email.id) && "bg-muted/30"
                )}
                onClick={() => handleEmailClick(email)}
              >
                <Checkbox
                  checked={selectedEmails.includes(email.id)}
                  onCheckedChange={() => toggleSelectEmail(email.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{email.sender}</p>
                  <p className="text-xs text-muted-foreground truncate md:hidden">{email.senderEmail}</p>
                </div>
                
                <div className="flex-[2] min-w-0">
                  <p className="text-foreground truncate">{email.subject}</p>
                  {email.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {email.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="w-20 hidden md:block">
                  <PriorityBadge priority={email.priority} />
                </div>
                
                <div className="w-24 hidden md:block">
                  <StatusBadge status={email.status} />
                </div>
                
                <div className="w-28 text-sm text-muted-foreground hidden md:block">
                  {format(email.receivedAt, 'MMM d, HH:mm')}
                </div>

                {/* Mobile badges */}
                <div className="flex items-center gap-2 md:hidden">
                  <PriorityBadge priority={email.priority} />
                  <StatusBadge status={email.status} />
                  <span className="text-xs text-muted-foreground">
                    {format(email.receivedAt, 'MMM d')}
                  </span>
                </div>
                
                <div className="w-10 hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="h-4 w-4 mr-2" />
                        Set Deadline
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Done
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedEmail && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle className="text-lg">{selectedEmail.subject}</SheetTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      From: {selectedEmail.sender} ({selectedEmail.senderEmail})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(selectedEmail.receivedAt, 'MMMM d, yyyy at HH:mm')}
                    </p>
                  </div>
                  <PriorityBadge priority={selectedEmail.priority} />
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* AI Summary */}
                {selectedEmail.summary && (
                  <div className="p-4 rounded-lg bg-ai-primary-light border border-ai-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-ai-primary" />
                      <span className="text-sm font-medium text-ai-primary">AI Summary</span>
                    </div>
                    <p className="text-sm text-foreground">{selectedEmail.summary}</p>
                  </div>
                )}

                {/* Suggested Reply */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-ai-primary" />
                      Suggested Reply
                    </Label>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Regenerate
                    </Button>
                  </div>
                  <Textarea
                    value={suggestedReply}
                    onChange={(e) => setSuggestedReply(e.target.value)}
                    rows={6}
                    placeholder="AI will suggest a reply..."
                  />
                </div>

                {/* Assignment */}
                <div className="space-y-3">
                  <Label>Assignment</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={assignType === 'department' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setAssignType('department')}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Department
                    </Button>
                    <Button
                      variant={assignType === 'user' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setAssignType('user')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      User
                    </Button>
                  </div>
                  
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${assignType}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {assignType === 'department' 
                        ? mockDepartments.map(dept => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))
                        : mockUsers.filter(u => u.status === 'active').map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                {/* Approval Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <Label>Request Approval</Label>
                    <p className="text-xs text-muted-foreground">
                      Reply will require manager approval
                    </p>
                  </div>
                  <Switch
                    checked={requireApproval}
                    onCheckedChange={setRequireApproval}
                  />
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Set Deadline
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Create Event
                  </Button>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1">Send Reply</Button>
                  <Button variant="secondary" className="flex-1">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Done
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
