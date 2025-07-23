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
  CheckCircle,
  Star,
  Filter,
  Bell,
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
  
  // Enhanced events data with better structure
  const allEvents = [
    {
      id: "1",
      title: "Team Sprint Planning",
      time: "09:00",
      duration: "1h 30m",
      type: "meeting",
      priority: "high",
      attendees: 5,
      location: "Conference Room A",
      status: "confirmed",
      color: "blue"
    },
    {
      id: "2", 
      title: "Client Presentation",
      time: "14:00",
      duration: "1h",
      type: "presentation",
      priority: "critical",
      attendees: 8,
      location: "Zoom Meeting",
      status: "confirmed",
      color: "purple",
      onlineLink: "https://zoom.us/j/123456789",
      meetingId: "123 456 789"
    },
    {
      id: "3",
      title: "Finálne materiály - DEADLINE",
      time: "17:00",
      duration: "2h",
      type: "deadline",
      priority: "critical",
      from: "Jan Novák",
      description: "Potrebné schválenie posledných zmien",
      status: "urgent",
      color: "red"
    },
    {
      id: "4",
      title: "Coffee with Maria",
      time: "11:00",
      duration: "30m",
      type: "personal",
      priority: "low",
      attendees: 2,
      location: "Café Central",
      status: "confirmed",
      color: "green"
    }
  ];

  const todaysEvents = allEvents.sort((a, b) => a.time.localeCompare(b.time));

  const quickStats = {
    totalEvents: todaysEvents.length,
    deadlines: todaysEvents.filter(e => e.type === "deadline").length,
    meetings: todaysEvents.filter(e => e.type === "meeting" || e.type === "presentation").length,
    urgentTasks: todaysEvents.filter(e => e.priority === "critical").length
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "meeting": return <Users className="h-4 w-4" />;
      case "presentation": return <Video className="h-4 w-4" />;
      case "deadline": return <AlertTriangle className="h-4 w-4" />;
      case "personal": return <Star className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getEventColorClasses = (color: string, priority: string) => {
    const baseClasses = "hover:shadow-md transition-all duration-300 hover-scale";
    
    if (priority === "critical") {
      return `${baseClasses} bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-l-red-500 hover:from-red-100 hover:to-red-200`;
    }
    
    switch (color) {
      case "blue": return `${baseClasses} bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-l-blue-500 hover:from-blue-100 hover:to-blue-200`;
      case "purple": return `${baseClasses} bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-l-purple-500 hover:from-purple-100 hover:to-purple-200`;
      case "green": return `${baseClasses} bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-l-green-500 hover:from-green-100 hover:to-green-200`;
      case "red": return `${baseClasses} bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-l-red-500 hover:from-red-100 hover:to-red-200`;
      default: return `${baseClasses} bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-l-gray-500`;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical": return <Badge className="bg-red-500 text-white animate-pulse">Kritické</Badge>;
      case "high": return <Badge className="bg-orange-500 text-white">Vysoké</Badge>;
      case "medium": return <Badge className="bg-yellow-500 text-white">Stredné</Badge>;
      case "low": return <Badge className="bg-green-500 text-white">Nízke</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Modern Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
            <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Smart Kalendár
              </h1>
              <p className="text-sm text-muted-foreground">AI-powered scheduling & deadline management</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover-scale">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{quickStats.totalEvents}</div>
              <div className="text-sm opacity-90">Udalosti dnes</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover-scale">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{quickStats.meetings}</div>
              <div className="text-sm opacity-90">Stretnutia</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white hover-scale">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{quickStats.deadlines}</div>
              <div className="text-sm opacity-90">Deadliny</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white hover-scale">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{quickStats.urgentTasks}</div>
              <div className="text-sm opacity-90">Urgentné</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Calendar & Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Calendar */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover-scale">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-indigo-600" />
                  Kalendár
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-lg border-0"
                  modifiers={{
                    hasEvents: [new Date(), new Date("2024-01-17"), new Date("2024-01-19")]
                  }}
                  modifiersStyles={{
                    hasEvents: {
                      backgroundColor: "hsl(239 84% 67%)",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "50%"
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-indigo-600" />
                  Rýchle akcie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Nová udalosť
                </Button>
                <Button variant="outline" className="w-full">
                  <Clock className="mr-2 h-4 w-4" />
                  Nový deadline
                </Button>
                <Button variant="outline" className="w-full">
                  <Video className="mr-2 h-4 w-4" />
                  Online meeting
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">AI</span>
                  </div>
                  Smart Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Bell className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span className="text-sm">2 kritické deadliny dnes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">Najlepší čas na prácu: 10:00-12:00</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Settings className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Odporučujem 15min pause medzi meetingmi</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center - Today's Schedule */}
          <div className="lg:col-span-5">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    Dnes - {selectedDate?.toLocaleDateString('sk-SK', { 
                      weekday: 'long',
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Badge variant="secondary">{todaysEvents.length} udalostí</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Žiadne udalosti na dnes</p>
                    <Button className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Pridať udalosť
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todaysEvents.map((event, index) => (
                      <div 
                        key={event.id} 
                        className={`p-4 rounded-xl ${getEventColorClasses(event.color, event.priority)} animate-fade-in`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              {getEventIcon(event.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {event.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {event.duration}
                                </span>
                              </div>
                              {event.from && (
                                <p className="text-sm text-gray-500 mt-1">Od: {event.from}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(event.priority)}
                            <Badge variant="outline" className="text-xs">
                              {event.type === "deadline" ? "Deadline" : "Meeting"}
                            </Badge>
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-sm text-gray-600 mb-3 ml-14">{event.description}</p>
                        )}

                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 ml-14">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                            {event.attendees && (
                              <>
                                <span className="mx-2">•</span>
                                <Users className="h-3 w-3" />
                                {event.attendees} účastníkov
                              </>
                            )}
                          </div>
                        )}

                        {event.onlineLink && (
                          <div className="mt-3 ml-14">
                            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 font-medium text-sm">
                                    <Video className="h-4 w-4 text-blue-600" />
                                    Online Meeting
                                  </div>
                                  {event.meetingId && (
                                    <div className="text-xs text-gray-600">
                                      ID: {event.meetingId}
                                    </div>
                                  )}
                                </div>
                                <Button 
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => window.open(event.onlineLink, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Pripojiť
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {event.type === "deadline" && (
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/30 ml-14">
                            <span className="text-sm text-gray-600">
                              Zostáva: {event.duration}
                            </span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="bg-white/50">
                                <CalendarIcon className="mr-1 h-3 w-3" />
                                Naplánuj
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600">
                                Otvoriť email
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

          {/* Right Sidebar - Upcoming & Weekly */}
          <div className="lg:col-span-3 space-y-6">
            {/* Upcoming Events */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-indigo-600" />
                  Nadchádzajúce
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-l-blue-500">
                    <div className="font-medium text-sm">Quarterly Review</div>
                    <div className="text-xs text-gray-600">Zajtra 10:00</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-l-4 border-l-red-500">
                    <div className="font-medium text-sm">Product Launch</div>
                    <div className="text-xs text-gray-600">20.1. 09:00</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-l-green-500">
                    <div className="font-medium text-sm">Team Building</div>
                    <div className="text-xs text-gray-600">25.1. 14:00</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Overview */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-indigo-600" />
                  Tento týždeň
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { day: "Po", events: 3, color: "blue" },
                    { day: "Ut", events: 1, color: "green" },
                    { day: "St", events: 2, color: "orange" },
                    { day: "Št", events: 1, color: "purple" },
                    { day: "Pi", events: 0, color: "gray" }
                  ].map((item, index) => (
                    <div 
                      key={item.day}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover-scale ${
                        item.events > 0 
                          ? `bg-gradient-to-r from-${item.color}-50 to-${item.color}-100` 
                          : 'bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{item.day}</span>
                      <Badge variant={item.events > 0 ? "default" : "outline"}>
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
    </div>
  );
};