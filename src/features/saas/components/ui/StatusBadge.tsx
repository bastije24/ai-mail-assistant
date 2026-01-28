import { Badge } from '@/components/ui/badge';
import { EmailStatus, UserStatus } from '../../types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: EmailStatus | UserStatus;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  open: { 
    label: 'Open', 
    className: 'bg-ai-primary-light text-ai-primary hover:bg-ai-primary-light' 
  },
  in_progress: { 
    label: 'In Progress', 
    className: 'bg-ai-warning-light text-ai-warning hover:bg-ai-warning-light' 
  },
  waiting_approval: { 
    label: 'Waiting Approval', 
    className: 'bg-secondary text-secondary-foreground hover:bg-secondary' 
  },
  done: { 
    label: 'Done', 
    className: 'bg-ai-success-light text-ai-success hover:bg-ai-success-light' 
  },
  active: { 
    label: 'Active', 
    className: 'bg-ai-success-light text-ai-success hover:bg-ai-success-light' 
  },
  pending: { 
    label: 'Pending', 
    className: 'bg-ai-warning-light text-ai-warning hover:bg-ai-warning-light' 
  },
  invited: { 
    label: 'Invited', 
    className: 'bg-ai-primary-light text-ai-primary hover:bg-ai-primary-light' 
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.open;
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};
