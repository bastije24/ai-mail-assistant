import { useState } from "react";
import { Email } from "../types";

// Mock email data - later can be replaced with API calls
const mockEmails: Email[] = [
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

export const useEmailData = () => {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email>(mockEmails[0]);

  const updateEmailStatus = (emailId: string, status: "read" | "unread" | "archived" | "deleted") => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { 
        ...email, 
        status,
        isRead: status === "read" || status === "archived",
        deletedAt: status === "deleted" ? new Date() : email.deletedAt
      } : email
    ));
  };

  const markAsRead = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, isRead: true } : email
    ));
  };

  return {
    emails,
    selectedEmail,
    setSelectedEmail,
    updateEmailStatus,
    markAsRead,
  };
};