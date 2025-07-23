import { Mail, Archive, Trash2, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Email {
  id: string;
  from: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead?: boolean;
  isUrgent?: boolean;
  status?: string;
}

interface AllEmailsProps {
  emails: Email[];
}

export const AllEmails = ({ emails }: AllEmailsProps) => {
  const allEmails = [
    ...emails,
    // Add more mock emails for demonstration
    {
      id: "3",
      from: "Peter Novák",
      subject: "Týždenný report - výsledky",
      content: "Ahoj, posielajdokument s výsledkami za tento týždeň...",
      timestamp: new Date("2024-01-13T09:15:00"),
      isRead: true,
      status: "read"
    },
    {
      id: "4", 
      from: "Anna Kováčová",
      subject: "Faktúra č. 2024-001",
      content: "V prílohe nájdete faktúru za dodané služby...",
      timestamp: new Date("2024-01-12T16:30:00"),
      isRead: false,
      isUrgent: true,
      status: "unread"
    },
    {
      id: "5",
      from: "Support Team",
      subject: "Systémová údržba - plánovaná odstávka",
      content: "Informujeme Vás o plánovanej údržbe systému...",
      timestamp: new Date("2024-01-11T08:00:00"),
      isRead: true,
      status: "read"
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleArchive = (emailId: string) => {
    console.log(`Archiving email ${emailId}`);
  };

  const handleDelete = (emailId: string) => {
    console.log(`Deleting email ${emailId}`);
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <Mail className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Všetky emaily</h1>
          <p className="text-sm text-muted-foreground">Kompletný prehľad všetkej emailovej komunikácie</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Hľadať v emailoch..." 
            className="pl-9"
          />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrovať podľa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Všetky</SelectItem>
            <SelectItem value="unread">Neprečítané</SelectItem>
            <SelectItem value="urgent">Urgentné</SelectItem>
            <SelectItem value="today">Dnes</SelectItem>
            <SelectItem value="week">Tento týždeň</SelectItem>
          </SelectContent>
        </Select>
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
          <Card key={email.id} className={`hover:shadow-sm transition-shadow ${!email.isRead ? 'border-l-4 border-l-ai-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-medium ${!email.isRead ? 'text-foreground' : 'text-muted-foreground'} line-clamp-1`}>
                      {email.subject}
                    </h3>
                    {email.isUrgent && (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Urgentné
                      </Badge>
                    )}
                    {!email.isRead && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Nové
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Od: {email.from}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{email.content}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-xs text-muted-foreground">{formatDate(email.timestamp)}</span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleArchive(email.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDelete(email.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};