import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
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

interface AiAssistantPanelProps {
  email: Email;
}

export const AiAssistantPanel = ({ email }: AiAssistantPanelProps) => {
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedConceptId, setSelectedConceptId] = useState<string>();
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiResponses, setAiResponses] = useState<string[]>([]);

  const handleCustomPrompt = () => {
    if (!customPrompt.trim()) return;
    
    const mockResponse = `AI odpoveď na: "${customPrompt}" - Analýza emailu ukázala...`;
    setAiResponses(prev => [...prev, mockResponse]);
    setCustomPrompt("");
  };

  return (
    <div className="w-96 bg-ai-sidebar border-l border-ai-border flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-ai-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="h-8 w-8 bg-ai-primary rounded-lg flex items-center justify-center">
            <span className="text-sm text-white font-medium">AI</span>
          </div>
          AI Asistent
        </h2>
      </div>

      {/* Custom AI Prompt */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          AI Asistent Chat
        </h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="custom-prompt" className="text-xs text-muted-foreground">
              Napíšte svoj vlastný príkaz pre AI
            </Label>
            <Textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Napríklad: Analyzuj tone tohto emailu, Vytvor formálnu odpoveď, Sumarizuj kľúčové body..."
              rows={3}
              className="text-sm resize-none"
            />
          </div>
          <Button 
            onClick={handleCustomPrompt}
            disabled={!customPrompt.trim()}
            size="sm" 
            className="w-full bg-ai-primary hover:bg-ai-primary/90"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Spracovať AI prompt
          </Button>
        </div>

        {/* AI Responses */}
        {aiResponses.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">AI Odpovede:</h4>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {aiResponses.map((response, index) => (
                <Card key={index} className="bg-ai-primary-light border-ai-primary/20">
                  <CardContent className="p-3">
                    <p className="text-xs text-foreground leading-relaxed">{response}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
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