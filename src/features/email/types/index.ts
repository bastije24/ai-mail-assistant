export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  to: string[];
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isUrgent: boolean;
  status: string;
  hasAttachments?: boolean;
}

export interface EmailListProps {
  emails: Email[];
}

export interface EmailDetailProps {
  email: Email;
}