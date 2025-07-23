import { useState } from "react";
import { Mail, Clock, Star, Paperclip } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmailDetailWithAI } from "@/components/EmailDetailWithAI";
import type { Email, EmailListProps } from "../types";

export const EmailsList = ({ emails }: EmailListProps) => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  
  const allEmails = [
    ...emails,
    {
      id: "3",
      from: "Peter Novák",
      fromEmail: "peter.novak@company.sk",
      to: ["you@company.sk"],
      subject: "Týždenný report - výsledky",
      content: "Ahoj, posielajú dokument s výsledkami za tento týždeň. Potrebujem váš feedback do piatku. Ďakujem!",
      timestamp: new Date("2024-01-13T09:15:00"),
      isRead: true,
      isUrgent: false,
      status: "read"
    },
    {
      id: "4", 
      from: "Anna Kováčová",
      fromEmail: "anna.kovacova@finance.sk",
      to: ["you@company.sk"],
      subject: "Faktúra č. 2024-001 - URGENT",
      content: "V prílohe nájdete faktúru za dodané služby. Prosím o kontrolu a potvrdenie platby do pondelka.",
      timestamp: new Date("2024-01-12T16:30:00"),
      isRead: false,
      isUrgent: true,
      status: "unread",
      hasAttachments: true
    },
    {
      id: "5",
      from: "Support Team",
      fromEmail: "support@company.sk",
      to: ["all@company.sk"],
      subject: "Systémová údržba - plánovaná odstávka",
      content: "Informujeme Vás o plánovanej údržbe systému v sobotu od 22:00 do 06:00. Počas tejto doby nebude systém dostupný.",
      timestamp: new Date("2024-01-11T08:00:00"),
      isRead: true,
      isUrgent: false,
      status: "read"
    },
    {
      id: "6",
      from: "Marketing Team",
      fromEmail: "marketing@company.sk", 
      to: ["you@company.sk"],
      subject: "Nová kampaň - potrebujem súhlas",
      content: "Ahoj, pripravili sme novú marketingovú kampaň pre Q1. Môžeš sa pozrieť na materiály a dať mi feedback?",
      timestamp: new Date("2024-01-10T14:20:00"),
      isRead: false,
      isUrgent: false,
      status: "unread"
    }
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('sk-SK', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    return date.toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (selectedEmail) {
    return (
      <EmailDetailWithAI 
        email={selectedEmail} 
        onBack={() => setSelectedEmail(null)}
      />
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <Mail className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Všetky emaily</h1>
          <p className="text-sm text-muted-foreground">Kliknite na email pre detail s AI asistentom</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{allEmails.length}</div>
            <div className="text-sm text-muted-foreground">Celkom emailov</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{allEmails.filter(e => !e.isRead).length}</div>
            <div className="text-sm text-muted-foreground">Neprečítané</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{allEmails.filter(e => e.isUrgent).length}</div>
            <div className="text-sm text-muted-foreground">Urgentné</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{allEmails.filter(e => e.isRead).length}</div>
            <div className="text-sm text-muted-foreground">Prečítané</div>
          </CardContent>
        </Card>
      </div>

      {/* Email List */}
      <div className="space-y-3">
        {allEmails.map((email) => (
          <Card 
            key={email.id} 
            className={`hover:shadow-md transition-all cursor-pointer ${
              !email.isRead ? 'border-l-4 border-l-ai-primary bg-blue-50/30' : ''
            }`}
            onClick={() => setSelectedEmail(email)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm font-medium">
                      {email.from.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${!email.isRead ? 'text-foreground' : 'text-muted-foreground'} line-clamp-1`}>
                        {email.subject}
                      </h3>
                      {email.isUrgent && (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          URGENT
                        </Badge>
                      )}
                      {!email.isRead && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Nové
                        </Badge>
                      )}
                      {email.hasAttachments && (
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Od: <span className="font-medium">{email.from}</span> &lt;{email.fromEmail}&gt;
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {email.content}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(email.timestamp)}</span>
                  </div>
                  {email.isUrgent && (
                    <Star className="h-4 w-4 text-red-500 fill-red-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};