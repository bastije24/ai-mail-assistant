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
import { X } from "lucide-react";
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
        
        {/* Processed Emails Panel - Right - only show for archive view */}
        {selectedSection === "archive" && (
          <div className="w-96 bg-card border-l border-border p-4">
            <h3 className="font-semibold mb-4">Spracované emaily</h3>
            <div className="space-y-3">
              {mockEmails.filter(email => email.status === "read").map((email) => (
                <div key={email.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{email.from}</span>
                    <span className="text-xs text-muted-foreground">
                      {email.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{email.subject}</p>
                  <div className="flex items-center gap-2">
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
              ))}
            </div>
          </div>
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