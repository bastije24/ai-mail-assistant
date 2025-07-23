import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Users, 
  Video, 
  ExternalLink, 
  AlertTriangle,
  Settings
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
  
  const todaysEvents = [
    {
      id: "1",
      title: "Team Sprint Planning",
      time: "09:00",
      type: "meeting",
      priority: "high",
      attendees: 5,
      location: "Conference Room A"
    },
    {
      id: "2", 
      title: "Client Presentation",
      time: "14:00",
      type: "presentation",
      priority: "high",
      attendees: 8,
      location: "Zoom Meeting",
      onlineLink: "https://zoom.us/j/123456789",
      meetingId: "123 456 789"
    },
    {
      id: "3",
      title: "Finálne materiály - DEADLINE",
      time: "17:00",
      type: "deadline",
      priority: "critical",
      from: "Jan Novák",
      description: "Potrebné schválenie posledných zmien"
    },
    {
      id: "4",
      title: "Coffee with Maria",
      time: "11:00",
      type: "personal",
      priority: "low",
      location: "Café Central"
    }
  ];

  const upcomingEvents = [
    { title: "Quarterly Review", date: "Zajtra 10:00", priority: "high" },
    { title: "Product Launch", date: "20.1. 09:00", priority: "critical" },
    { title: "Team Building", date: "25.1. 14:00", priority: "medium" }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case "meeting": return <Users className="h-4 w-4" />;
      case "presentation": return <Video className="h-4 w-4" />;
      case "deadline": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "border-l-red-500 bg-red-50";
      case "high": return "border-l-orange-500 bg-orange-50";
      case "medium": return "border-l-yellow-500 bg-yellow-50";
      case "low": return "border-l-green-500 bg-green-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical": return <Badge className="bg-red-500 text-white">Kritické</Badge>;
      case "high": return <Badge className="bg-orange-500 text-white">Vysoké</Badge>;
      case "medium": return <Badge className="bg-yellow-500 text-white">Stredné</Badge>;
      case "low": return <Badge className="bg-green-500 text-white">Nízke</Badge>;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Simple Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Kalendár & Deadliny</h1>
        <p className="text-gray-600">Prehľad stretnutí a termínov</p>
      </div>

      {/* Simple Stats */}
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-xl font-bold text-blue-600">{todaysEvents.length}</div>
            <div className="text-sm text-gray-600">Dnes</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-xl font-bold text-green-600">{todaysEvents.filter(e => e.type === "meeting" || e.type === "presentation").length}</div>
            <div className="text-sm text-gray-600">Stretnutia</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-xl font-bold text-red-600">{todaysEvents.filter(e => e.type === "deadline").length}</div>
            <div className="text-sm text-gray-600">Deadliny</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-xl font-bold text-orange-600">{todaysEvents.filter(e => e.priority === "critical").length}</div>
            <div className="text-sm text-gray-600">Urgentné</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Left - Calendar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Kalendár
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0"
                modifiers={{
                  hasEvents: [new Date(), new Date("2024-01-17"), new Date("2024-01-19")]
                }}
                modifiersStyles={{
                  hasEvents: {
                    backgroundColor: "#3b82f6",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "50%"
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rýchle akcie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Nová udalosť
              </Button>
              <Button variant="outline" className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                Nový deadline
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Center - Today's Events */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                Dnes - {selectedDate?.toLocaleDateString('sk-SK', { 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Žiadne udalosti</p>
                </div>
              ) : (
                todaysEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className={`p-4 rounded-lg border-l-4 ${getPriorityColor(event.priority)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        {getEventIcon(event.type)}
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.time}</p>
                          {event.from && (
                            <p className="text-sm text-gray-500">Od: {event.from}</p>
                          )}
                        </div>
                      </div>
                      {getPriorityBadge(event.priority)}
                    </div>

                    {event.description && (
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    )}

                    {event.location && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        📍 {event.location}
                        {event.attendees && ` • ${event.attendees} účastníkov`}
                      </p>
                    )}

                    {event.onlineLink && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 font-medium text-sm">
                              <Video className="h-4 w-4" />
                              Online Meeting
                            </div>
                            {event.meetingId && (
                              <div className="text-xs text-gray-600">ID: {event.meetingId}</div>
                            )}
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

                    {event.type === "deadline" && (
                      <div className="flex gap-2 mt-3 pt-2 border-t">
                        <Button size="sm" variant="outline">
                          Naplánuj
                        </Button>
                        <Button size="sm">
                          Otvoriť email
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right - Upcoming & Insights */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nadchádzajúce</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${getPriorityColor(event.priority)}`}>
                  <div className="font-medium text-sm">{event.title}</div>
                  <div className="text-xs text-gray-600">{event.date}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>💡 2 kritické deadliny dnes</div>
              <div>⏰ Najlepší čas: 10:00-12:00</div>
              <div>📅 Odporúčam pauzy medzi meetingmi</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tento týždeň</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { day: "Pondelok", events: 3 },
                  { day: "Utorok", events: 1 },
                  { day: "Streda", events: 2 },
                  { day: "Štvrtok", events: 1 },
                  { day: "Piatok", events: 0 }
                ].map((item) => (
                  <div key={item.day} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{item.day}</span>
                    <Badge variant="outline">
                      {item.events > 0 ? `${item.events} udalostí` : "Voľný"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};