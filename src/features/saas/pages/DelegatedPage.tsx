import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { mockEmails, mockUsers } from '../data/mockData';
import { EmailItem, EmailStatus } from '../types';
import { cn } from '@/lib/utils';

// Simulated delegated items
const delegatedEmails = mockEmails
  .filter(e => e.assignedToId && e.assignedToId !== 'user-1')
  .map(e => ({
    ...e,
    delegatedBy: 'user-1',
    delegatedTo: mockUsers.find(u => u.id === e.assignedToId)?.name || 'Unknown',
    lastUpdate: new Date(),
  }));

export const DelegatedPage = () => {
  const [selectedEmail, setSelectedEmail] = useState<typeof delegatedEmails[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<EmailStatus | 'all'>('all');

  const filteredEmails = statusFilter === 'all'
    ? delegatedEmails
    : delegatedEmails.filter(e => e.status === statusFilter);

  const statusCounts = {
    all: delegatedEmails.length,
    open: delegatedEmails.filter(e => e.status === 'open').length,
    in_progress: delegatedEmails.filter(e => e.status === 'in_progress').length,
    waiting_approval: delegatedEmails.filter(e => e.status === 'waiting_approval').length,
    done: delegatedEmails.filter(e => e.status === 'done').length,
  };

  const handleEmailClick = (email: typeof delegatedEmails[0]) => {
    setSelectedEmail(email);
    setIsDetailOpen(true);
  };

  const getStatusIcon = (status: EmailStatus) => {
    switch (status) {
      case 'done': return <CheckCircle2 className="h-4 w-4 text-ai-success" />;
      case 'in_progress': return <RefreshCw className="h-4 w-4 text-ai-warning" />;
      case 'waiting_approval': return <Clock className="h-4 w-4 text-muted-foreground" />;
      default: return <AlertCircle className="h-4 w-4 text-ai-primary" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 border-b bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Delegated</h1>
            <p className="text-sm text-muted-foreground">
              Track emails you've delegated to others
            </p>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { key: 'all' as const, label: 'All' },
            { key: 'open' as const, label: 'Open' },
            { key: 'in_progress' as const, label: 'In Progress' },
            { key: 'waiting_approval' as const, label: 'Waiting Approval' },
            { key: 'done' as const, label: 'Done' },
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={statusFilter === key ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(key)}
              className="gap-1"
            >
              {label}
              <Badge variant="secondary" className="ml-1">
                {statusCounts[key]}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Delegated List */}
      <div className="flex-1 overflow-auto">
        {filteredEmails.length === 0 ? (
          <EmptyState
            icon={Send}
            title="No delegated emails"
            description="You haven't delegated any emails yet. Assign emails to team members from your inbox."
          />
        ) : (
          <div className="divide-y">
            {/* Header row */}
            <div className="hidden md:flex items-center gap-4 px-4 md:px-6 py-3 bg-muted/50 text-sm font-medium text-muted-foreground">
              <div className="w-8"></div>
              <div className="flex-[2] min-w-0">Subject</div>
              <div className="flex-1 min-w-0">Assigned To</div>
              <div className="w-32">Status</div>
              <div className="w-28">Last Update</div>
              <div className="w-10"></div>
            </div>

            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 px-4 md:px-6 py-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleEmailClick(email)}
              >
                <div className="w-8 hidden md:flex items-center justify-center">
                  {getStatusIcon(email.status)}
                </div>
                
                <div className="flex-[2] min-w-0">
                  <p className="font-medium text-foreground truncate">{email.subject}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    From: {email.sender}
                  </p>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-foreground">{email.delegatedTo}</p>
                </div>
                
                <div className="w-32 hidden md:block">
                  <StatusBadge status={email.status} />
                </div>
                
                <div className="w-28 text-sm text-muted-foreground hidden md:block">
                  {format(email.lastUpdate, 'MMM d, HH:mm')}
                </div>

                {/* Mobile badges */}
                <div className="flex items-center gap-2 md:hidden">
                  {getStatusIcon(email.status)}
                  <StatusBadge status={email.status} />
                  <span className="text-xs text-muted-foreground">
                    → {email.delegatedTo}
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
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Take Back
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="h-4 w-4 mr-2" />
                        Send Reminder
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

      {/* Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedEmail && (
            <>
              <SheetHeader className="mb-6">
                <div>
                  <SheetTitle className="text-lg">{selectedEmail.subject}</SheetTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    From: {selectedEmail.sender}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <StatusBadge status={selectedEmail.status} />
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Assignment Info */}
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Assigned to</span>
                    <span className="font-medium">{selectedEmail.delegatedTo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Received</span>
                    <span className="text-sm">{format(selectedEmail.receivedAt, 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last update</span>
                    <span className="text-sm">{format(selectedEmail.lastUpdate, 'MMM d, HH:mm')}</span>
                  </div>
                </div>

                {/* Timeline placeholder */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Activity</h4>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-ai-primary mt-2" />
                      <div>
                        <p className="text-sm">Assigned to {selectedEmail.delegatedTo}</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2" />
                      <div>
                        <p className="text-sm">Email received</p>
                        <p className="text-xs text-muted-foreground">{format(selectedEmail.receivedAt, 'MMM d, HH:mm')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Take Back
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Remind
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
