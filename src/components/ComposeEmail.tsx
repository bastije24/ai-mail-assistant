import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { CalendarIcon, Send, Clock, Paperclip, X, PenSquare, Sparkles, Wand2, MessageSquare, Briefcase, Heart, Zap, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ToneType = "formal" | "friendly" | "professional" | "casual" | "urgent";

const toneOptions: { id: ToneType; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "formal", label: "Formálne", icon: <Briefcase className="h-4 w-4" />, description: "Oficiálny tón pre business" },
  { id: "friendly", label: "Kamarátsky", icon: <Heart className="h-4 w-4" />, description: "Neformálny, priateľský" },
  { id: "professional", label: "Profesionálne", icon: <FileText className="h-4 w-4" />, description: "Vecný a korektný" },
  { id: "casual", label: "Bežný", icon: <MessageSquare className="h-4 w-4" />, description: "Každodenná komunikácia" },
  { id: "urgent", label: "Naliehavý", icon: <Zap className="h-4 w-4" />, description: "Rýchla odpoveď potrebná" },
];

export const ComposeEmail = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    content: "",
    scheduledDate: undefined as Date | undefined,
    scheduledTime: "",
    attachments: [] as File[]
  });

  const [selectedTone, setSelectedTone] = useState<ToneType>("professional");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.to || !formData.subject || !formData.content) {
      toast.error("Vyplňte všetky povinné polia");
      return;
    }

    if (formData.scheduledDate && !formData.scheduledTime) {
      toast.error("Prosím vyberte čas pre naplánovanie emailu");
      return;
    }

    if (formData.scheduledDate) {
      toast.success(`Email naplánovaný na ${format(formData.scheduledDate, "dd.MM.yyyy")} o ${formData.scheduledTime}`);
    } else {
      toast.success("Email bol odoslaný");
    }

    setFormData({
      to: "",
      subject: "",
      content: "",
      scheduledDate: undefined,
      scheduledTime: "",
      attachments: []
    });
  };

  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) {
      toast.error("Zadajte, čo má AI napísať");
      return;
    }
    
    setIsAiGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const toneTexts: Record<ToneType, string> = {
        formal: `Vážený pán/pani,\n\ndovoľujem si Vás kontaktovať vo veci: ${aiPrompt}\n\nS úctou,\n[Vaše meno]`,
        friendly: `Ahoj!\n\nChcel som ti napísať ohľadom: ${aiPrompt}\n\nDaj vedieť, čo si myslíš! 😊\n\nMaj sa!`,
        professional: `Dobrý deň,\n\nv nadväznosti na ${aiPrompt}, rád by som Vám poskytol nasledovné informácie.\n\nS pozdravom,\n[Vaše meno]`,
        casual: `Čauko,\n\n${aiPrompt}\n\nOzvi sa, keď budeš mať čas.\n\nPeace ✌️`,
        urgent: `DÔLEŽITÉ!\n\nPotrebujem urgentne vyriešiť: ${aiPrompt}\n\nProsím o čo najskoršiu odpoveď.\n\nĎakujem,\n[Vaše meno]`
      };
      
      setFormData(prev => ({
        ...prev,
        content: toneTexts[selectedTone]
      }));
      
      setIsAiGenerating(false);
      toast.success("AI vygenerovalo koncept emailu");
    }, 1500);
  };

  const handleAiImprove = () => {
    if (!formData.content.trim()) {
      toast.error("Najprv napíšte nejaký text");
      return;
    }
    
    setIsAiGenerating(true);
    setTimeout(() => {
      toast.success("Email bol vylepšený pomocou AI");
      setIsAiGenerating(false);
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <PenSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Nový email</h1>
            <p className="text-sm text-muted-foreground">Napíšte a odošlite nový email</p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Form */}
          <Card className="flex-1 border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Composer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* To Field */}
                <div className="space-y-2">
                  <Label htmlFor="to" className="text-sm font-medium">
                    Príjemca <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="to"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="email@example.com"
                    className="border-2"
                    required
                  />
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Predmet <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Predmet emailu"
                    className="border-2"
                    required
                  />
                </div>

                {/* Schedule Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Naplánovať odoslanie</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-2",
                            !formData.scheduledDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.scheduledDate ? format(formData.scheduledDate, "dd.MM.yyyy") : "Odoslať teraz"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.scheduledDate}
                          onSelect={(date) => setFormData({ ...formData, scheduledDate: date })}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {formData.scheduledDate && (
                    <div className="space-y-2">
                      <Label htmlFor="scheduledTime" className="text-sm font-medium">Čas odoslania</Label>
                      <Input
                        id="scheduledTime"
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                        className="border-2"
                        required={!!formData.scheduledDate}
                      />
                    </div>
                  )}
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Prílohy</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-2"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Paperclip className="mr-2 h-4 w-4" />
                      Pridať prílohy
                    </Button>
                    {formData.attachments.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {formData.attachments.length} súborov
                      </span>
                    )}
                  </div>
                  {formData.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 hover:bg-destructive/20"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content" className="text-sm font-medium">
                      Obsah <span className="text-red-500">*</span>
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAiImprove}
                      disabled={isAiGenerating}
                      className="text-primary hover:text-primary/80"
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      Vylepšiť AI
                    </Button>
                  </div>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Napíšte váš email..."
                    rows={14}
                    className="border-2 resize-none"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => toast.success("Koncept uložený")}
                  >
                    Uložiť koncept
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          to: "",
                          subject: "",
                          content: "",
                          scheduledDate: undefined,
                          scheduledTime: "",
                          attachments: []
                        });
                      }}
                    >
                      Vymazať
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25"
                    >
                      {formData.scheduledDate ? (
                        <>
                          <Clock className="mr-2 h-4 w-4" />
                          Naplánovať
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Odoslať
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* AI Sidebar */}
          <Card className="w-80 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent h-fit sticky top-6">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Asistent</CardTitle>
                  <p className="text-xs text-muted-foreground">Nechaj AI napísať email</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Tone Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tón komunikácie</Label>
                <div className="grid grid-cols-1 gap-2">
                  {toneOptions.map((tone) => (
                    <Button
                      key={tone.id}
                      type="button"
                      variant={selectedTone === tone.id ? "default" : "outline"}
                      className={cn(
                        "justify-start h-auto py-2.5 px-3",
                        selectedTone === tone.id 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-accent"
                      )}
                      onClick={() => setSelectedTone(tone.id)}
                    >
                      <span className="mr-2">{tone.icon}</span>
                      <div className="text-left">
                        <span className="block text-sm font-medium">{tone.label}</span>
                        <span className={cn(
                          "block text-xs",
                          selectedTone === tone.id ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {tone.description}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* AI Prompt */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Čo má AI napísať?</Label>
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Napr: Poďakovanie za stretnutie a potvrdenie termínu..."
                  rows={4}
                  className="border-2 resize-none text-sm"
                />
              </div>

              {/* Generate Button */}
              <Button
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiGenerating}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-purple-500/25"
              >
                {isAiGenerating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generujem...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Vygenerovať koncept
                  </>
                )}
              </Button>

              {/* Quick Actions */}
              <div className="pt-3 border-t space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Rýchle akcie</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setAiPrompt("Odpoveď na email s poďakovaním");
                      setSelectedTone("professional");
                    }}
                  >
                    Poďakovanie
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setAiPrompt("Potvrdenie stretnutia");
                      setSelectedTone("formal");
                    }}
                  >
                    Potvrdenie
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setAiPrompt("Follow-up po stretnutí");
                      setSelectedTone("professional");
                    }}
                  >
                    Follow-up
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setAiPrompt("Ospravedlnenie za oneskorenie");
                      setSelectedTone("formal");
                    }}
                  >
                    Ospravedlnenie
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
