import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, Clock, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Email {
  id: string;
  to: string;
  toName: string;
  subject: string;
  scheduledFor: Date;
  priority: string;
  status: string;
  previewText: string;
  category: string;
}

interface EditEmailDialogProps {
  children: React.ReactNode;
  email: Email;
  onEmailUpdate: (email: Email) => void;
}

export const EditEmailDialog = ({ children, email, onEmailUpdate }: EditEmailDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    to: email.to,
    subject: email.subject,
    content: email.previewText.replace("...", ""), // Remove the truncation indicator
    priority: email.priority.toLowerCase(),
    scheduledDate: email.scheduledFor,
    scheduledTime: format(email.scheduledFor, "HH:mm")
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.to || !formData.subject || !formData.content) {
      return;
    }

    if (!formData.scheduledTime) {
      alert("Prosím vyberte čas pre naplánovanie emailu");
      return;
    }

    const updatedEmail: Email = {
      ...email,
      to: formData.to,
      toName: formData.to.split('@')[0],
      subject: formData.subject,
      priority: formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1),
      scheduledFor: new Date(`${format(formData.scheduledDate, "yyyy-MM-dd")}T${formData.scheduledTime}`),
      previewText: formData.content.substring(0, 100) + "..."
    };

    onEmailUpdate(updatedEmail);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-[600px] sm:w-[600px] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Upraviť email</SheetTitle>
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
                <SelectItem value="vysoká">Vysoká</SelectItem>
                <SelectItem value="stredná">Stredná</SelectItem>
                <SelectItem value="nízka">Nízka</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Naplánovaný dátum</Label>
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
                    {formData.scheduledDate ? format(formData.scheduledDate, "dd.MM.yyyy") : "Vyberte dátum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.scheduledDate}
                    onSelect={(date) => setFormData({ ...formData, scheduledDate: date || new Date() })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Čas</Label>
              <Input
                id="scheduledTime"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                required
              />
            </div>
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
              <X className="mr-2 h-4 w-4" />
              Zrušiť
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" />
              Uložiť zmeny
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};