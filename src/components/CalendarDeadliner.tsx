import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Users, 
  Video, 
  ExternalLink, 
  AlertTriangle,
  DollarSign,
  FileText
} from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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
  
  // Všetky udalosti spolu - meetings, deadliny, faktúry atd.
  const allEvents = [
    {
      id: "1",
      title: "Team Meeting",
      time: "09:00",
      type: "meeting",
      date: new Date(),
      attendees: 5,
      location: "Conference Room A"
    },
    {
      id: "2", 
      title: "Client Presentation",
      time: "14:00",
      type: "meeting",
      date: new Date(),
      location: "Zoom Meeting",
      onlineLink: "https://zoom.us/j/123456789",
      meetingId: "123 456 789"
    },
    {
      id: "3",
      title: "Splatenie faktúry",
      time: "Do 17:00",
      type: "deadline",
      date: new Date(),
      description: "Faktúra #2024-001 - 1,500€"
    },
    {
      id: "4",
      title: "Dodanie projektu",
      time: "Do 23:59",
      type: "deadline", 
      date: new Date(),
      description: "Finálne materiály pre klienta"
    },
    {
      id: "5",
      title: "Quarterly Review",
      time: "10:00",
      type: "meeting",
      date: new Date("2024-01-17"),
      attendees: 8
    },
    {
      id: "6",
      title: "Daňové priznanie",
      time: "Do konca dňa",
      type: "deadline",
      date: new Date("2024-01-19"),
      description: "Podanie daňového priznania"
    }
  ];

  // Filtruj udalosti pre vybraný deň
  const selectedDateEvents = allEvents.filter(event => {
    const eventDate = new Date(event.date);
    const selected = selectedDate || new Date();
    return eventDate.toDateString() === selected.toDateString();
  }).sort((a, b) => a.time.localeCompare(b.time));

  // Zisti dátumy s udalosťami pre kalendár
  const datesWithEvents = allEvents.map(event => new Date(event.date.toDateString()));

  const getEventIcon = (type: string) => {
    switch (type) {
      case "meeting": return <Users className="h-4 w-4 text-blue-600" />;
      case "deadline": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "invoice": return <DollarSign className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "meeting": return "border-l-blue-500 bg-blue-50";
      case "deadline": return "border-l-red-500 bg-red-50";
      case "invoice": return "border-l-green-500 bg-green-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Jednoduchý header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Kalendár</h1>
        <p className="text-gray-600">Stretnutia, deadliny a dôležité termíny</p>
      </div>

      {/* Hlavný kalendár a udalosti */}
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
        
        {/* Kalendár */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Kalendár
              </span>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Pridať
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0 w-full"
              modifiers={{
                hasEvents: datesWithEvents
              }}
              modifiersStyles={{
                hasEvents: {
                  backgroundColor: "#3b82f6",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "6px"
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Udalosti pre vybraný deň */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate?.toLocaleDateString('sk-SK', { 
                weekday: 'long',
                day: 'numeric', 
                month: 'long' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Žiadne udalosti</p>
                <Button className="mt-3" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Pridať udalosť
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className={`p-4 rounded-lg border-l-4 transition-all hover:shadow-md ${getEventColor(event.type)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        {getEventIcon(event.type)}
                        <div>
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {event.type === "meeting" ? "Meeting" : "Deadline"}
                      </Badge>
                    </div>

                    {event.description && (
                      <p className="text-sm text-gray-600 mb-3 ml-7">{event.description}</p>
                    )}

                    {event.location && (
                      <div className="text-sm text-gray-600 ml-7 flex items-center gap-1">
                        📍 {event.location}
                        {event.attendees && ` • ${event.attendees} ľudí`}
                      </div>
                    )}

                    {event.onlineLink && (
                      <div className="mt-3 ml-7 p-3 bg-white rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Video className="h-4 w-4" />
                              Zoom Meeting
                            </div>
                            <div className="text-xs text-gray-600">ID: {event.meetingId}</div>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => window.open(event.onlineLink, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Pripojiť
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Prehľad nadchádzajúcich udalostí */}
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Nadchádzajúce udalosti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allEvents
              .filter(event => {
                const eventDate = new Date(event.date);
                const today = new Date();
                return eventDate > today;
              })
              .slice(0, 6)
              .map((event) => (
                <div 
                  key={event.id} 
                  className={`p-3 rounded-lg border-l-4 ${getEventColor(event.type)}`}
                >
                  <div className="flex items-start gap-2">
                    {getEventIcon(event.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <p className="text-xs text-gray-600">
                        {event.date.toLocaleDateString('sk-SK', { 
                          day: 'numeric', 
                          month: 'short' 
                        })} • {event.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};