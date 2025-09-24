import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, CheckCircle, HelpCircle } from "lucide-react";

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

interface MinutesTabProps {
  meeting: Meeting;
}

export const MinutesTab = ({ meeting }: MinutesTabProps) => {
  // Mock data for detailed minutes
  const minutesData = {
    summary: [
      "Týždenný standup sa začal o 9:00 s prítomnosťou všetkých členov tímu",
      "Dokončili sme 5 z 7 plánovaných úloh z minulého šprintu",
      "Identifikovali sme 2 blokátory v projekte X ktoré potrebujeme riešiť",
      "Naplánovali sme prioritné úlohy na nadchádzajúci týždeň",
      "Meeting končil o 9:28 s jasným akčným plánom"
    ],
    decisions: [
      {
        id: "1",
        text: "Projekt X bude mať prioritu nad projektom Y do konca týždňa",
        owner: "Martin K.",
        timestamp: new Date(2024, 9, 24, 9, 15)
      },
      {
        id: "2", 
        text: "Implementácia novej autentifikácie sa posunie na Q1 2025",
        owner: "Anna S.",
        timestamp: new Date(2024, 9, 24, 9, 20)
      },
      {
        id: "3",
        text: "Týmové code review bude každý piatok o 15:00",
        owner: "Peter N.",
        timestamp: new Date(2024, 9, 24, 9, 25)
      }
    ],
    questions: [
      {
        id: "1",
        text: "Kedy budeme mať hotový dizajn systém pre nový projekt?",
        asker: "Anna S.",
        timestamp: new Date(2024, 9, 24, 9, 10),
        answered: true
      },
      {
        id: "2",
        text: "Môžeme použiť existujúce API pre integráciu s tretími stranami?", 
        asker: "Peter N.",
        timestamp: new Date(2024, 9, 24, 9, 18),
        answered: false
      },
      {
        id: "3",
        text: "Aký je plán pre deployment nových funkcií?",
        asker: "Martin K.", 
        timestamp: new Date(2024, 9, 24, 9, 22),
        answered: true
      }
    ]
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (meeting.status === "processing") {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400 animate-spin" />
            </div>
            <h3 className="font-medium mb-2">Spracovávame nahrávku ⏳</h3>
            <p className="text-sm text-muted-foreground">
              Minutes budú dostupné za pár minút. Pošleme vám notifikáciu keď budú hotové.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Stručné zhrnutie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {minutesData.summary.map((point, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-primary font-bold text-sm mt-1">•</span>
              <p className="text-sm leading-relaxed">{point}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Decisions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Rozhodnutia ({minutesData.decisions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {minutesData.decisions.map((decision) => (
            <div key={decision.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {getInitials(decision.owner)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{decision.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{decision.owner}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {decision.timestamp.toLocaleTimeString("sk-SK", { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-purple-600" />
            Otázky ({minutesData.questions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {minutesData.questions.map((question) => (
            <div key={question.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {getInitials(question.asker)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{question.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">{question.asker}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {question.timestamp.toLocaleTimeString("sk-SK", { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </span>
                  <Badge 
                    variant={question.answered ? "default" : "secondary"}
                    className="text-xs ml-auto"
                  >
                    {question.answered ? "Zodpovedané" : "Nezodpovedané"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};