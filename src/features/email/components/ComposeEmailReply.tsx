import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Paperclip, Calendar, Clock, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Email } from "../types";

interface ComposeEmailReplyProps {
  email: Email;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedConceptId?: string;
}

export const ComposeEmailReply = ({ email, open, onOpenChange, selectedConceptId }: ComposeEmailReplyProps) => {
  const [replyContent, setReplyContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [meetingDate, setMeetingDate] = useState<Date>();
  const [meetingTime, setMeetingTime] = useState("");
  const [showMeetingOptions, setShowMeetingOptions] = useState(false);
  const [contextInput, setContextInput] = useState("");

  // Default pre-generated responses
  const defaultConcepts = [
    {
      id: "A",
      type: "Rýchla odpoveď",
      template: "Dobrý deň Jan, áno potvrzujem - materiály budú hotové do piatka do 17:00. Všetko je na dobrej ceste. S pozdravom, Martin"
    },
    {
      id: "B", 
      type: "Detailná odpoveď",
      template: "Dobrý deň Jan, materiály sú 90% hotové, schválenie čaká na review. Odovzdanie: piatok do 16:00. Budem informovať o progrese. S pozdravom, Martin"
    },
    {
      id: "C",
      type: "Profesionálna odpoveď", 
      template: "Vážený pán Novák, beriem na vedomie urgentnosť a potvrzujem dodržanie termínu. Finálne materiály budú pripravené do piatka. S úctou, Martin Kováč"
    },
    {
      id: "D",
      type: "Osobná odpoveď",
      template: "Ahoj Jan, rozumiem že je to urgentné! Materiály budú hotové určite do piatka. Klient môže byť v kľude. Ozvem sa hneď ako budem hotový. Martin"
    }
  ];

  const getContextualConcepts = (context: string) => {
    if (!context.trim()) {
      return defaultConcepts; // Show default when no context
    }
    
    // Generate new responses based on context
    return [
      {
        id: "A",
        type: "Rýchla odpoveď",
        template: `Dobrý deň Jan, ${context}. Ďakujem za pochopenie. S pozdravom, Martin`
      },
      {
        id: "B", 
        type: "Detailná odpoveď",
        template: `Dobrý deň Jan, rád by som vás informoval že ${context}. Ospravedlňujem sa za akékoľvek nepríjemnosti. Teším sa na ďalšiu spoluprácu. S pozdravom, Martin`
      },
      {
        id: "C",
        type: "Profesionálna odpoveď", 
        template: `Vážený pán Novák, týmto vás informujem že ${context}. Ďakujem za váš záujem a pochopenie. S úctou, Martin Kováč`
      },
      {
        id: "D",
        type: "Osobná odpoveď",
        template: `Ahoj Jan, bohužiaľ ${context}. Je mi to ľúto, ale verím že sa čoskoro nájde iné riešenie. Martin`
      }
    ];
  };

  const aiConcepts = getContextualConcepts(contextInput);

  const selectedConcept = aiConcepts.find(c => c.id === selectedConceptId);

  const handleConceptSelect = (conceptId: string) => {
    const concept = aiConcepts.find(c => c.id === conceptId);
    if (concept) {
      setReplyContent(concept.template);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateMeeting = () => {
    if (!meetingDate || !meetingTime) {
      alert("Prosím vyberte dátum a čas stretnutia");
      return;
    }
    
    console.log("Vytváram stretnutie:", {
      date: meetingDate,
      time: meetingTime,
      participants: [email.fromEmail],
      subject: `Stretnutie k: ${email.subject}`
    });
    
    setShowMeetingOptions(false);
    setMeetingDate(undefined);
    setMeetingTime("");
  };

  const handleSend = () => {
    if (!replyContent.trim()) return;
    
    console.log("Odosielam odpoveď:", {
      originalEmail: email.id,
      replyContent,
      attachments: attachments.map(f => f.name),
      timestamp: new Date()
    });
    
    onOpenChange(false);
    setReplyContent("");
    setAttachments([]);
  };

  return (
    <div 
      className={cn(
        "fixed top-0 right-0 h-full w-[400px] max-w-[85vw] bg-background border-l shadow-xl flex flex-col z-40 transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Odpovede</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onOpenChange(false)}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {/* AI Concept Selection */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">AI návrhy odpovede</Label>
          <div className="grid grid-cols-1 gap-0.5">
            {aiConcepts.map((concept) => (
              <Button
                key={concept.id}
                variant={selectedConceptId === concept.id ? "default" : "outline"}
                className="h-auto p-1.5 justify-start text-left"
                onClick={() => handleConceptSelect(concept.id)}
              >
                <div className="flex items-start gap-1.5 w-full">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {concept.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs mb-0.5">{concept.type}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {concept.template}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Context Input for AI Generation */}
        <div className="space-y-1">
          <Label htmlFor="context-input" className="text-xs">Kontext pre AI odpovede</Label>
          <Textarea
            id="context-input"
            value={contextInput}
            onChange={(e) => setContextInput(e.target.value)}
            placeholder="Napríklad: 'už nie je k dispozícii', 'termín sa posunul'..."
            rows={1}
            className="text-xs h-8 min-h-8 py-1"
          />
          <p className="text-xs text-muted-foreground leading-tight">
            Napíšte informáciu a všetky 4 odpovede sa automaticky prehodia
          </p>
        </div>

        {/* Reply Content */}
        <div className="space-y-1">
          <Label htmlFor="reply-content" className="text-xs">Finálna odpoveď</Label>
          <Textarea
            id="reply-content"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Tu sa zobrazí finálna odpoveď na odoslanie..."
            rows={4}
            className="min-h-[80px] text-xs"
          />
        </div>

        {/* Attachments */}
        <div className="space-y-1">
          <Label className="text-xs">Prílohy</Label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="reply-file-upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('reply-file-upload')?.click()}
            >
              <Paperclip className="mr-2 h-3 w-3" />
              Pridať
            </Button>
            {attachments.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {attachments.length} súborov
              </span>
            )}
          </div>
          {attachments.length > 0 && (
            <div className="space-y-1">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-1 bg-muted rounded text-xs">
                  <span>{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meeting Creation */}
        <div className="space-y-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowMeetingOptions(!showMeetingOptions)}
          >
            <Calendar className="mr-2 h-3 w-3" />
            Navrhnúť stretnutie
          </Button>
          
          {showMeetingOptions && (
            <div className="p-2 border rounded space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Dátum</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-full justify-start text-left font-normal text-xs",
                          !meetingDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-1 h-3 w-3" />
                        {meetingDate ? format(meetingDate, "dd.MM.yyyy") : "Dátum"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={meetingDate}
                        onSelect={setMeetingDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="meeting-time" className="text-xs">Čas</Label>
                  <Input
                    id="meeting-time"
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMeetingOptions(false)}
                  className="text-xs"
                >
                  Zrušiť
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreateMeeting}
                  className="text-xs"
                >
                  Vytvoriť
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Actions at bottom */}
      <div className="flex-shrink-0 border-t p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Sparkles className="mr-1 h-3 w-3" />
            Vylepšiť AI
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Kontrola gramatiky
          </Button>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} size="sm" className="text-xs">
            Zrušiť
          </Button>
          <Button onClick={handleSend} disabled={!replyContent.trim()} size="sm" className="text-xs">
            <Send className="mr-1 h-3 w-3" />
            Odoslať
          </Button>
        </div>
      </div>
    </div>
  );
};