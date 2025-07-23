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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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
  
  // Calendar events data
  const events = [
    {
      id: "1",
      title: "Team Meeting - Sprint Planning",
      time: "09:00 - 10:30",
      type: "meeting",
      attendees: 5,
      location: "Conference Room A",
      priority: "high",
      source: "email",
      isOnline: false
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
      passcode: "client2024"
    },
    {
      id: "3",
      title: "Project Deadline",
      time: "17:00",
      type: "deadline",
      priority: "critical",
      source: "email",
      isOnline: false
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
      isOnline: false
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
      meetingId: "abc-defg-hij"
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

  // Deadlines data
  const deadlines = [
    {
      id: "1",
      title: "Finálne materiály pre klienta",
      from: "Jan Novák",
      dueDate: new Date("2024-01-19T17:00:00"),
      priority: "Kritická",
      status: "active",
      description: "Potrebné schválenie posledných zmien pred dodaním v pondelok",
      estimatedTime: "2 hodiny",
      emailId: "1",
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
      id: "2",
      title: "Potvrdenie stretnutia",
      from: "Mária Svobodová", 
      dueDate: new Date("2024-01-20T10:00:00"),
      priority: "Vysoká",
      status: "active",
      description: "Odpoveď na návrh termínov stretnutia",
      estimatedTime: "15 minút",
      emailId: "2",
      meetingInfo: {
        isOnline: true,
        platform: "Google Meet",
        link: "https://meet.google.com/xyz-abcd-efg",
        meetingId: "xyz-abcd-efg",
        scheduledTime: "2024-01-23T14:00:00"
      }
    },
    {
      id: "3",
      title: "Mesačná správa",
      from: "Peter Novotný",
      dueDate: new Date("2024-01-25T23:59:00"),
      priority: "Stredná", 
      status: "upcoming",
      description: "Príprava mesačného reportu pre management",
      estimatedTime: "4 hodiny",
      emailId: "3"
    },
    {
      id: "4",
      title: "Prezentácia produktu",
      from: "Anna Krejčová",
      dueDate: new Date("2024-01-15T14:00:00"),
      priority: "Dokončené",
      status: "completed", 
      description: "Úspešne prezentované včera",
      estimatedTime: "Dokončené",
      emailId: "4"
    }
  ];

  // Calendar helper functions
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

  // Deadlines helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Kritická": return "bg-red-100 text-red-800 border-red-200";
      case "Vysoká": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Stredná": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Dokončené": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string, priority: string) => {
    if (status === "completed") return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (priority === "Kritická") return <AlertTriangle className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4 text-orange-600" />;
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

  const activeDeadlines = deadlines.filter(d => d.status === "active");
  const upcomingDeadlines = deadlines.filter(d => d.status === "upcoming");
  const completedDeadlines = deadlines.filter(d => d.status === "completed");

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

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Kalendár</TabsTrigger>
          <TabsTrigger value="deadlines">Deadliny</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
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
                          </div>
                          
                          {event.isOnline && event.onlineLink && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-xs font-medium text-blue-800">
                                    <Video className="h-3 w-3" />
                                    Online stretnutie
                                  </div>
                                  {event.meetingId && (
                                    <div className="text-xs text-blue-700">
                                      ID: {event.meetingId}
                                    </div>
                                  )}
                                  {event.passcode && (
                                    <div className="text-xs text-blue-700">
                                      Heslo: {event.passcode}
                                    </div>
                                  )}
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-6 text-xs px-2 text-blue-600 border-blue-300 hover:bg-blue-100"
                                  onClick={() => window.open(event.onlineLink, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Pripojiť
                                </Button>
                              </div>
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
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-6">
          {/* Urgent Deadlines */}
          {activeDeadlines.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Urgentné termíny ({activeDeadlines.length})
              </h2>
              <div className="space-y-3">
                {activeDeadlines.map((deadline) => (
                  <Card key={deadline.id} className="border-l-4 border-l-red-500 hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(deadline.status, deadline.priority)}
                          <div>
                            <h3 className="font-medium text-foreground mb-1">{deadline.title}</h3>
                            <p className="text-sm text-muted-foreground">Od: {deadline.from}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(deadline.priority)}>
                            {deadline.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {formatDeadline(deadline.dueDate)}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{deadline.description}</p>
                      
                      {deadline.meetingInfo && deadline.meetingInfo.isOnline && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                                <Video className="h-4 w-4" />
                                {deadline.meetingInfo.platform} stretnutie
                              </div>
                              <div className="text-xs text-blue-700">
                                ID: {deadline.meetingInfo.meetingId}
                              </div>
                              {deadline.meetingInfo.passcode && (
                                <div className="text-xs text-blue-700">
                                  Heslo: {deadline.meetingInfo.passcode}
                                </div>
                              )}
                              {deadline.meetingInfo.scheduledTime && (
                                <div className="text-xs text-blue-700">
                                  Čas: {new Date(deadline.meetingInfo.scheduledTime).toLocaleString('sk-SK')}
                                </div>
                              )}
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-blue-600 border-blue-300 hover:bg-blue-100"
                              onClick={() => window.open(deadline.meetingInfo.link, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Pripojiť
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Odhadovaný čas: {deadline.estimatedTime}
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Deadlines */}
          {upcomingDeadlines.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-foreground">
                Nadchádzajúce termíny ({upcomingDeadlines.length})
              </h2>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <Card key={deadline.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(deadline.status, deadline.priority)}
                          <div>
                            <h3 className="font-medium text-foreground mb-1">{deadline.title}</h3>
                            <p className="text-sm text-muted-foreground">Od: {deadline.from}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(deadline.priority)}>
                            {deadline.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {formatDeadline(deadline.dueDate)}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{deadline.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Odhadovaný čas: {deadline.estimatedTime}
                        </span>
                        <Button size="sm" variant="outline">
                          Zobraz email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completedDeadlines.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-muted-foreground">
                Dokončené ({completedDeadlines.length})
              </h2>
              <div className="space-y-2">
                {completedDeadlines.map((deadline) => (
                  <Card key={deadline.id} className="opacity-75">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground line-through">
                              {deadline.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">Od: {deadline.from}</p>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(deadline.priority)}>
                          Dokončené
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};