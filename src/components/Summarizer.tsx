import { Sparkles, FileText, Clock, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface Email {
  id: string;
  from: string;
  subject: string;
  content: string;
  timestamp: Date;
}

interface SummarizerProps {
  emails: Email[];
}

export const Summarizer = ({ emails }: SummarizerProps) => {
  const summaries = [
    {
      id: "1",
      type: "Denný súhrn",
      count: 12,
      priority: "Vysoká",
      keyPoints: [
        "3 urgentné deadlines do piatka",
        "5 nových projektových požiadaviek", 
        "2 stretnutia potrebujú potvrdenie"
      ],
      progress: 75
    },
    {
      id: "2", 
      type: "Týždenný prehľad",
      count: 47,
      priority: "Stredná",
      keyPoints: [
        "15 dokončených úloh",
        "8 čakajúcich na odpoveď",
        "12 nových kontaktov"
      ],
      progress: 60
    },
    {
      id: "3",
      type: "Projektové updates",
      count: 8,
      priority: "Nízka", 
      keyPoints: [
        "3 projekty v procese",
        "2 projekty dokončené",
        "1 nový projekt navrhnutý"
      ],
      progress: 90
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Vysoká": return "bg-red-100 text-red-800";
      case "Stredná": return "bg-yellow-100 text-yellow-800"; 
      case "Nízka": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-ai-primary rounded-lg flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">AI Summarizer</h1>
          <p className="text-sm text-muted-foreground">Inteligentné súhrny tvojich emailov</p>
        </div>
      </div>

      <div className="grid gap-4">
        {summaries.map((summary) => (
          <Card key={summary.id} className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-ai-primary" />
                  {summary.type}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(summary.priority)}>
                    {summary.priority}
                  </Badge>
                  <Badge variant="secondary">
                    {summary.count} emailov
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spracované</span>
                  <span className="font-medium">{summary.progress}%</span>
                </div>
                <Progress value={summary.progress} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Kľúčové body:</h4>
                <ul className="space-y-1">
                  {summary.keyPoints.map((point, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 bg-ai-primary rounded-full mt-2 flex-shrink-0"></span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-ai-primary hover:bg-ai-primary/90">
                  <TrendingUp className="mr-2 h-3 w-3" />
                  Zobraz detaily
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="mr-2 h-3 w-3" />
                  Plánovať
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-ai-primary-light border-ai-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 bg-ai-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-white font-medium">AI</span>
            </div>
            <div className="text-sm">
              <p className="text-ai-primary font-medium mb-1">AI Tip:</p>
              <p className="text-muted-foreground">
                Na základe tvojich emailov odporúčam sústrediť sa na urgentné deadlines. 
                Môžem ti pripraviť detailný akčný plán.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};