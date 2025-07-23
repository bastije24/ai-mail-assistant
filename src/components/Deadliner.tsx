import { Clock, AlertTriangle, Calendar, CheckCircle, Video, ExternalLink } from "lucide-react";
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

interface DeadlinerProps {
  emails: Email[];
}

export const Deadliner = ({ emails }: DeadlinerProps) => {
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
        <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Deadliner</h1>
          <p className="text-sm text-muted-foreground">Správa termínov a deadlineov z emailov</p>
        </div>
      </div>

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
                        <Calendar className="mr-2 h-3 w-3" />
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
    </div>
  );
};