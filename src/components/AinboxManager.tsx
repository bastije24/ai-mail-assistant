import { useState } from "react";
import { AinboxSidebar } from "./AinboxSidebar";
import { EmailDetail } from "./EmailDetail";
import { AiAssistantPanel } from "./AiAssistantPanel";
import { Summarizer } from "./Summarizer";
import { CalendarDeadliner } from "./CalendarDeadliner";
import { AiTagging } from "./AiTagging";
import { SendLater } from "./SendLater";
import { Drafts } from "./Drafts";
import { AllEmails } from "./AllEmails";
import { Trash } from "./Trash";
import { EmailsList } from "./EmailsList";
import { Dialog, DialogContent } from "./ui/dialog";
import { X, Settings } from "lucide-react";
import { Button } from "./ui/button";

// Mock email data
const mockEmails = [
  {
    id: "1",
    from: "Jan Novák",
    fromEmail: "jan.novak@firma.sk",
    to: ["martin.kovac@email.com"],
    subject: "Urgentný deadline - projekt treba ukončiť do piatka",
    content: `Dobrý deň Martin,

píšem ti v súvislosti s projektom, ktorý máme ukončiť do tohto piatka. Potrebovali by sme od teba finálne materiály a schválenie posledných zmien.

Je to veľmi urgentné, pretože klient očakává dodanie v pondelok ráno.

Môžeš mi prosím potvrdiť, že to stihneš?

Ďakujem,
Jan`,
    timestamp: new Date("2024-01-15T14:30:00"),
    isRead: false,
    isUrgent: true,
    status: "unread",
  },
  {
    id: "2", 
    from: "Mária Svobodová",
    fromEmail: "maria.svobodova@consulting.com",
    to: ["martin.kovac@email.com", "team@company.com"],
    subject: "Stretnutie budúci týždeň - návrh termínov",
    content: `Ahoj Martin,

ďakujem za včerajšiu prezentáciu. Bola veľmi inšpiratívna a všetci sme si odniesli veľa nových nápadov.

Chceli by sme naplánovať následné stretnutie, kde by sme prebrali konkrétne kroky. Vyhovovali by ti niektoré z týchto termínov?

- Utorok 23.1. o 14:00
- Streda 24.1. o 10:00  
- Štvrtok 25.1. o 16:00

Daj mi prosím vedieť, čo ti vyhovuje.

S pozdravom,
Mária`,
    timestamp: new Date("2024-01-14T11:20:00"),
    isRead: true,
    isUrgent: false,
    status: "read",
  },
];

