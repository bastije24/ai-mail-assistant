import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface NewMeetingDialogProps {
  children: React.ReactNode;
  onMeetingCreate: (meeting: any) => void;
}

export const NewMeetingDialog = ({ children, onMeetingCreate }: NewMeetingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    type: "meeting"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      return;
    }

    // For deadlines, we don't require start/end time
    if (formData.type !== "deadline" && (!formData.startTime || !formData.endTime)) {
      return;
    }

    const getStatus = (date: Date) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date.toDateString() === today.toDateString()) {
        return "Dnes";
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return "Zajtra";
      } else {
        return date.toLocaleDateString('sk-SK', { weekday: 'long' });
      }
    };

    const newMeeting = {
      id: Date.now().toString(),
      title: formData.title,
      time: formData.type === "deadline" 
        ? formData.startTime ? `Do ${formData.startTime}` : "Celý deň"
        : `${formData.startTime} - ${formData.endTime}`,
      type: formData.type,
      location: formData.location || "Neurčené",
      organizer: "Vy",
      attendees: formData.type === "deadline" ? "Nový deadline" : "Nové stretnutie",
      color: formData.type === "meeting" ? "blue" : 
             formData.type === "presentation" ? "purple" : 
             formData.type === "deadline" ? "red" : "green",
      date: formData.date,
      status: getStatus(formData.date)
    };

    onMeetingCreate(newMeeting);
    setOpen(false);
    setFormData({
      title: "",
      date: undefined,
      startTime: "",
      endTime: "",
      location: "",
      description: "",
      type: "meeting"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {formData.type === "deadline" ? "Nový deadline" : "Nové stretnutie"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Názov stretnutia</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Zadajte názov stretnutia"
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
                  onSelect={(date) => setFormData({ ...formData, date })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">
                {formData.type === "deadline" ? "Termín (voliteľný)" : "Začiatok"}
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required={formData.type !== "deadline"}
              />
            </div>
            {formData.type !== "deadline" && (
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
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Typ stretnutia</Label>
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
              placeholder="Online, kancelária, adresa..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Popis (voliteľný)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Popis stretnutia..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Zrušiť
            </Button>
            <Button type="submit">
              {formData.type === "deadline" ? "Vytvoriť deadline" : "Vytvoriť stretnutie"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};