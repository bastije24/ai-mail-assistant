import { useState } from "react";
import { Send, Clock, FileEdit, Archive, Star, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ComposeEmailDialog } from "@/features/email";
import { EditEmailDialog } from "./EditEmailDialog";

interface Email {
  id: string;
  from: string;
  subject: string;
  content: string;
  timestamp: Date;
}

interface SendLaterProps {
  emails: Email[];
}

export const SendLater = ({ emails }: SendLaterProps) => {
  const [scheduledEmails, setScheduledEmails] = useState([
    {
      id: "1",
      to: "jan.novak@firma.sk",
      toName: "Jan Novák",
      subject: "Potvrdenie deadline a aktuálny stav projektu",
      scheduledFor: new Date("2024-01-16T09:00:00"),
      priority: "Vysoká",
      status: "scheduled",
      previewText: "Dobrý deň Jan, ďakujem za email ohľadom deadline. Môžem potvrdiť, že...",
      category: "Odpoveď"
    },
    {
      id: "2",
      to: "team@company.com",
      toName: "Development Team", 
      subject: "Weekly status update - týždeň 3",
      scheduledFor: new Date("2024-01-17T14:00:00"),
      priority: "Stredná",
      status: "scheduled",
      previewText: "Milý tím, týždenný súhrn našej práce a plány na budúci týždeň...",
      category: "Update"
    },
    {
      id: "3",
      to: "client@external.com", 
      toName: "Maria Johnson",
      subject: "Follow-up: Presentation feedback",
      scheduledFor: new Date("2024-01-19T10:30:00"),
      priority: "Stredná",
      status: "scheduled", 
      previewText: "Dear Maria, I wanted to follow up on yesterday's presentation...",
      category: "Follow-up"
    },
    {
      id: "4",
      to: "martin.kovac@email.com",
      toName: "Martin Kováč",
      subject: "Reminder: Monthly report due",
      scheduledFor: new Date("2024-01-15T08:00:00"),
      priority: "Nízka",
      status: "sent",
      previewText: "Pripomíname, že mesačný report je potrebné dodať do...",
      category: "Reminder"
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Vysoká": return "bg-red-100 text-red-800 border-red-200";
      case "Stredná": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Nízka": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Odpoveď": return "bg-blue-100 text-blue-800";
      case "Update": return "bg-purple-100 text-purple-800";
      case "Follow-up": return "bg-green-100 text-green-800";
      case "Reminder": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatScheduledTime = (date: Date) => {
    const now = new Date();
    const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0) return "Odoslané";
    if (diffHours < 24) {
      const hours = Math.ceil(diffHours);
      return `Za ${hours}h`;
    }
    
    return date.toLocaleDateString('sk-SK', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const scheduledCount = scheduledEmails.filter(e => e.status === "scheduled").length;
  const sentCount = scheduledEmails.filter(e => e.status === "sent").length;

  const handleEmailCreate = (newEmail: any) => {
    setScheduledEmails([...scheduledEmails, newEmail]);
  };

  const handleSendNow = (emailId: string) => {
    setScheduledEmails(emails => 
      emails.map(email => 
        email.id === emailId 
          ? { ...email, status: "sent", scheduledFor: new Date() }
          : email
      )
    );
  };

  const handleEmailUpdate = (updatedEmail: any) => {
    setScheduledEmails(emails => 
      emails.map(email => 
        email.id === updatedEmail.id ? updatedEmail : email
      )
    );
  };

  const handleArchive = (emailId: string) => {
    setScheduledEmails(emails => emails.filter(email => email.id !== emailId));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center">
          <Send className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Send Later</h1>
          <p className="text-sm text-muted-foreground">Naplánovanie emailov na neskoršie odoslanie</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{scheduledCount}</div>
            <div className="text-sm text-muted-foreground">Naplánované</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{sentCount}</div>
            <div className="text-sm text-muted-foreground">Odoslané</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-ai-primary">{scheduledEmails.length}</div>
            <div className="text-sm text-muted-foreground">Celkovo</div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Emails */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Naplánované emaily</h2>
          <ComposeEmailDialog onEmailCreate={handleEmailCreate}>
            <Button className="bg-ai-primary hover:bg-ai-primary/90">
              <FileEdit className="mr-2 h-4 w-4" />
              Nový email
            </Button>
          </ComposeEmailDialog>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {scheduledEmails.map((email) => (
            <Card 
              key={email.id} 
              className={`hover:shadow-sm transition-shadow cursor-pointer ${
                email.status === "sent" ? "opacity-75" : ""
              } ${
                email.status === "scheduled" ? "border-l-4 border-l-emerald-500" : ""
              }`}
              onClick={() => console.log(`Opening email detail for ${email.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {email.toName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground mb-1 line-clamp-1">
                        {email.subject}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Pre: {email.toName} &lt;{email.to}&gt;
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {email.previewText}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(email.priority)}>
                        {email.priority}
                      </Badge>
                      <Badge className={getCategoryColor(email.category)}>
                        {email.category}
                      </Badge>
                      {/* Three dots menu for options */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <EditEmailDialog email={email} onEmailUpdate={handleEmailUpdate}>
                            <DropdownMenuItem 
                              onClick={(e) => e.stopPropagation()}
                              onSelect={(e) => e.preventDefault()}
                            >
                              <FileEdit className="mr-2 h-4 w-4" />
                              Upraviť
                            </DropdownMenuItem>
                          </EditEmailDialog>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            console.log(`Changing time for email ${email.id}`);
                          }}>
                            <Clock className="mr-2 h-4 w-4" />
                            Zmeniť čas
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleSendNow(email.id);
                          }}>
                            <Send className="mr-2 h-4 w-4" />
                            Odoslať teraz
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchive(email.id);
                            }}
                            className="text-red-600"
                          >
                            <Archive className="mr-2 h-4 w-4" />
                            Archivovať
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {formatScheduledTime(email.scheduledFor)}
                      </span>
                    </div>
                    {/* Mark as done button */}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(email.id);
                      }}
                    >
                      Hotovo
                    </Button>
                  </div>
                </div>

                {email.status === "sent" && (
                  <div className="flex items-center gap-1 text-sm text-green-600 pt-2 border-t border-border">
                    <Star className="h-3 w-3" />
                    <span>Úspešne odoslané</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Schedule */}
      <Card className="bg-ai-primary-light border-ai-primary/20">
        <CardHeader>
          <CardTitle className="text-base">Rýchle plánovanie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => console.log("Naplánovanie na za 1 hodinu")}
            >
              Za 1 hodinu
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => console.log("Naplánovanie na zajtra ráno")}
            >
              Zajtra ráno
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => console.log("Naplánovanie na budúci týždeň")}
            >
              Budúci týždeň
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};