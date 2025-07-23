import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Users, 
  MapPin, 
  Video, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle 
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
  
  // Combined events and deadlines data
  const allEvents = [
    // Regular calendar events
    {
      id: "1",
      title: "Team Meeting - Sprint Planning",
      time: "09:00 - 10:30",
      type: "meeting",
      attendees: 5,
      location: "Conference Room A",
      priority: "high",
      source: "email",
      isOnline: false,
      date: new Date("2024-01-15T09:00:00")
    },
    {
      id: "2", 
      title: "Client Presentation",
      time: "14:00 - 15:00",
      type: "presentation",
      attendees: 8,
      location: "Zoom Meeting",
      onlineLink: "https://zoom.us/j/123456789", 
      priority: "high",
      source: "calendar",
      isOnline: true,
      meetingId: "123 456 789",
      passcode: "client2024",
      date: new Date("2024-01-15T14:00:00")
    },
    // Deadlines integrated as events
    {
      id: "3",
      title: "Finálne materiály pre klienta",
      time: "17:00",
      type: "deadline",
      priority: "critical",
      source: "email",
      isOnline: false,
      date: new Date("2024-01-19T17:00:00"),
      from: "Jan Novák",
      description: "Potrebné schválenie posledných zmien pred dodaním v pondelok",
      estimatedTime: "2 hodiny",
      status: "active",
      meetingInfo: {
        isOnline: true,
        platform: "Zoom",
        link: "https://zoom.us/j/987654321",
        meetingId: "987 654 321",
        passcode: "final2024",
        scheduledTime: "2024-01-19T16:00:00"
      }
    },
    {
      id: "4",
      title: "Coffee chat with Maria",
      time: "11:00 - 11:30", 
      type: "personal",
      attendees: 2,
      location: "Café Central",
      priority: "low",
      source: "email",
      isOnline: false,
      date: new Date("2024-01-15T11:00:00")
    },
    {
      id: "5",
      title: "Weekly Standup",
      time: "08:30 - 09:00",
      type: "meeting",
      attendees: 8,
      location: "Google Meet",
      onlineLink: "https://meet.google.com/abc-defg-hij",
      priority: "medium",
      source: "email", 
      isOnline: true,
      meetingId: "abc-defg-hij",
      date: new Date("2024-01-15T08:30:00")
    },
    // More deadlines
    {
      id: "6",
      title: "Potvrdenie stretnutia",
      time: "10:00",
      type: "deadline",
      priority: "high",
      source: "email",
      isOnline: false,
      date: new Date("2024-01-20T10:00:00"),
      from: "Mária Svobodová",
      description: "Odpoveď na návrh termínov stretnutia",
      estimatedTime: "15 minút",
      status: "active",
      meetingInfo: {
        isOnline: true,
        platform: "Google Meet",
        link: "https://meet.google.com/xyz-abcd-efg",
        meetingId: "xyz-abcd-efg",
        scheduledTime: "2024-01-23T14:00:00"
      }
    },
    {
      id: "7",
      title: "Mesačná správa",
      time: "23:59",
      type: "deadline",
      priority: "medium",
      source: "email",
      isOnline: false,
      date: new Date("2024-01-25T23:59:00"),
      from: "Peter Novotný",
      description: "Príprava mesačného reportu pre management",
      estimatedTime: "4 hodiny",
      status: "upcoming"
    }
  ];

  const upcomingEvents = [
    {
      id: "8",
      title: "Quarterly Review",
      date: new Date("2024-01-17T10:00:00"),
      type: "meeting",
      priority: "high"
    },
    {
      id: "9",
      title: "Product Launch Deadline",
      date: new Date("2024-01-20T09:00:00"),
      type: "deadline", 
      priority: "critical"
    }
  ];

  // Filter today's events (including deadlines)
  const todaysEvents = allEvents.filter(event => {
    const today = selectedDate || new Date();
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === today.toDateString();
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get dates with events for calendar highlighting
  const datesWithEvents = allEvents.map(event => new Date(event.date.toDateString()));

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

  const getStatusIcon = (type: string, status?: string, priority?: string) => {
    if (status === "completed") return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (type === "deadline" && priority === "critical") return <AlertTriangle className="h-4 w-4 text-red-600" />;
    if (type === "deadline") return <Clock className="h-4 w-4 text-orange-600" />;
    return getEventIcon(type);
  };

  const formatDeadline = (date: Date) => {
    const now = new Date();
    const diffHours = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 0) return "Prešlý termín";
    if (diffHours < 24) return `${diffHours} hodín`;
    if (diffHours < 48) return "Zajtra";
    return date.toLocaleDateString('sk-SK', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-indigo-500 rounded-lg flex items-center justify-center">
          <CalendarIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Kalendár & Deadliny</h1>
          <p className="text-sm text-muted-foreground">Prehľad stretnutí, termínov a deadlineov z emailov</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1 space-y-4">
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
                  hasEvents: datesWithEvents
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
          <Card>
            <CardContent className="p-4">
              <Button className="w-full bg-ai-primary hover:bg-ai-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Pridať udalosť
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Štatistiky</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Aktívne deadliny</span>
                <Badge className="bg-red-100 text-red-800">
                  {allEvents.filter(e => e.type === "deadline" && e.status === "active").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dnešné udalosti</span>
                <Badge variant="secondary">{todaysEvents.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tento týždeň</span>
                <Badge variant="outline">
                  {allEvents.filter(e => {
                    const eventDate = new Date(e.date);
                    const today = new Date();
                    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                    return eventDate >= weekStart && eventDate <= weekEnd;
                  }).length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Next Urgent Deadline */}
          {(() => {
            const nextDeadline = allEvents
              .filter(e => e.type === "deadline" && e.status === "active")
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
            
            return nextDeadline ? (
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Najbližší deadline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-medium text-sm">{nextDeadline.title}</h3>
                    <p className="text-xs text-muted-foreground">Od: {nextDeadline.from}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      {formatDeadline(nextDeadline.date)}
                    </Badge>
                    {getPriorityBadge(nextDeadline.priority)}
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Otvoriť
                  </Button>
                </CardContent>
              </Card>
            ) : null;
          })()}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rýchle akcie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Nový deadline
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Naplánovať stretnutie
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Video className="mr-2 h-4 w-4" />
                Vytvoriť online meeting
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Today's Events (including deadlines) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                {selectedDate?.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long' })}
                <Badge variant="secondary">{todaysEvents.length} udalostí</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Žiadne udalosti na tento deň</p>
                </div>
              ) : (
                todaysEvents.map((event) => (
                  <div key={event.id} className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type, event.priority)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(event.type, event.status, event.priority)}
                        <div>
                          <h3 className="font-medium text-foreground text-sm">{event.title}</h3>
                          <p className="text-xs text-muted-foreground">{event.time}</p>
                          {event.from && (
                            <p className="text-xs text-muted-foreground">Od: {event.from}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(event.priority)}
                        <Badge variant="outline" className="text-xs">
                          {event.type === "deadline" ? "Deadline" : event.source === "email" ? "Email" : "Kalendár"}
                        </Badge>
                        {event.type === "deadline" && (
                          <Badge variant="outline" className="text-xs">
                            {formatDeadline(event.date)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                    )}
                    
                    {(event.location || event.attendees || event.isOnline) && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {event.location && (
                            <div className="flex items-center gap-1">
                              {event.isOnline ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                              {event.location}
                            </div>
                          )}
                          {event.attendees && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendees} účastníkov
                            </div>
                          )}
                          {event.estimatedTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.estimatedTime}
                            </div>
                          )}
                        </div>
                        
                        {((event.isOnline && event.onlineLink) || (event.meetingInfo && event.meetingInfo.isOnline)) && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                                  <Video className="h-4 w-4" />
                                  {event.meetingInfo?.platform || "Online"} stretnutie
                                </div>
                                {(event.meetingId || event.meetingInfo?.meetingId) && (
                                  <div className="text-xs text-blue-700">
                                    ID: {event.meetingId || event.meetingInfo?.meetingId}
                                  </div>
                                )}
                                {(event.passcode || event.meetingInfo?.passcode) && (
                                  <div className="text-xs text-blue-700">
                                    Heslo: {event.passcode || event.meetingInfo?.passcode}
                                  </div>
                                )}
                                {event.meetingInfo?.scheduledTime && (
                                  <div className="text-xs text-blue-700">
                                    Čas: {new Date(event.meetingInfo.scheduledTime).toLocaleString('sk-SK')}
                                  </div>
                                )}
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-blue-600 border-blue-300 hover:bg-blue-100"
                                onClick={() => window.open(event.onlineLink || event.meetingInfo?.link, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Pripojiť
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {event.type === "deadline" && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <span className="text-xs text-muted-foreground">
                          Deadline: {event.estimatedTime}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            Plánovať
                          </Button>
                          <Button size="sm" className="bg-ai-primary hover:bg-ai-primary/90">
                            Otvoriť email
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Insights & Actions */}
        <div className="lg:col-span-2 space-y-4">
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
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Dnešný prehľad</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {todaysEvents.filter(e => e.type !== "deadline").length} stretnutí naplánovaných</li>
                    <li>• {todaysEvents.filter(e => e.type === "deadline").length} deadlineov</li>
                    <li>• Najvyťaženejší čas: 14:00-16:00</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">AI odporúčania</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Pripraviť materiály pre deadliny</li>
                    <li>• Pridať 15min buffer pred prezentáciou</li>
                    <li>• Potvrdiť účasť na stretnutiach</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nadchádzajúce udalosti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className={`p-3 rounded-lg border-l-4 ${getEventColor(event.type, event.priority)}`}>
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

          {/* Weekly Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Týždenný prehľad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm">Pondelok</span>
                  <Badge variant="outline">3 udalosti</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Utorok</span>
                  <Badge variant="outline">1 deadline</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="text-sm">Streda</span>
                  <Badge variant="outline">2 stretnutia</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span className="text-sm">Štvrtok</span>
                  <Badge variant="outline">1 prezentácia</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Piatok</span>
                  <Badge variant="outline">Voľný deň</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};