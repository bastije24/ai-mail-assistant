import { useState } from "react";
import { Archive as ArchiveIcon, Search, RotateCcw, Trash2, Eye, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEmailData } from "../hooks/useEmailData";
import { useToast } from "@/hooks/use-toast";
import type { Email, EmailListProps } from "../types";

export const Archive = ({ emails }: EmailListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { updateEmailStatus } = useEmailData();
  const { toast } = useToast();

  // Get all archived emails from the emails data and mock data
  const allEmailsData = [
    ...emails,
    {
      id: "arch1",
      from: "Peter Novák",
      fromEmail: "peter.novak@company.sk",
      to: ["you@company.sk"],
      subject: "Projekt Alpha - finálny report",
      content: "Ahoj, v prílohe nájdeš finálny report k projektu Alpha. Všetko prebehlo úspešne.",
      timestamp: new Date("2024-01-10T14:30:00"),
      isRead: true,
      isUrgent: false,
      status: "archived"
    },
    {
      id: "arch2",
      from: "Anna Kováčová",
      fromEmail: "anna.kovacova@finance.sk", 
      to: ["you@company.sk"],
      subject: "Q4 rozpočet - schválený",
      content: "Rozpočet na Q4 bol schválený. Môžeme pokračovať s plánovanými projektmi.",
      timestamp: new Date("2024-01-08T09:15:00"),
      isRead: true,
      isUrgent: false,
      status: "archived"
    },
    {
      id: "arch3",
      from: "Marketing Team",
      fromEmail: "marketing@company.sk",
      to: ["you@company.sk"],
      subject: "Kampaň december - výsledky",
      content: "Decembrová kampaň dosiahla výborné výsledky. ROI bol 340%.",
      timestamp: new Date("2024-01-05T16:45:00"),
      isRead: true,
      isUrgent: false,
      status: "archived"
    }
  ];

  // Filter only archived emails
  const archivedEmails = allEmailsData.filter(email => 
    email.status === "archived" &&
    (email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
     email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
     email.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRestore = (emailId: string) => {
    const email = archivedEmails.find(e => e.id === emailId);
    updateEmailStatus(emailId, "read");
    toast({
      title: "Email obnovený",
      description: `"${email?.subject}" bol obnovený do schránky`,
    });
  };

  const handleDelete = (emailId: string) => {
    const email = archivedEmails.find(e => e.id === emailId);
    updateEmailStatus(emailId, "deleted");
    toast({
      title: "Email presuntý do koša",
      description: `"${email?.subject}" bol presuntý do koša`,
    });
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-gray-500 rounded-lg flex items-center justify-center">
          <ArchiveIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Archív</h1>
          <p className="text-sm text-muted-foreground">Archivované emaily</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Hľadať v archíve..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{archivedEmails.length}</div>
            <div className="text-sm text-muted-foreground">Archivované emaily</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {archivedEmails.filter(e => 
                new Date(e.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <div className="text-sm text-muted-foreground">Za posledných 30 dní</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((archivedEmails.length / (archivedEmails.length + 10)) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Organizovanosť</div>
          </CardContent>
        </Card>
      </div>

      {/* Archived Emails List */}
      {archivedEmails.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ArchiveIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Žiadne archivované emaily</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Žiadne emaily nezodpovedajú hľadaniu" : "Zatiaľ ste nearchivovali žiadne emaily"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {archivedEmails.map((email) => (
            <Card key={email.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="text-sm font-medium">
                        {email.from.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-foreground line-clamp-1">
                          {email.subject}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          Archivované
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Od: {email.from}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{email.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className="text-xs text-muted-foreground">{formatDate(email.timestamp)}</span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          title="Viac možností"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleRestore(email.id)}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Obnoviť do schránky
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          onClick={() => handleDelete(email.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Presunúť do koša
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};