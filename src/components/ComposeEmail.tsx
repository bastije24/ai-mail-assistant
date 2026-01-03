import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { CalendarIcon, Send, Clock, Paperclip, X, PenSquare, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const ComposeEmail = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    content: "",
    priority: "medium",
    scheduledDate: undefined as Date | undefined,
    scheduledTime: "",
    attachments: [] as File[]
  });

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
      priority: "medium",
      scheduledDate: undefined,
      scheduledTime: "",
      attachments: []
    });
  };

  const handleAiSuggest = () => {
    toast.success("AI generuje návrh...");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <PenSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Nový email</h1>
            <p className="text-sm text-muted-foreground">Napíšte a odošlite nový email</p>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="border-2">
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

              {/* Priority & Schedule Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-medium">Priorita</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">🔴 Vysoká</SelectItem>
                      <SelectItem value="medium">🟡 Stredná</SelectItem>
                      <SelectItem value="low">🟢 Nízka</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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

              {/* Content with AI Helper */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content" className="text-sm font-medium">
                    Obsah <span className="text-red-500">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAiSuggest}
                    className="text-primary hover:text-primary/80"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI návrh
                  </Button>
                </div>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Napíšte váš email..."
                  rows={12}
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
                        priority: "medium",
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
      </div>
    </div>
  );
};
