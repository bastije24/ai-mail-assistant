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