import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Send, Clock } from "lucide-react";
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
    scheduledTime: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.to || !formData.subject || !formData.content) {
      return;
    }

    const newEmail = {
      id: Date.now().toString(),
      to: formData.to,
      subject: formData.subject,
      content: formData.content,
      priority: formData.priority,
      timestamp: new Date(),
      scheduledFor: formData.scheduledDate ? new Date(`${format(formData.scheduledDate, "yyyy-MM-dd")}T${formData.scheduledTime}`) : undefined,
      status: formData.scheduledDate ? "scheduled" : "sent"
    };

    onEmailCreate?.(newEmail);
    setOpen(false);
    setFormData({
      to: "",
      subject: "",
      content: "",
      priority: "medium",
      scheduledDate: undefined,
      scheduledTime: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nový email</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};