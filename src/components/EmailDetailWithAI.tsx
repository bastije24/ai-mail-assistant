import { useState } from "react";
import { ArrowLeft, Clock, User, MoreVertical, Reply, ReplyAll, Forward, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { ComposeEmailDialog } from "./ComposeEmailDialog";
import { ComposeEmailReply } from "./ComposeEmailReply";
import { EmailSpecificAI } from "./EmailSpecificAI";

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
  hasAttachments?: boolean;
}

interface EmailDetailWithAIProps {
  email: Email;
  onBack: () => void;
}

export const EmailDetailWithAI = ({ email, onBack }: EmailDetailWithAIProps) => {
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);

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
    <div className="h-screen flex bg-background">
      {/* Email Detail - Left Side */}
      <div className="flex-1 bg-background border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-card">
          <div className="max-w-4xl mx-auto">
            {/* Back Button and Status */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Späť na zoznam
              </Button>
              <div className="flex items-center gap-3">
                {email.isUrgent && (
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    URGENT
                  </Badge>
                )}
                {!email.isRead && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Neprečítané
                  </Badge>
                )}
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
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

        {/* Email Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-line text-foreground leading-relaxed">
                {email.content}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-border bg-card">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Button 
              className="bg-ai-primary hover:bg-ai-primary/90"
              onClick={() => setReplyDialogOpen(true)}
            >
              <Reply className="mr-2 h-4 w-4" />
              Odpovedať
            </Button>
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
              className="text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => console.log("Email označený ako hotový")}
            >
              <Check className="mr-2 h-4 w-4" />
              Označiť ako hotové
            </Button>
          </div>
        </div>
      </div>

      {/* AI Assistant Panel - Right Side */}
      <EmailSpecificAI email={email} />

      <ComposeEmailReply 
        email={email}
        open={replyDialogOpen}
        onOpenChange={setReplyDialogOpen}
      />
    </div>
  );
};