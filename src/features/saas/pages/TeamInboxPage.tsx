import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Users,
  Building2,
  User,
  UserPlus,
} from 'lucide-react';
import { format } from 'date-fns';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { mockEmails, mockDepartments, mockUsers } from '../data/mockData';
import { EmailItem } from '../types';
import { cn } from '@/lib/utils';

export const TeamInboxPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [suggestedReply, setSuggestedReply] = useState('');
  const [assignType, setAssignType] = useState<'department' | 'user'>('user');

  // Filter emails by department
  const teamEmails = mockEmails.filter(e => e.departmentId);

  const filteredEmails = selectedDepartment === 'all'
    ? teamEmails
    : teamEmails.filter(e => e.departmentId === selectedDepartment);

  const handleEmailClick = (email: EmailItem) => {
    setSelectedEmail(email);
    setSuggestedReply(email.suggestedReply || '');
    setIsDetailOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 border-b bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Team Inbox</h1>
            <p className="text-sm text-muted-foreground">
              View and manage emails for your departments
            </p>
          </div>
          
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All Departments" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {mockDepartments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-auto">
        {filteredEmails.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No team emails"
            description="There are no emails assigned to this department."
          />
        ) : (
          <div className="divide-y">
            {/* Header row */}
            <div className="hidden md:flex items-center gap-4 px-4 md:px-6 py-3 bg-muted/50 text-sm font-medium text-muted-foreground">
              <div className="flex-1 min-w-0">Sender</div>
              <div className="flex-[2] min-w-0">Subject</div>
              <div className="w-24">Department</div>
              <div className="w-20">Priority</div>
              <div className="w-24">Status</div>
              <div className="w-24">SLA</div>
              <div className="w-28">Received</div>
            </div>

            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 px-4 md:px-6 py-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleEmailClick(email)}
              >
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

                <div className="w-24 hidden md:block">
                  <Badge variant="outline">{email.departmentName}</Badge>
                </div>
                
                <div className="w-20 hidden md:block">
                  <PriorityBadge priority={email.priority} />
                </div>
                
                <div className="w-24 hidden md:block">
                  <StatusBadge status={email.status} />
                </div>

                <div className="w-24 hidden md:block">
                  {email.deadline ? (
                    <span className={cn(
                      "text-sm",
                      new Date(email.deadline) < new Date() 
                        ? "text-destructive font-medium" 
                        : "text-muted-foreground"
                    )}>
                      {format(email.deadline, 'MMM d')}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </div>
                
                <div className="w-28 text-sm text-muted-foreground hidden md:block">
                  {format(email.receivedAt, 'MMM d, HH:mm')}
                </div>

                {/* Mobile badges */}
                <div className="flex items-center gap-2 md:hidden">
                  <Badge variant="outline">{email.departmentName}</Badge>
                  <PriorityBadge priority={email.priority} />
                  <span className="text-xs text-muted-foreground">
                    {format(email.receivedAt, 'MMM d')}
                  </span>
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
                      From: {selectedEmail.sender}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{selectedEmail.departmentName}</Badge>
                      <PriorityBadge priority={selectedEmail.priority} />
                    </div>
                  </div>
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
                  <Label className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-ai-primary" />
                    Suggested Reply
                  </Label>
                  <Textarea
                    value={suggestedReply}
                    onChange={(e) => setSuggestedReply(e.target.value)}
                    rows={6}
                    placeholder="AI will suggest a reply..."
                  />
                </div>

                {/* Re-assignment */}
                <div className="space-y-3">
                  <Label>Re-assign to</Label>
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

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Set Deadline
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Take Over
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
