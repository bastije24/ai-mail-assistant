import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Send, Clock, Paperclip, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ComposeEmailDialogProps {
  children: React.ReactNode;
  onEmailCreate?: (email: any) => void;
  replyTo?: string;
  subject?: string;
  content?: string;
}

export const ComposeEmailDialog = ({ 
  children, 
  onEmailCreate, 
  replyTo = "",
  subject = "",
  content = ""
}: ComposeEmailDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    to: replyTo,
    subject: subject,
    content: content,
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

  const handleTimeChange = (newTime: string) => {
    setFormData(prev => ({ ...prev, scheduledTime: newTime }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.to || !formData.subject || !formData.content) {
      return;
    }

    if (formData.scheduledDate && !formData.scheduledTime) {
      alert("Prosím vyberte čas pre naplánovanie emailu");
      return;
    }

    const newEmail = {
      id: Date.now().toString(),
      to: formData.to,
      toName: formData.to.split('@')[0],
      subject: formData.subject,
      content: formData.content,
      priority: formData.priority,
      timestamp: new Date(),
      scheduledFor: formData.scheduledDate && formData.scheduledTime ? 
        new Date(`${format(formData.scheduledDate, "yyyy-MM-dd")}T${formData.scheduledTime}`) : 
        undefined,
      status: formData.scheduledDate ? "scheduled" : "sent",
      attachments: formData.attachments.map(file => file.name),
      category: "Nový",
      previewText: formData.content.substring(0, 100) + "..."
    };

    onEmailCreate?.(newEmail);
    setOpen(false);
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-[600px] sm:w-[600px] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Nový email</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to">Pre</Label>
            <Input
              id="to"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Predmet</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Predmet emailu"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priorita</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Vysoká</SelectItem>
                <SelectItem value="medium">Stredná</SelectItem>
                <SelectItem value="low">Nízka</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Naplánovať na dátum (voliteľný)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
                <Label htmlFor="scheduledTime">Čas</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  required={!!formData.scheduledDate}
                />
              </div>
            )}
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
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
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
              <div className="space-y-1">
                {formData.attachments.map((file, index) => (
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

          <div className="space-y-2">
            <Label htmlFor="content">Obsah</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Napíšte váš email..."
              rows={8}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Zrušiť
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
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
        </form>
      </SheetContent>
    </Sheet>
  );
};