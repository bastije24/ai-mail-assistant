import { useState } from "react";
import { Calendar, Video, Clock, Users, CheckCircle, AlertTriangle, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MeetingDetail } from "./MeetingDetail";

interface Meeting {
  id: string;
  title: string;
  date: Date;
  duration: number;
  participants: string[];
  status: "processing" | "ready" | "attention";
  hasRecording: boolean;
  confidence: "high" | "medium" | "low";
  summary: string[];
  questionsCount: number;
  actionsCount: number;
  leaderboardTop: { name: string; score: number }[];
}

export const MeetingCalendar = () => {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "detail">("calendar");

  // Mock data
  const meetings: Meeting[] = [
    {
      id: "1",
      title: "Týždenný standup",
      date: new Date(2024, 9, 24, 9, 0),
      duration: 30,
      participants: ["Martin K.", "Anna S.", "Peter N."],
      status: "ready",
      hasRecording: true,
      confidence: "high",
      summary: [
        "Dokončené úlohy z minulého týždňa",
        "Plány na nadchádzajúci týždeň",
        "Riešenie blokátorov v projekte X"
      ],
      questionsCount: 3,
      actionsCount: 5,
      leaderboardTop: [
        { name: "Martin K.", score: 85 },
        { name: "Anna S.", score: 78 }
      ]
    },
    {
      id: "2", 
      title: "Kvartálne plánovanie Q4",
      date: new Date(2024, 9, 23, 14, 0),
      duration: 120,
      participants: ["Martin K.", "Anna S.", "Peter N.", "Lucia M.", "Tomáš V."],
      status: "processing",
      hasRecording: true,
      confidence: "medium",
      summary: [],
      questionsCount: 0,
      actionsCount: 0,
      leaderboardTop: []
    },
    {
      id: "3",
      title: "Client Meeting - ABC Corp",
      date: new Date(2024, 9, 22, 10, 30),
      duration: 60,
      participants: ["Martin K.", "Anna S."],
      status: "attention", 
      hasRecording: false,
      confidence: "low",
      summary: [
        "Prezentácia nových funkcií",
        "Diskusia o cenách",
        "Ďalšie kroky a timeline"
      ],
      questionsCount: 8,
      actionsCount: 3,
      leaderboardTop: [
        { name: "Martin K.", score: 92 },
        { name: "Anna S.", score: 76 }
      ]
    }
  ];

  const getStatusIcon = (status: Meeting["status"]) => {
    switch (status) {
      case "processing": return <Clock className="h-4 w-4 text-orange-500" />;
      case "ready": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "attention": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusLabel = (status: Meeting["status"]) => {
    switch (status) {
      case "processing": return "⏳ Spracováva sa";
      case "ready": return "✅ Pripravené";
      case "attention": return "⚠️ Potrebuje pozornosť";
    }
  };

  const getConfidenceBadge = (confidence: Meeting["confidence"]) => {
    const colors = {
      high: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", 
      low: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    };
    
    return (
      <Badge variant="secondary" className={colors[confidence]}>
        {confidence === "high" ? "Vysoká" : confidence === "medium" ? "Stredná" : "Nízka"} dôvera
      </Badge>
    );
  };

  if (viewMode === "detail" && selectedMeeting) {
    return (
      <MeetingDetail 
        meeting={selectedMeeting}
        onBack={() => {
          setViewMode("calendar");
          setSelectedMeeting(null);
        }}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
            <Video className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Meeting Minutes</h1>
            <p className="text-sm text-muted-foreground">
              Spravujte záznamy z meetingov, úlohy a sledujte účasť
            </p>
          </div>
        </div>

        {/* Status Banner */}
        {meetings.some(m => m.status === "ready") && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-800 dark:text-green-300">
                Minutes ready – pred 2 minútami ✨
              </span>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{meetings.length}</p>
                  <p className="text-sm text-muted-foreground">Meetingy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{meetings.filter(m => m.status === "ready").length}</p>
                  <p className="text-sm text-muted-foreground">Pripravené</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{meetings.filter(m => m.status === "processing").length}</p>
                  <p className="text-sm text-muted-foreground">Spracováva sa</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {meetings.reduce((acc, m) => acc + m.actionsCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Úlohy celkom</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <Card 
              key={meeting.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setSelectedMeeting(meeting);
                setViewMode("detail");
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(meeting.status)}
                    <CardTitle className="text-base">{meeting.title}</CardTitle>
                  </div>
                  {meeting.hasRecording && (
                    <Video className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <CardDescription>
                  {meeting.date.toLocaleDateString("sk-SK", { 
                    weekday: "short", 
                    month: "short", 
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })} • {meeting.duration} min
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Status and Confidence */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {getStatusLabel(meeting.status)}
                  </Badge>
                  {getConfidenceBadge(meeting.confidence)}
                </div>

                {/* Processing State */}
                {meeting.status === "processing" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Spracovávame nahrávku...
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                )}

                {/* Ready State - Preview */}
                {meeting.status === "ready" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      {meeting.summary.slice(0, 3).map((point, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                          <span className="text-primary">•</span>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    AI {meeting.summary.length}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Q{meeting.questionsCount}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    A{meeting.actionsCount}
                  </Badge>
                  {meeting.leaderboardTop.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      🏆 {meeting.leaderboardTop.length}
                    </Badge>
                  )}
                </div>

                {/* Participants */}
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {meeting.participants.length} účastníkov
                  </span>
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMeeting(meeting);
                    setViewMode("detail");
                  }}
                >
                  {meeting.status === "processing" ? "Sledovať progress" : "Otvoriť minutes"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {meetings.length === 0 && (
          <Card className="p-8">
            <CardContent className="p-0 text-center space-y-4">
              <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mx-auto">
                <Video className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium mb-2">Žiadne meetingy</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Minutes budú dostupné po skončení meetingov
                </p>
                <Button variant="outline" size="sm">
                  Nahrať nahrávku
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};