import { useState } from "react";
import { FileEdit, Clock, Save, Trash2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ComposeEmailDialog } from "./ComposeEmailDialog";
import type { EmailListProps } from "../types";

export const Drafts = ({ emails }: EmailListProps) => {
  const [drafts, setDrafts] = useState([
    {
      id: "1",
      to: "jan.novak@firma.sk",
      toName: "Jan Novák",
      subject: "Re: Urgentný deadline - projekt treba ukončiť",
      lastModified: new Date("2024-01-15T16:45:00"),
      wordCount: 127,
      status: "in-progress",
      previewText: "Dobrý deň Jan, ďakujem za email ohľadom deadline. Môžem potvrdiť, že projekt je v posledných fázach. Čakáme na finálne schválenie od...",
      category: "Odpoveď",
      priority: "Vysoká"
    },
    {
      id: "2", 
      to: "team@company.com",
      toName: "Development Team",
      subject: "Weekly planning - nový sprint",
      lastModified: new Date("2024-01-15T14:20:00"),
      wordCount: 89,
      status: "draft",
      previewText: "Ahoj team, na základe včerajšieho retrospective-u pripravujem plán na budúci sprint. Hlavné priority budú...",
      category: "Plánování",
      priority: "Stredná"
    },
    {
      id: "3",
      to: "maria.svobodova@consulting.com", 
      toName: "Mária Svobodová",
      subject: "Re: Stretnutie budúci týždeň",
      lastModified: new Date("2024-01-15T13:15:00"),
      wordCount: 45,
      status: "outline",
      previewText: "Ahoj Mária, ďakujem za návrh termínov. Z uvedených možností mi najviac vyhovuje...",
      category: "Odpoveď", 
      priority: "Stredná"
    },
    {
      id: "4",
      to: "client@external.com",
      toName: "External Client",
      subject: "Project proposal - Phase 2",
      lastModified: new Date("2024-01-14T18:30:00"),
      wordCount: 234,
      status: "review",
      previewText: "Dear Client, following our successful completion of Phase 1, we would like to present our proposal for the next phase...",
      category: "Návrh",
      priority: "Vysoká"
    }
  ]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "in-progress":
        return { label: "Rozpísaný", color: "bg-blue-100 text-blue-800", icon: FileEdit };
      case "draft": 
        return { label: "Koncept", color: "bg-yellow-100 text-yellow-800", icon: Save };
      case "outline":
        return { label: "Osnova", color: "bg-gray-100 text-gray-800", icon: FileEdit };
      case "review":
        return { label: "Na kontrolu", color: "bg-purple-100 text-purple-800", icon: Clock };
      default:
        return { label: "Draft", color: "bg-gray-100 text-gray-800", icon: FileEdit };
    }
  };

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
      case "Plánование": return "bg-purple-100 text-purple-800";
      case "Návrh": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatLastModified = (date: Date) => {
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) return "Pred chvíľou";
    if (diffHours < 24) return `Pred ${Math.floor(diffHours)} hodinami`;
    
    return date.toLocaleDateString('sk-SK', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalWords = () => drafts.reduce((sum, draft) => sum + draft.wordCount, 0);

  const handleContinue = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      console.log(`Opening draft ${draftId} for editing:`, draft);
    }
  };

  const handleSend = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      setDrafts(prev => prev.filter(d => d.id !== draftId));
      console.log(`Draft ${draftId} sent successfully:`, draft);
    }
  };

  const handleSave = (draftId: string) => {
    setDrafts(prev => prev.map(draft => 
      draft.id === draftId 
        ? { ...draft, lastModified: new Date(), status: "draft" }
        : draft
    ));
    console.log(`Draft ${draftId} saved`);
  };

  const handleDelete = (draftId: string) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId));
    console.log(`Draft ${draftId} deleted`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-amber-500 rounded-lg flex items-center justify-center">
          <FileEdit className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Rozpísané</h1>
          <p className="text-sm text-muted-foreground">Nedokončené a uložené emaily</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{drafts.length}</div>
            <div className="text-sm text-muted-foreground">Celkovo draftov</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {drafts.filter(d => d.status === "in-progress").length}
            </div>
            <div className="text-sm text-muted-foreground">Rozpísané</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {drafts.filter(d => d.status === "review").length}
            </div>
            <div className="text-sm text-muted-foreground">Na kontrolu</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-ai-primary">{getTotalWords()}</div>
            <div className="text-sm text-muted-foreground">Slov celkovo</div>
          </CardContent>
        </Card>
      </div>

      {/* Drafts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Moje drafty</h2>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {drafts.map((draft) => {
            const statusInfo = getStatusInfo(draft.status);
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={draft.id} className="hover:shadow-sm transition-shadow border-l-4 border-l-amber-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {draft.toName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-1 line-clamp-1">
                          {draft.subject}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Pre: {draft.toName} &lt;{draft.to}&gt;
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {draft.previewText}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(draft.priority)}>
                          {draft.priority}
                        </Badge>
                        <Badge className={getCategoryColor(draft.category)}>
                          {draft.category}
                        </Badge>
                      </div>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-4">
                      <span>{draft.wordCount} slov</span>
                      <span>Upravené: {formatLastModified(draft.lastModified)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Button 
                      size="sm" 
                      className="bg-ai-primary hover:bg-ai-primary/90"
                      onClick={() => handleContinue(draft.id)}
                    >
                      <FileEdit className="mr-2 h-3 w-3" />
                      Pokračovať
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSend(draft.id)}
                    >
                      <Send className="mr-2 h-3 w-3" />
                      Odoslať
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSave(draft.id)}
                    >
                      <Save className="mr-2 h-3 w-3" />
                      Uložiť
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(draft.id)}
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Zmazať
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Writing Assistant */}
      <Card className="bg-ai-primary-light border-ai-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-6 w-6 bg-ai-primary rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">AI</span>
            </div>
            AI Písací asistent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            AI môže pomôcť dokončiť tvoje drafty, opraviť gramatiku a navrhnúť lepšie formulácie.
          </p>
          <div className="flex gap-2">
            <Button size="sm" className="bg-ai-primary hover:bg-ai-primary/90">
              Vylepšiť drafty
            </Button>
            <Button size="sm" variant="outline">
              Kontrola gramatiky
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};