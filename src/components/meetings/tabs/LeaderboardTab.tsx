import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  MessageCircle, 
  Clock, 
  HelpCircle,
  TrendingUp,
  Users,
  Award
} from "lucide-react";

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

interface LeaderboardTabProps {
  meeting: Meeting;
}

interface Participant {
  id: string;
  name: string;
  engagementScore: number;
  spokenTime: number; // in minutes
  utterances: number;
  questions: number;
  rank: number;
  change: "up" | "down" | "same";
}

export const LeaderboardTab = ({ meeting }: LeaderboardTabProps) => {
  // Mock leaderboard data
  const participants: Participant[] = [
    {
      id: "1",
      name: "Martin K.",
      engagementScore: 92,
      spokenTime: 8.5,
      utterances: 24,
      questions: 3,
      rank: 1,
      change: "up"
    },
    {
      id: "2",
      name: "Anna S.", 
      engagementScore: 87,
      spokenTime: 6.2,
      utterances: 18,
      questions: 2,
      rank: 2,
      change: "same"
    },
    {
      id: "3",
      name: "Peter N.",
      engagementScore: 76,
      spokenTime: 4.1,
      utterances: 12,
      questions: 1,
      rank: 3,
      change: "down"
    },
    {
      id: "4",
      name: "Lucia M.",
      engagementScore: 68,
      spokenTime: 3.8,
      utterances: 8,
      questions: 0,
      rank: 4,
      change: "up"
    },
    {
      id: "5",
      name: "Tomáš V.",
      engagementScore: 45,
      spokenTime: 2.3,
      utterances: 6,
      questions: 1,
      rank: 5,
      change: "down"
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Award className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="h-5 w-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: Participant["change"]) => {
    if (change === "up") return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (change === "down") return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
    return <span className="h-3 w-3" />;
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600"; 
    return "text-red-600";
  };

  const totalSpokenTime = participants.reduce((acc, p) => acc + p.spokenTime, 0);
  const totalUtterances = participants.reduce((acc, p) => acc + p.utterances, 0);
  const totalQuestions = participants.reduce((acc, p) => acc + p.questions, 0);

  if (meeting.status === "processing") {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-orange-600 dark:text-orange-400 animate-pulse" />
            </div>
            <h3 className="font-medium mb-2">Analyzujeme účasť ⏳</h3>
            <p className="text-sm text-muted-foreground">
              Leaderboard bude dostupný po dokončení spracovania.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-bold">{participants.length}</p>
                <p className="text-xs text-muted-foreground">Účastníkov</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-lg font-bold">{totalSpokenTime.toFixed(1)}m</p>
                <p className="text-xs text-muted-foreground">Celkový čas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-lg font-bold">{totalUtterances}</p>
                <p className="text-xs text-muted-foreground">Príspevkov</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-lg font-bold">{totalQuestions}</p>
                <p className="text-xs text-muted-foreground">Otázok</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Podium */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            TOP 3 Najaktívnejší
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-end gap-4 mb-6">
            {/* 2nd place */}
            {participants[1] && (
              <div className="text-center">
                <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-end justify-center mb-2">
                  <div className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">#2</div>
                </div>
                <Avatar className="h-12 w-12 mx-auto mb-2">
                  <AvatarFallback>{getInitials(participants[1].name)}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">{participants[1].name}</p>
                <p className="text-xs text-muted-foreground">{participants[1].engagementScore} bodov</p>
              </div>
            )}
            
            {/* 1st place */}
            {participants[0] && (
              <div className="text-center">
                <div className="h-20 w-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-end justify-center mb-2">
                  <div className="text-xs font-bold text-yellow-600 mb-1">#1</div>
                </div>
                <Avatar className="h-14 w-14 mx-auto mb-2 ring-2 ring-yellow-400">
                  <AvatarFallback>{getInitials(participants[0].name)}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">{participants[0].name}</p>
                <p className="text-xs text-muted-foreground">{participants[0].engagementScore} bodov</p>
              </div>
            )}
            
            {/* 3rd place */}
            {participants[2] && (
              <div className="text-center">
                <div className="h-12 w-16 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-end justify-center mb-2">
                  <div className="text-xs font-bold text-amber-600 mb-1">#3</div>
                </div>
                <Avatar className="h-12 w-12 mx-auto mb-2">
                  <AvatarFallback>{getInitials(participants[2].name)}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">{participants[2].name}</p>
                <p className="text-xs text-muted-foreground">{participants[2].engagementScore} bodov</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Detailný leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                {getRankIcon(participant.rank)}
                {getChangeIcon(participant.change)}
              </div>
              
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{participant.name}</h4>
                  <Badge className={`${getEngagementColor(participant.engagementScore)} bg-transparent border-current`}>
                    {participant.engagementScore} bodov
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{participant.spokenTime.toFixed(1)}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{participant.utterances} príspevkov</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HelpCircle className="h-3 w-3" />
                    <span>{participant.questions} otázok</span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <Progress value={participant.engagementScore} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Engagement Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm">
              <strong>💡 Najaktívnejší:</strong> {participants[0].name} dominoval v diskusii s {participants[0].engagementScore} bodmi engagement skóre.
            </p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm">
              <strong>🎯 Rovnováha:</strong> Všetci účastníci prispeli k diskusii, priemerná účasť {Math.round(participants.reduce((acc, p) => acc + p.engagementScore, 0) / participants.length)} bodov.
            </p>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm">
              <strong>🤔 Pozorovanie:</strong> {participants.filter(p => p.questions === 0).length} účastník{participants.filter(p => p.questions === 0).length !== 1 ? 'ov' : ''} nepokládal{participants.filter(p => p.questions === 0).length !== 1 ? 'i' : ''} otázky.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};