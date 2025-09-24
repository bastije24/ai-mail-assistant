import { useState } from "react";
import { ArrowLeft, Video, Share, ExternalLink, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
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
  const [showRecording, setShowRecording] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowRecording(true)}
              >
                <Video className="h-4 w-4 mr-2" />
                Otvoriť nahrávku
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTranscript(true)}
            >
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
        
        {/* Recording Dialog */}
        <Dialog open={showRecording} onOpenChange={setShowRecording}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Nahrávka meetingu: {meeting.title}
              </DialogTitle>
            </DialogHeader>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="h-64 bg-black rounded-lg flex items-center justify-center mb-4">
                  <div className="text-white text-center">
                    <Play className="h-16 w-16 mx-auto mb-4 opacity-70" />
                    <p className="text-lg">Video nahrávka</p>
                    <p className="text-sm opacity-70">Kliknite pre prehranie</p>
                  </div>
                </div>
                <div className="flex justify-center gap-2">
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Prehrať
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Stiahnuť
                  </Button>
                </div>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>

        {/* Transcript Dialog */}
        <Dialog open={showTranscript} onOpenChange={setShowTranscript}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Transkript meetingu: {meeting.title}
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
              {/* Mock transcript data */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">09:01</span>
                  <div>
                    <span className="font-medium">Martin K.:</span>
                    <span className="ml-2">Dobrý deň všetkým, začneme náš týždenný standup. Ako sa máte dnes?</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">09:02</span>
                  <div>
                    <span className="font-medium">Anna S.:</span>
                    <span className="ml-2">Ahoj Martin, mám sa dobre. Dokončila som včera implementáciu API endpointov.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">09:03</span>
                  <div>
                    <span className="font-medium">Peter N.:</span>
                    <span className="ml-2">Skvelé Anna! Ja som pracoval na testoch, ale narazil som na jeden problém s databázou.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">09:04</span>
                  <div>
                    <span className="font-medium">Martin K.:</span>
                    <span className="ml-2">Aký druh problému? Môžeme ti pomôcť.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">09:05</span>
                  <div>
                    <span className="font-medium">Peter N.:</span>
                    <span className="ml-2">Migrácie sa nepodarilo spustiť na staging prostredí. Hádam je to problém s permisiami.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export TXT
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};