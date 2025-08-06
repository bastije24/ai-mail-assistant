import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

  const aiConcepts = [
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[800px] sm:w-[800px] flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Odpoveď na: {email.subject}</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* AI Concept Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">AI návrhy odpovede</Label>
            <div className="grid grid-cols-1 gap-2">
              {aiConcepts.map((concept) => (
                <Button
                  key={concept.id}
                  variant={selectedConceptId === concept.id ? "default" : "outline"}
                  className="h-auto p-3 justify-start text-left"
                  onClick={() => handleConceptSelect(concept.id)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {concept.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs mb-1">{concept.type}</div>
                      <div className="text-xs text-muted-foreground">
                        {concept.template}
                      </div>
                    </div>
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

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Prílohy</Label>
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
                <Paperclip className="mr-2 h-4 w-4" />
                Pridať prílohy
              </Button>
              {attachments.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {attachments.length} súborov
                </span>
              )}
            </div>
            {attachments.length > 0 && (
              <div className="space-y-1">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meeting Creation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowMeetingOptions(!showMeetingOptions)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Navrhnúť stretnutie
              </Button>
            </div>
            
            {showMeetingOptions && (
              <div className="p-4 border rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dátum stretnutia</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !meetingDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {meetingDate ? format(meetingDate, "dd.MM.yyyy") : "Vyberte dátum"}
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="meeting-time">Čas stretnutia</Label>
                    <Input
                      id="meeting-time"
                      type="time"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMeetingOptions(false)}
                  >
                    Zrušiť
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateMeeting}
                  >
                    Vytvoriť stretnutie
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Actions at bottom */}
        <div className="flex-shrink-0 border-t p-4 space-y-4">
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