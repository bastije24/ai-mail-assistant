import { Badge } from '@/components/ui/badge';
import { EmailPriority } from '../../types';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: EmailPriority;
  className?: string;
}

const priorityConfig: Record<EmailPriority, { label: string; className: string }> = {
  low: { 
    label: 'Low', 
    className: 'bg-muted text-muted-foreground hover:bg-muted' 
  },
  medium: { 
    label: 'Medium', 
    className: 'bg-ai-primary-light text-ai-primary hover:bg-ai-primary-light' 
  },
  high: { 
    label: 'High', 
    className: 'bg-ai-warning-light text-ai-warning hover:bg-ai-warning-light' 
  },
  urgent: { 
    label: 'Urgent', 
    className: 'bg-destructive/10 text-destructive hover:bg-destructive/10' 
  },
};

export const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};
