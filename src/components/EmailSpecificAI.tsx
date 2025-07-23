import { useState } from "react";
import { 
  Zap, 
  FileText, 
  Heart, 
  Briefcase, 
  Reply, 
  Clock, 
  BarChart3, 
  Users,
  AlertCircle,
  Calendar
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ComposeEmailReply } from "./ComposeEmailReply";

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  to: string[];
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isUrgent: boolean;
  status: string;
}

interface EmailSpecificAIProps {
  email: Email;
}

export const EmailSpecificAI = ({ email }: EmailSpecificAIProps) => {
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedConceptId, setSelectedConceptId] = useState<string>();

  const aiConcepts = [
    {
      id: "A",
      type: "Rýchla odpoveď",
      icon: Zap,
      preview: "Potvrdenie deadline, krátke info o stave",
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: "B", 
      type: "Odpoveď s detailmi",
      icon: FileText,
      preview: "Detailný rozpis úloh, timeline a očakávania",
      color: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      id: "C",
      type: "Empatická odpoveď", 
      icon: Heart,
      preview: "Pochopenie urgentnosti, návrh riešenia",
      color: "bg-green-50 text-green-700 border-green-200"
    },
    {
      id: "D",
      type: "Formálna odpoveď",
      icon: Briefcase,
      preview: "Oficiálne potvrdenie s business termínmi",
      color: "bg-gray-50 text-gray-700 border-gray-200"
    }
  ];

  const quickActions = [
    { label: "Rýchla odpoveď", icon: Reply, variant: "default" as const },
    { label: "Odložiť", icon: Clock, variant: "outline" as const },
    { label: "Sumarizovať", icon: BarChart3, variant: "outline" as const },
    { label: "Delegovať", icon: Users, variant: "outline" as const },
  ];

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="h-8 w-8 bg-ai-primary rounded-lg flex items-center justify-center">
            <span className="text-sm text-white font-medium">AI</span>
          </div>
          AI Email Asistent
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Špecifické nástroje pre tento email
        </p>
      </div>

      {/* AI Recommendations */}
      <div className="p-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              AI Odporúčania
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                {email.isUrgent ? (
                  <>Email označený ako <strong>urgentný</strong></>
                ) : (
                  <>Email vyžaduje odpoveď do <strong>48 hodín</strong></>
                )}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                {email.isUrgent ? 
                  "Navrhujeme okamžitú odpoveď kvôli urgentnosti" :
                  "Odporučujeme profesionálnu odpoveď"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Concepts */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          AI Koncepty odpovede
        </h3>
        <div className="space-y-3">
          {aiConcepts.map((concept) => (
            <Card 
              key={concept.id} 
              className={`cursor-pointer hover:shadow-sm transition-shadow border ${concept.color}`}
              onClick={() => {
                setSelectedConceptId(concept.id);
                setReplyDialogOpen(true);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Badge variant="secondary" className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold">
                      {concept.id}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <concept.icon className="h-3 w-3" />
                      <h4 className="text-sm font-medium truncate">{concept.type}</h4>
                    </div>
                    <p className="text-xs opacity-75 leading-relaxed">{concept.preview}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-border">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Rýchle akcie
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button 
              key={index}
              variant={action.variant}
              size="sm"
              className="h-auto py-3 flex flex-col items-center gap-2 text-xs"
              onClick={() => {
                console.log(`Vykonávam akciu: ${action.label}`);
              }}
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="p-4 mt-auto">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Priorita:</span>
                <Badge variant={email.isUrgent ? "destructive" : "secondary"} className="text-xs">
                  {email.isUrgent ? "Vysoká" : "Stredná"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Odpovedať do:</span>
                <span className="text-foreground font-medium">
                  {email.isUrgent ? "1 hodina" : "2 dni"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Štýl komunikácie:</span>
                <span className="text-foreground">
                  {email.fromEmail.includes("@company") ? "Interný" : "Profesionálny"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ComposeEmailReply 
        email={email}
        open={replyDialogOpen}
        onOpenChange={setReplyDialogOpen}
        selectedConceptId={selectedConceptId}
      />
    </div>
  );
};