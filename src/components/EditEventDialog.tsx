import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  time: string;
  type: string;
  location: string;
  organizer: string;
  attendees: string;
  color: string;
  date: Date;
  status: string;
  onlineLink?: string;
}

interface EditEventDialogProps {
  children: React.ReactNode;
  event: Event;
  onEventUpdate: (updatedEvent: Event) => void;
}

export const EditEventDialog = ({ children, event, onEventUpdate }: EditEventDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: event.title,
    date: event.date,
    startTime: event.time.split(' - ')[0] || "",
    endTime: event.time.split(' - ')[1] || "",
    location: event.location,
    type: event.type,
    onlineLink: event.onlineLink || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      return;
    }

    const updatedEvent: Event = {
      ...event,
      title: formData.title,
      time: `${formData.startTime} - ${formData.endTime}`,
      type: formData.type,
      location: formData.location,
      date: formData.date,
      onlineLink: formData.onlineLink || undefined
    };

    onEventUpdate(updatedEvent);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upraviť udalosť</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Názov</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Dátum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "dd.MM.yyyy") : "Vyberte dátum"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => setFormData({ ...formData, date: date || new Date() })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Začiatok</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Koniec</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Typ</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Stretnutie</SelectItem>
                <SelectItem value="presentation">Prezentácia</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Miesto</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="onlineLink">Online link (voliteľný)</Label>
            <Input
              id="onlineLink"
              value={formData.onlineLink}
              onChange={(e) => setFormData({ ...formData, onlineLink: e.target.value })}
              placeholder="https://zoom.us/j/..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Zrušiť
            </Button>
            <Button type="submit">Uložiť zmeny</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};