export const AinboxManager = () => {
  const [selectedEmail, setSelectedEmail] = useState(mockEmails[0]);
  const [selectedSection, setSelectedSection] = useState("inbox");
  const [fullscreenEmail, setFullscreenEmail] = useState<any>(null);

  const renderMainContent = () => {
    switch (selectedSection) {
      case "summarizer": return <Summarizer emails={mockEmails} />;
      case "calendar-deadliner": return <CalendarDeadliner emails={mockEmails} />;
      case "ai-tagging": return <AiTagging emails={mockEmails} />;
      case "ai-assistant": return <AiAssistantPanel email={selectedEmail} />;
      case "send-later": return <SendLater emails={mockEmails} />;
      case "drafts": return <Drafts emails={mockEmails} />;
      case "all-emails": return <EmailsList emails={mockEmails} />;
      case "trash": return <Trash emails={mockEmails} />;
      case "settings": return (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-8 min-h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Nastavenia účtu</h1>
                <p className="text-sm text-muted-foreground">Spravujte svoj profil a predvoľby aplikácie</p>
              </div>
            </div>
            
            {/* Settings content - expanded for scrolling demo */}
            <div className="space-y-6">
              <div className="p-6 bg-card rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Rýchly prístup k nastaveniam</h3>
                <p className="text-muted-foreground mb-4">
                  Kliknite na svoj profil v ľavom hornom rohu pre prístup k detailným nastaveniam.
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">👤 Profil</div>
                  <div className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">🔒 Bezpečnosť</div>
                  <div className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">🔔 Notifikácie</div>
                  <div className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">💳 Predplatné</div>
                  <div className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">🌙 Tmavý režim</div>
                  <div className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">🌍 Jazyk</div>
                </div>
              </div>

              <div className="p-6 bg-card rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Najčastejšie používané</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Zmeniť heslo</span>
                    <span className="text-sm text-muted-foreground">Zabezpečenie účtu</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Spravovať predplatné</span>
                    <span className="text-sm text-muted-foreground">Platby a plány</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Nastavenia notifikácií</span>
                    <span className="text-sm text-muted-foreground">Email upozornenia</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-card rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Podpora a nápoveda</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-medium mb-2">🆘 Potrebujete pomoc?</h4>
                    <p className="text-sm text-muted-foreground">
                      Prečítajte si našu dokumentáciu alebo kontaktujte podporu.
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-medium mb-2">📖 Používateľská príručka</h4>
                    <p className="text-sm text-muted-foreground">
                      Naučte sa využívať všetky funkcie aplikácie na maximum.
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-medium mb-2">🔄 Aktualizácie</h4>
                    <p className="text-sm text-muted-foreground">
                      Zostaňte informovaní o najnovších funkciách a vylepšeniach.
                    </p>
                  </div>
                </div>
              </div>

              {/* Extra content to make scrolling visible */}
              <div className="p-6 bg-card rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Pokročilé nastavenia</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">API prístup</h4>
                    <p className="text-sm text-muted-foreground mb-2">Spravujte API kľúče a integrácie</p>
                    <Button variant="outline" size="sm">Spravovať API</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Export dát</h4>
                    <p className="text-sm text-muted-foreground mb-2">Stiahnite všetky vaše dáta</p>
                    <Button variant="outline" size="sm">Exportovať</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Vymazanie účtu</h4>
                    <p className="text-sm text-muted-foreground mb-2">Natrvalo vymazať váš účet a všetky dáta</p>
                    <Button variant="destructive" size="sm">Vymazať účet</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      case "archive": return (
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-6">Archív - Spracované emaily</h2>
          <div className="space-y-4">
            {mockEmails.filter(email => email.status === "read").map((email) => (
              <div 
                key={email.id} 
                className="p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setFullscreenEmail(email)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{email.subject}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Od: <span className="font-medium">{email.from}</span> ({email.fromEmail})
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-muted-foreground">
                      {email.timestamp.toLocaleDateString()} {email.timestamp.toLocaleTimeString()}
                    </span>
                    <div className="flex gap-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Spracovaný
                      </span>
                      {email.isUrgent && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Urgentný
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {email.content.substring(0, 150)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      );
      case "inbox": 
      default: return <EmailDetail email={selectedEmail} />;
    }
  };

  return (
    <>
      <div className="h-screen flex bg-background">
        {/* Left Sidebar */}
        <AinboxSidebar 
          selectedSection={selectedSection}
          onSectionChange={setSelectedSection}
        />
        
        {/* Email Detail - Center */}
        {renderMainContent()}
        
        {/* AI Assistant Panel - Right - only show for inbox view */}
        {selectedSection === "inbox" && (
          <AiAssistantPanel email={selectedEmail} />
        )}
      </div>

      {/* Full Screen Email Modal */}
      <Dialog open={!!fullscreenEmail} onOpenChange={() => setFullscreenEmail(null)}>
        <DialogContent className="max-w-none w-screen h-screen m-0 p-0 rounded-none">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                {fullscreenEmail?.subject}
              </h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setFullscreenEmail(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Email Content */}
            <div className="flex-1 overflow-auto">
              {fullscreenEmail && <EmailDetail email={fullscreenEmail} />}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};