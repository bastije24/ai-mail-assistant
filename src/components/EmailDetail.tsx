import { Clock, User, Mail, MoreVertical, Reply, ReplyAll, Forward, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";

interface Email {
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
}

interface EmailDetailProps {
  email: Email;
}

export const EmailDetail = ({ email }: EmailDetailProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('sk-SK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex-1 bg-background border-r border-ai-border flex flex-col">
      {/* Header */}
      <div className="p-8 border-b border-ai-border bg-card">
        <div className="max-w-4xl mx-auto">
          {/* Status and Actions Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {email.isUrgent && (
                <Badge variant="destructive" className="bg-email-urgent text-white">
                  Urgentné
                </Badge>
              )}
              {!email.isRead && (
                <Badge variant="secondary" className="bg-email-unread text-white">
                  Neprečítané
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          {/* Email Header Info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              {email.subject}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {email.from.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium text-foreground">{email.from}</span>
                  <span className="text-muted-foreground ml-2">&lt;{email.fromEmail}&gt;</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDate(email.timestamp)}</span>
              </div>
            </div>

            {email.to.length > 1 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>Pre: {email.to.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Summary (if available) */}
      <div className="px-8 py-4 bg-ai-primary-light border-b border-ai-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 bg-ai-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-white font-medium">AI</span>
            </div>
            <div className="text-sm">
              <p className="text-ai-primary font-medium mb-1">AI Súhrn:</p>
              <p className="text-muted-foreground">
                Email obsahuje urgentný deadline do piatka. Potrebné schválenie materiálov pre klienta do pondelka.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-line text-foreground leading-relaxed">
              {email.content}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-8 border-t border-ai-border bg-card">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button className="bg-ai-primary hover:bg-ai-primary/90">
            <Reply className="mr-2 h-4 w-4" />
            Odpovedať
          </Button>
          <Button variant="outline">
            <ReplyAll className="mr-2 h-4 w-4" />
            Odpovedať všetkým
          </Button>
          <Button variant="outline">
            <Forward className="mr-2 h-4 w-4" />
            Preposlať
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" className="text-ai-success border-ai-success hover:bg-ai-success-light">
            <Check className="mr-2 h-4 w-4" />
            Označiť ako hotové
          </Button>
          <Button variant="ghost">
            Odložiť na neskôr
          </Button>
        </div>
      </div>
    </div>
  );
};