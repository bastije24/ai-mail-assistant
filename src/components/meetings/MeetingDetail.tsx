import { ArrowLeft, Video, Share, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MinutesTab } from "./tabs/MinutesTab";
import { ActionItemsTab } from "./tabs/ActionItemsTab";
import { LeaderboardTab } from "./tabs/LeaderboardTab";

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

interface MeetingDetailProps {
  meeting: Meeting;
  onBack: () => void;
}

export const MeetingDetail = ({ meeting, onBack }: MeetingDetailProps) => {
  const getStatusBadge = (status: Meeting["status"]) => {
    const variants = {
      processing: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      ready: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      attention: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    };
    
    const labels = {
      processing: "⏳ Spracováva sa",
      ready: "✅ Pripravené", 
      attention: "⚠️ Potrebuje pozornosť"
    };

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getConfidenceBadge = (confidence: Meeting["confidence"]) => {
    const colors = {
      high: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      low: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    };
    
    return (
      <Badge className={colors[confidence]}>
        {confidence === "high" ? "Vysoká" : confidence === "medium" ? "Stredná" : "Nízka"} dôvera
      </Badge>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{meeting.title}</h1>
            <p className="text-muted-foreground">
              {meeting.date.toLocaleDateString("sk-SK", { 
                weekday: "long", 
                year: "numeric",
                month: "long", 
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })} • {meeting.duration} minút • {meeting.participants.length} účastníkov
            </p>
          </div>
        </div>

        {/* Status Panel */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-3 flex-1">
            {getStatusBadge(meeting.status)}
            {getConfidenceBadge(meeting.confidence)}
          </div>
          
          <div className="flex items-center gap-2">
            {meeting.hasRecording && (
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Otvoriť nahrávku
              </Button>
            )}
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Transkript
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Zdieľať
            </Button>
          </div>
        </div>

        {/* Warning Banner */}
        {meeting.status === "attention" && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-medium text-yellow-800 dark:text-yellow-300">
                ⚠️ Chýbajú účastníci - niektorí ľudia sa neidentifikovali
              </span>
            </div>
          </div>
        )}

        {/* Content Tabs */}
        <Tabs defaultValue="minutes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="minutes">Minutes</TabsTrigger>
            <TabsTrigger value="actions">Action Items</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="minutes">
            <MinutesTab meeting={meeting} />
          </TabsContent>
          
          <TabsContent value="actions">
            <ActionItemsTab meeting={meeting} />
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <LeaderboardTab meeting={meeting} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};