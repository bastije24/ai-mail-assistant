import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Clock, Users, MapPin, Video } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface CalendarViewProps {
  emails?: any[];
}

export const CalendarView = ({ emails }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const events = [
    {
      id: "1",
      title: "Team Meeting - Sprint Planning",
      time: "09:00 - 10:30",
      type: "meeting",
      attendees: 5,
      location: "Conference Room A",
      priority: "high",
      source: "email"
    },
    {
      id: "2", 
      title: "Client Presentation",
      time: "14:00 - 15:00",
      type: "presentation",
      attendees: 8,
      location: "Zoom Meeting", 
      priority: "high",
      source: "calendar"
    },
    {
      id: "3",
      title: "Project Deadline",
      time: "17:00",
      type: "deadline",
      priority: "critical",
      source: "email"
    },
    {
      id: "4",
      title: "Coffee chat with Maria",
      time: "11:00 - 11:30", 
      type: "personal",
      attendees: 2,
      location: "Café Central",
      priority: "low",
      source: "email"
    }
  ];

  const upcomingEvents = [
    {
      id: "5",
      title: "Quarterly Review",
      date: new Date("2024-01-17T10:00:00"),
      type: "meeting",
      priority: "high"
    },
    {
      id: "6",
      title: "Product Launch",
      date: new Date("2024-01-20T09:00:00"),
      type: "deadline", 
      priority: "critical"
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case "meeting": return <Users className="h-3 w-3" />;
      case "presentation": return <Video className="h-3 w-3" />;
      case "deadline": return <Clock className="h-3 w-3" />;
      case "personal": return <MapPin className="h-3 w-3" />;
      default: return <CalendarIcon className="h-3 w-3" />;
    }
  };

  const getEventColor = (type: string, priority: string) => {
    if (priority === "critical") return "border-l-red-500 bg-red-50";
    if (priority === "high") return "border-l-orange-500 bg-orange-50";
    
    switch (type) {
      case "meeting": return "border-l-blue-500 bg-blue-50";
      case "presentation": return "border-l-purple-500 bg-purple-50";
      case "deadline": return "border-l-red-500 bg-red-50";
      case "personal": return "border-l-green-500 bg-green-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical": return <Badge className="bg-red-100 text-red-800">Kritické</Badge>;
      case "high": return <Badge className="bg-orange-100 text-orange-800">Vysoké</Badge>;
      case "medium": return <Badge className="bg-yellow-100 text-yellow-800">Stredné</Badge>;
      case "low": return <Badge className="bg-green-100 text-green-800">Nízke</Badge>;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-indigo-500 rounded-lg flex items-center justify-center">
          <CalendarIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Kalendár</h1>
          <p className="text-sm text-muted-foreground">Prehľad stretnutí a termínov z emailov</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kalendár</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0"
                modifiers={{
                  hasEvents: [
                    new Date("2024-01-15"),
                    new Date("2024-01-16"), 
                    new Date("2024-01-17"),
                    new Date("2024-01-20")
                  ]
                }}
                modifiersStyles={{
                  hasEvents: {
                    backgroundColor: "hsl(var(--ai-primary-light))",
                    color: "hsl(var(--ai-primary))",
                    fontWeight: "bold"
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Quick Add */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <Button className="w-full bg-ai-primary hover:bg-ai-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Pridať udalosť
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Today's Events */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Dnes - {selectedDate?.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long' })}
                <Badge variant="secondary">{events.length} udalostí</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className={`p-3 rounded-lg border-l-4 ${getEventColor(event.type, event.priority)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2">
                      {getEventIcon(event.type)}
                      <div>
                        <h3 className="font-medium text-foreground text-sm">{event.title}</h3>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(event.priority)}
                      <Badge variant="outline" className="text-xs">
                        {event.source === "email" ? "Email" : "Kalendár"}
                      </Badge>
                    </div>
                  </div>
                  
                  {(event.location || event.attendees) && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                      {event.attendees && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.attendees} účastníkov
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nadchádzajúce udalosti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type, event.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {getEventIcon(event.type)}
                    <div>
                      <h3 className="font-medium text-foreground text-sm mb-1">{event.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {event.date.toLocaleDateString('sk-SK', { 
                          day: 'numeric', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  {getPriorityBadge(event.priority)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Calendar Insights */}
      <Card className="bg-ai-primary-light border-ai-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-6 w-6 bg-ai-primary rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">AI</span>
            </div>
            Kalendárne insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Dnešný prehľad</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 4 stretnutia naplánované</li>
                <li>• 1 kritický deadline</li>
                <li>• Najvyťaženejší čas: 14:00-16:00</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">AI odporúčania</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Pridať 15min buffer pred prezentáciou</li>
                <li>• Pripraviť materiály pre client meeting</li>
                <li>• Potvrdiť účasť na team planningu</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};