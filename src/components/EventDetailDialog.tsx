import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Clock, MapPin, User, Video, Calendar as CalendarIcon, FileText } from "lucide-react";

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

interface EventDetailDialogProps {
  children: React.ReactNode;
  event: Event;
}

export const EventDetailDialog = ({ children, event }: EventDetailDialogProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('sk-SK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting': return 'Stretnutie';
      case 'presentation': return 'Prezentácia';
      case 'deadline': return 'Deadline';
      default: return 'Udalosť';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{formatDate(event.date)}</div>
                <div className="text-sm text-muted-foreground">Dátum</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{event.time}</div>
                <div className="text-sm text-muted-foreground">Čas</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{event.location}</div>
                <div className="text-sm text-muted-foreground">Miesto</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{getTypeLabel(event.type)}</div>
                <div className="text-sm text-muted-foreground">Typ udalosti</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Participants */}
          <div className="space-y-3">
            <h3 className="font-semibold">Účastníci</h3>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{event.organizer}</div>
                <div className="text-sm text-muted-foreground">Organizátor</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground pl-7">
              {event.attendees}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            {event.onlineLink && (
              <Button 
                onClick={() => window.open(event.onlineLink, '_blank')}
                className="bg-primary hover:bg-primary/90"
              >
                <Video className="mr-2 h-4 w-4" />
                Pripojiť sa
              </Button>
            )}
            <Button variant="outline">
              Upraviť
            </Button>
            <Button variant="outline">
              Odstrániť
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};