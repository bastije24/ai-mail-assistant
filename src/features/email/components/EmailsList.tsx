import { useState } from "react";
import { Mail, Clock, Star, Paperclip, MoreVertical, Archive, Trash2, Eye, Reply, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmailDetailWithAI } from "@/components/EmailDetailWithAI";
import { useEmailData } from "../hooks/useEmailData";
import { useToast } from "@/hooks/use-toast";
import type { Email, EmailListProps } from "../types";

export const EmailsList = ({ emails }: EmailListProps) => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const { updateEmailStatus, markAsRead } = useEmailData();
  const { toast } = useToast();
  
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

  const handleArchive = (emailId: string, emailSubject: string) => {
    updateEmailStatus(emailId, "archived");
    toast({
      title: "Email archivovaný",
      description: `"${emailSubject}" bol úspešne archivovaný`,
    });
  };

  const handleDelete = (emailId: string, emailSubject: string) => {
    updateEmailStatus(emailId, "deleted");
    toast({
      title: "Email presuntý do koša",
      description: `"${emailSubject}" bol presuntý do koša`,
    });
  };

  const handleMarkAsRead = (emailId: string) => {
    markAsRead(emailId);
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
    <div className="w-full h-full flex flex-col p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="h-8 w-8 md:h-10 md:w-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <Mail className="h-4 w-4 md:h-5 md:w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-foreground">Všetky emaily</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Kliknite na email pre detail s AI asistentom</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-xl md:text-2xl font-bold text-foreground">{allEmails.length}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Celkom emailov</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-xl md:text-2xl font-bold text-orange-600">{allEmails.filter(e => !e.isRead).length}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Neprečítané</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-xl md:text-2xl font-bold text-red-600">{allEmails.filter(e => e.isUrgent).length}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Urgentné</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-xl md:text-2xl font-bold text-green-600">{allEmails.filter(e => e.isRead).length}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Prečítané</div>
          </CardContent>
        </Card>
      </div>

      {/* Email List */}
      <div className="space-y-3">
        {allEmails.map((email) => (
          <Card 
            key={email.id} 
            className={`hover:shadow-md transition-all ${
              !email.isRead ? 'border-l-4 border-l-ai-primary bg-blue-50/30' : ''
            }`}
          >
            <CardContent className="p-3 md:p-4">
              <div className="flex items-start justify-between">
                <div 
                  className="flex items-start gap-2 md:gap-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => setSelectedEmail(email)}
                >
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
                    <AvatarFallback className="text-xs md:text-sm font-medium">
                      {email.from.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-1">
                      <h3 className={`font-medium text-sm md:text-base ${!email.isRead ? 'text-foreground' : 'text-muted-foreground'} line-clamp-2 md:line-clamp-1 flex-1`}>
                        {email.subject}
                      </h3>
                      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                        {email.isUrgent && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs px-1 py-0">
                            URGENT
                          </Badge>
                        )}
                        {!email.isRead && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-1 py-0">
                            Nové
                          </Badge>
                        )}
                        {email.hasAttachments && (
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 line-clamp-1">
                      Od: <span className="font-medium">{email.from}</span>
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {email.content}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1 md:gap-2 ml-2 md:ml-4 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{formatDate(email.timestamp)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {email.isUrgent && (
                      <Star className="h-3 w-3 md:h-4 md:w-4 text-red-500 fill-red-500" />
                    )}
                    
                    {/* Email Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 hover:bg-secondary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmail(email);
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          Zobraziť detail
                        </DropdownMenuItem>
                        
                        {!email.isRead && (
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(email.id);
                          }}>
                            <Mail className="mr-2 h-4 w-4" />
                            Označiť ako prečítané
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleArchive(email.id, email.subject);
                        }}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archivovať
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(email.id, email.subject);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Presunúť do koša
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};