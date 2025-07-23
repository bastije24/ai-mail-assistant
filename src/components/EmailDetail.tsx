import { Clock, User, Mail, MoreVertical, Reply, ReplyAll, Forward, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { ComposeEmailDialog } from "./ComposeEmailDialog";

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
          <ComposeEmailDialog 
            replyTo={email.fromEmail}
            subject={`Re: ${email.subject}`}
          >
            <Button className="bg-ai-primary hover:bg-ai-primary/90">
              <Reply className="mr-2 h-4 w-4" />
              Odpovedať
            </Button>
          </ComposeEmailDialog>
          <ComposeEmailDialog 
            replyTo={[email.fromEmail, ...email.to].join(", ")}
            subject={`Re: ${email.subject}`}
          >
            <Button variant="outline">
              <ReplyAll className="mr-2 h-4 w-4" />
              Odpovedať všetkým
            </Button>
          </ComposeEmailDialog>
          <ComposeEmailDialog 
            subject={`Fwd: ${email.subject}`}
            content={`\n\n---------- Forwarded message ----------\nFrom: ${email.from} <${email.fromEmail}>\nSubject: ${email.subject}\n\n${email.content}`}
          >
            <Button variant="outline">
              <Forward className="mr-2 h-4 w-4" />
              Preposlať
            </Button>
          </ComposeEmailDialog>
          <Separator orientation="vertical" className="h-6" />
          <Button 
            variant="outline" 
            className="text-ai-success border-ai-success hover:bg-ai-success-light"
            onClick={() => console.log("Email označený ako hotový")}
          >
            <Check className="mr-2 h-4 w-4" />
            Označiť ako hotové
          </Button>
          <Button 
            variant="ghost"
            onClick={() => console.log("Email odložený na neskôr")}
          >
            Odložiť na neskôr
          </Button>
        </div>
      </div>
    </div>
  );
};