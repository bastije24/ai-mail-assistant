import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Email } from "../types";

interface ComposeEmailReplyProps {
  email: Email;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedConceptId?: string;
}

export const ComposeEmailReply = ({ email, open, onOpenChange, selectedConceptId }: ComposeEmailReplyProps) => {
  const [replyContent, setReplyContent] = useState("");

  const aiConcepts = [
    {
      id: "A",
      type: "Rýchla odpoveď",
      template: "Ďakujem za váš email. Potvrzujem termín a zaručujem dokončenie do piatku. Ozvem sa s aktualizáciou."
    },
    {
      id: "B", 
      type: "Odpoveď s detailmi",
      template: "Ďakujem za váš email. Rád by som vám poskytol detailný prehľad stavu projektu:\n\n1. Aktuálny stav: 85% dokončené\n2. Zostávajúce úlohy: finálne testovanie a dokumentácia\n3. Predpokladané ukončenie: piatok 19.1.2024\n\nBudem vás priebežne informovať o pokroku."
    },
    {
      id: "C",
      type: "Empatická odpoveď", 
      template: "Rozumiem urgentnosti tejto situácie a oceňujem vaše dôveruje v náš tím. Môžem vás uistiť, že projekt má najvyššiu prioritu a všetko robíme pre dodržanie termínu. Navrhujeme kratšie kontrolné stretnutie zajtra, aby sme sa uistili, že všetko prebieha podľa plánu."
    },
    {
      id: "D",
      type: "Formálna odpoveď",
      template: "Vážený pán/pani,\n\nďakujeme za váš email z dňa 15.1.2024. Na základe aktuálneho stavu projektu môžeme potvrdiť dodržanie stanoveného termínu 19.1.2024.\n\nPre akékoľvek dodatočné otázky nás neváhajte kontaktovať.\n\nS pozdravom,\n[Vaše meno]"
    }
  ];

  const selectedConcept = aiConcepts.find(c => c.id === selectedConceptId);

  const handleConceptSelect = (conceptId: string) => {
    const concept = aiConcepts.find(c => c.id === conceptId);
    if (concept) {
      setReplyContent(concept.template);
    }
  };

  const handleSend = () => {
    if (!replyContent.trim()) return;
    
    console.log("Odosielam odpoveď:", {
      originalEmail: email.id,
      replyContent,
      timestamp: new Date()
    });
    
    onOpenChange(false);
    setReplyContent("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[800px] sm:w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Odpoveď na: {email.subject}</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6">
          {/* Original Email Context */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="text-sm">
                <div className="font-medium mb-1">Od: {email.from} &lt;{email.fromEmail}&gt;</div>
                <div className="text-muted-foreground mb-2">Predmet: {email.subject}</div>
                <div className="text-muted-foreground max-h-20 overflow-y-auto">
                  {email.content}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Concept Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">AI návrhy odpovede</Label>
            <div className="grid grid-cols-2 gap-3">
              {aiConcepts.map((concept) => (
                <Button
                  key={concept.id}
                  variant={selectedConceptId === concept.id ? "default" : "outline"}
                  className="h-auto p-3 justify-start text-left"
                  onClick={() => handleConceptSelect(concept.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {concept.id}
                    </div>
                    <span className="text-sm">{concept.type}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Reply Content */}
          <div className="space-y-2">
            <Label htmlFor="reply-content">Vaša odpoveď</Label>
            <Textarea
              id="reply-content"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Napíšte vašu odpoveď alebo vyberte AI návrh vyššie..."
              rows={12}
              className="min-h-[200px]"
            />
          </div>

          {/* AI Enhancement */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Vylepšiť AI
            </Button>
            <Button variant="outline" size="sm">
              Kontrola gramatiky
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Zrušiť
            </Button>
            <Button onClick={handleSend} disabled={!replyContent.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Odoslať odpoveď
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};