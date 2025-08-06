import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Users, 
  Video, 
  ExternalLink, 
  AlertTriangle,
  Bell,
  MapPin,
  User
} from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { NewMeetingDialog } from "./NewMeetingDialog";
import { EventDetailDialog } from "./EventDetailDialog";
import { EditEventDialog } from "./EditEventDialog";

interface Email {
  id: string;
  from: string;
  subject: string;
  content: string;
  timestamp: Date;
}

interface CalendarDeadlinerProps {
  emails: Email[];
}

export const CalendarDeadliner = ({ emails }: CalendarDeadlinerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Stretnutie s klientom",
      time: "10:00 - 11:30",
      type: "meeting",
      location: "Online - Zoom",
      organizer: "Peter Kováč, Vy",
      attendees: "Vytvorené z emailu: peter@client.com",
      color: "blue",
      date: new Date(),
      onlineLink: "https://zoom.us/j/123456789",
      status: "Dnes"
    },
    {
      id: "2",
      title: "Týždenné standup",
      time: "09:00 - 09:30",
      type: "meeting",
      location: "Kancelária - Miestnosť A",
      organizer: "Tím (5 ľudí)",
      attendees: "Vytvorené z emailu: team@company.sk",
      color: "green",
      date: new Date("2024-01-17"),
      status: "Zajtra"
    },
    {
      id: "3",
      title: "Demo prezentácia projektu",
      time: "14:00 - 15:00",
      type: "presentation",
      location: "Conference Room B",
      organizer: "Management",
      attendees: "Vytvorené z emailu: demo@company.sk",
      color: "purple",
      date: new Date("2024-01-19"),
      status: "Piatok"
    },
    {
      id: "4",
      title: "Splatenie faktúry",
      time: "Do 17:00",
      type: "deadline",
      location: "Účtovníctvo",
      organizer: "Faktúra #2024-001",
      attendees: "1,500€ - termín splatnosti",
      color: "red",
      date: new Date(),
      status: "Dnes"
    },
    {
      id: "5",
      title: "Prezentácia kvartálnych výsledkov",
      time: "15:00 - 16:00",
      type: "presentation",
      location: "Hlavná sála",
      organizer: "CEO",
      attendees: "Všetci zamestnanci",
      color: "blue",
      date: new Date("2024-01-17"),
      status: "Zajtra"
    },
    {
      id: "6",
      title: "Kontrola projektu ABC",
      time: "11:00 - 12:00",
      type: "meeting",
      location: "Online - Teams",
      organizer: "Project Manager",
      attendees: "Vývojový tím",
      color: "green",
      date: new Date("2024-01-19"),
      status: "Piatok"
    }
  ]);

  const handleMeetingCreate = (newMeeting: any) => {
    setEvents([...events, newMeeting]);
  };

  const handleEventUpdate = (updatedEvent: any) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const createZoomLink = () => {
    const zoomId = Math.random().toString(36).substring(2, 15);
    const zoomUrl = `https://zoom.us/j/${zoomId}`;
    window.open(zoomUrl, '_blank');
  };

  const allEvents = events;

  // Filter events for selected date
  const selectedDateEvents = selectedDate 
    ? allEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      })
    : [];

  const todaysEvents = allEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  });

  const upcomingEvents = allEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate > today;
  });

  // Format selected date for display
  const formatSelectedDate = (date: Date | undefined) => {
    if (!date) return "Vyberte dátum";
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Dnes";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Zajtra";
    } else {
      return date.toLocaleDateString('sk-SK', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    }
  };

  const stats = [
    { number: todaysEvents.length, label: "Dnes", icon: Clock, color: "text-blue-600" },
    { number: allEvents.length, label: "Tento týždeň", icon: CalendarIcon, color: "text-green-600" },
    { number: allEvents.filter(e => e.location.includes("Online")).length, label: "Online", icon: Video, color: "text-purple-600" },
    { number: 2, label: "Pripomienky", icon: Bell, color: "text-orange-600" }
  ];

  const getEventIcon = (type: string, color: string) => {
    const iconClass = `h-4 w-4 text-white`;
    const bgClass = color === "blue" ? "bg-blue-500" : 
                   color === "green" ? "bg-green-500" : 
                   color === "purple" ? "bg-purple-500" : 
                   color === "red" ? "bg-red-500" : "bg-gray-500";
    
    return (
      <div className={`p-2 rounded-lg ${bgClass}`}>
        {type === "meeting" ? <Users className={iconClass} /> : 
         type === "presentation" ? <Video className={iconClass} /> : 
         type === "deadline" ? <AlertTriangle className={iconClass} /> : 
         <Clock className={iconClass} />}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Kalendár</h1>
        <p className="text-muted-foreground">Plánovanie stretnutí a termínov</p>
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Side - Calendar & Quick Actions */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Kalendár</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0 w-full"
                classNames={{
                  months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4 w-full flex flex-col",
                  caption: "flex justify-center pt-1 relative items-center w-full",
                  caption_label: "text-sm font-medium",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full",
                  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1 flex justify-center",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-full text-center text-sm p-0 relative flex-1 flex justify-center items-center [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground font-semibold",
                  day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30"
                }}
                modifiers={{
                  hasEvents: [new Date(), new Date("2024-01-17"), new Date("2024-01-19")]
                }}
                modifiersStyles={{
                  hasEvents: {
                    backgroundColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    fontWeight: "600",
                    position: "relative"
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Rýchle akcie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <NewMeetingDialog onMeetingCreate={handleMeetingCreate}>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Nové stretnutie
                </Button>
              </NewMeetingDialog>
              <Button variant="outline" className="w-full" onClick={createZoomLink}>
                <Video className="mr-2 h-4 w-4" />
                Vytvoriť Zoom link
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Events for Selected Date */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Udalosti - {formatSelectedDate(selectedDate)}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedDateEvents.length === 0 
                  ? "Žiadne udalosti na tento deň" 
                  : `${selectedDateEvents.length} ${selectedDateEvents.length === 1 ? 'udalosť' : selectedDateEvents.length < 5 ? 'udalosti' : 'udalostí'}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Deadlines filter dropdown */}
              <select 
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
                onChange={(e) => {
                  const timeframe = e.target.value;
                  console.log(`Filtering deadlines for: ${timeframe}`);
                  // Here would be the filtering logic for deadlines
                }}
              >
                <option value="">Všetky termíny</option>
                <option value="today">Dnes</option>
                <option value="tomorrow">Zajtra</option>
                <option value="next-week">Nasledný týždeň</option>
                <option value="next-month">Nasledný mesiac</option>
              </select>
              
              <NewMeetingDialog onMeetingCreate={handleMeetingCreate}>
                <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Pridať
                </Button>
              </NewMeetingDialog>
            </div>
          </div>

          <div className="space-y-4">
            {selectedDateEvents.length === 0 ? (
              <Card className="p-8">
                <CardContent className="p-0 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    Žiadne udalosti
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Na {formatSelectedDate(selectedDate).toLowerCase()} nemáte naplánované žiadne udalosti.
                  </p>
                  <NewMeetingDialog onMeetingCreate={handleMeetingCreate}>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Pridať novú udalosť
                    </Button>
                  </NewMeetingDialog>
                </CardContent>
              </Card>
            ) : (
              selectedDateEvents.map((event) => (
                <Card key={event.id} className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      {getEventIcon(event.type, event.color)}
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{event.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {event.status}
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1 mb-1">
                            <User className="h-3 w-3" />
                            {event.organizer}
                          </div>
                          <div className="text-xs text-muted-foreground/80">{event.attendees}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          {event.onlineLink && (
                            <Button 
                              size="sm" 
                              className="bg-gray-900 hover:bg-gray-800 text-white"
                              onClick={() => window.open(event.onlineLink, '_blank')}
                            >
                              <Video className="mr-1 h-3 w-3" />
                              Pripojiť sa
                            </Button>
                          )}
                          <EventDetailDialog event={event}>
                            <Button size="sm" variant="outline">
                              Detail
                            </Button>
                          </EventDetailDialog>
                          <EditEventDialog event={event} onEventUpdate={handleEventUpdate}>
                            <Button size="sm" variant="outline">
                              Upraviť
                            </Button>
                          </EditEventDialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};