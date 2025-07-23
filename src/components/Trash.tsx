import { useState } from "react";
import { Trash2, RotateCcw, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

interface Email {
  id: string;
  from: string;
  fromEmail?: string;
  subject: string;
  content: string;
  timestamp: Date;
  isUrgent?: boolean;
  deletedAt?: Date;
}

interface TrashProps {
  emails: Email[];
}

export const Trash = ({ emails }: TrashProps) => {
  // Mock deleted emails
  const deletedEmails = [
    {
      id: "del1",
      from: "Spam Account",
      subject: "Výhra v lotérii - kliknite tu!",
      content: "Gratulujeme! Vyhrali ste 1 000 000 EUR...",
      timestamp: new Date("2024-01-10T14:20:00"),
      deletedAt: new Date("2024-01-15T10:30:00")
    },
    {
      id: "del2", 
      from: "Newsletter",
      subject: "Týždenný newsletter",
      content: "Najnovšie správy z nášho magazínu...",
      timestamp: new Date("2024-01-08T09:00:00"),
      deletedAt: new Date("2024-01-14T16:45:00")
    },
    {
      id: "del3",
      from: "Old Project",
      subject: "Starý projekt - záverečná správa",
      content: "Posielajú záverečnú správu ukončeného projektu...",
      timestamp: new Date("2024-01-05T11:15:00"),
      deletedAt: new Date("2024-01-12T08:20:00")
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

  const formatDeletedDate = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) return `Zmazané pred ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Zmazané pred ${diffDays} dňami`;
  };

  const [emailsInTrash, setEmailsInTrash] = useState(deletedEmails);

  const handleRestore = (emailId: string) => {
    setEmailsInTrash(emails => emails.filter(email => email.id !== emailId));
    console.log(`Restored email ${emailId} back to inbox`);
  };

  const handlePermanentDelete = (emailId: string) => {
    setEmailsInTrash(emails => emails.filter(email => email.id !== emailId));
    console.log(`Permanently deleted email ${emailId}`);
  };

  const handleEmptyTrash = () => {
    setEmailsInTrash([]);
    console.log('Emptied entire trash');
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Kôš</h1>
            <p className="text-sm text-muted-foreground">Vymazané emaily - {emailsInTrash.length} položiek</p>
          </div>
        </div>
        
        {emailsInTrash.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Vyprázdniť kôš
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Vyprázdniť kôš</AlertDialogTitle>
                <AlertDialogDescription>
                  Ste si istí, že chcete natrvalo vymazať všetky emaily z koša? Táto akcia je nevratná.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                <AlertDialogAction onClick={handleEmptyTrash} className="bg-red-600 hover:bg-red-700">
                  Vyprázdniť
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {emailsInTrash.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Trash2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Kôš je prázdny</h3>
            <p className="text-muted-foreground">Žiadne vymazané emaily</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {emailsInTrash.map((email) => (
            <Card key={email.id} className="hover:shadow-sm transition-shadow border-red-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-muted-foreground line-clamp-1">
                        {email.subject}
                      </h3>
                      <Badge variant="destructive" className="text-xs">
                        Vymazané
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Od: {email.from}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{email.content}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Pôvodné: {formatDate(email.timestamp)}</span>
                      <span>Vymazané: {formatDate(email.deletedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRestore(email.id)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Obnoviť
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Natrvalo vymazať
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Natrvalo vymazať email</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ste si istí, že chcete natrvalo vymazať tento email? Táto akcia je nevratná.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handlePermanentDelete(email.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Vymazať natrvalo
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Box */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5">
              <span className="text-xs text-primary-foreground font-bold">i</span>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Informácia o koši</h4>
              <p className="text-sm text-muted-foreground">
                Emaily v koši sú automaticky natrvalo vymazané po 30 dňoch. 
                Môžete ich kedykoľvek obnoviť alebo vymazať natrvalo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};