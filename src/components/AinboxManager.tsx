import { useState } from "react";
import { AinboxSidebar } from "./AinboxSidebar";
import { EmailDetail } from "./EmailDetail";
import { AiAssistantPanel } from "./AiAssistantPanel";
import { Summarizer } from "./Summarizer";
import { Deadliner } from "./Deadliner";
import { AiTagging } from "./AiTagging";
import { SendLater } from "./SendLater";
import { Drafts } from "./Drafts";
import { CalendarView } from "./CalendarView";
import { MoreTools } from "./MoreTools";

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

  const renderMainContent = () => {
    switch (selectedSection) {
      case "summarizer": return <Summarizer emails={mockEmails} />;
      case "deadliner": return <Deadliner emails={mockEmails} />;
      case "ai-tagging": return <AiTagging emails={mockEmails} />;
      case "send-later": return <SendLater emails={mockEmails} />;
      case "drafts": return <Drafts emails={mockEmails} />;
      case "calendar": return <CalendarView emails={mockEmails} />;
      case "more": return <MoreTools emails={mockEmails} />;
      default: return <EmailDetail email={selectedEmail} />;
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar */}
      <AinboxSidebar 
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
      />
      
      {/* Email Detail - Center */}
      {renderMainContent()}
      
      {/* AI Assistant Panel - Right - only show for inbox/email view */}
      {(selectedSection === "inbox" || selectedSection === "archive") && (
        <AiAssistantPanel email={selectedEmail} />
      )}
    </div>
  );
};