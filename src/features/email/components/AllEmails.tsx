import { useState } from "react";
import { Mail, Archive, Trash2, Search, Filter, Reply, Eye, Tag, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComposeEmailDialog } from "./ComposeEmailDialog";
import { EmailTagManager } from "./EmailTagManager";
import { useEmailData } from "../hooks/useEmailData";
import { useToast } from "@/hooks/use-toast";
import type { Email, EmailListProps } from "../types";

export const AllEmails = ({ emails }: EmailListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const { updateEmailStatus, markAsRead } = useEmailData();
  const { toast } = useToast();

  // Combine original emails with mock emails for demonstration
  const allEmailsData = [
    ...emails,
    {
      id: "3",
      from: "Peter Novák",
      fromEmail: "peter.novak@company.sk",
      to: ["you@company.sk"],
      subject: "Týždenný report - výsledky",
      content: "Ahoj, posielajdokument s výsledkami za tento týždeň...",
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
      fromEmail: "support@company.sk",
      to: ["all@company.sk"],
      subject: "Systémová údržba - plánovaná odstávka",
      content: "Informujeme Vás o plánovanej údržbe systému...",
      timestamp: new Date("2024-01-11T08:00:00"),
      isRead: true,
      isUrgent: false,
      status: "read"
    }
  ];

  const filteredEmails = allEmailsData.filter(email => {
    // Only show non-deleted emails
    if (email.status === "deleted") return false;
    
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === "all" ||
                         (filterBy === "unread" && !email.isRead) ||
                         (filterBy === "urgent" && email.isUrgent) ||
                         (filterBy === "today" && new Date(email.timestamp).toDateString() === new Date().toDateString()) ||
                         (filterBy === "week" && new Date(email.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesFilter;
  });

  const allEmails = filteredEmails;

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
    const email = allEmailsData.find(e => e.id === emailId);
    updateEmailStatus(emailId, "archived");
    toast({
      title: "Email archivovaný",
      description: `"${email?.subject}" bol úspešne archivovaný`,
    });
  };

  const handleMoveToTrash = (emailId: string) => {
    const email = allEmailsData.find(e => e.id === emailId);
    updateEmailStatus(emailId, "deleted");
    toast({
      title: "Email presuntý do koša",
      description: `"${email?.subject}" bol presuntý do koša`,
    });
  };

  const handleViewEmail = (emailId: string) => {
    markAsRead(emailId);
    console.log(`Viewing email ${emailId}`);
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterBy} onValueChange={setFilterBy}>
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
                <div className="flex flex-col items-end gap-2 ml-4">
                  <span className="text-xs text-muted-foreground">{formatDate(email.timestamp)}</span>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleViewEmail(email.id)}
                      title="Zobraziť detail"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <ComposeEmailDialog 
                      replyTo={email.fromEmail || `${email.from}@email.com`}
                      subject={`Re: ${email.subject}`}
                    >
                      <Button 
                        size="sm" 
                        variant="ghost"
                        title="Odpovedať"
                      >
                        <Reply className="h-3 w-3" />
                      </Button>
                    </ComposeEmailDialog>
                    <EmailTagManager>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        title="Pridať tagy"
                      >
                        <Tag className="h-3 w-3" />
                      </Button>
                    </EmailTagManager>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleArchive(email.id)}
                      title="Archivovať"
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleMoveToTrash(email.id)}
                      title="Presunúť do koša"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
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