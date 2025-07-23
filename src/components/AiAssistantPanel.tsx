import { useState } from "react";
import { Send, User, Bot } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ComposeEmailReply } from "./ComposeEmailReply";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

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
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Ahoj! Analyzujem email od ${email.from} s predmetom "${email.subject}". Čo potrebuješ vedieť alebo ako môžem pomôcť?`,
      sender: "ai",
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    // Generate AI response
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: `AI odpoveď na: "${currentMessage}" - Na základe analýzy emailu môžem povedať...`,
      sender: "ai",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage, aiResponse]);
    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sk-SK', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex-1 bg-background flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-ai-primary rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AI Asistent</h2>
            <p className="text-sm text-muted-foreground">Chat o emaile: {email.subject}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className={message.sender === "user" ? "bg-blue-500 text-white" : "bg-ai-primary text-white"}>
                {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            
            <div className={`max-w-[70%] ${message.sender === "user" ? "text-right" : "text-left"}`}>
              <Card className={`${
                message.sender === "user" 
                  ? "bg-ai-primary text-white ml-auto" 
                  : "bg-muted"
              }`}>
                <CardContent className="p-3">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === "user" 
                      ? "text-blue-100" 
                      : "text-muted-foreground"
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Napíšte správu AI asistentovi..."
              className="resize-none"
            />
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!currentMessage.trim()}
            className="bg-ai-primary hover:bg-ai-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Stlačte Enter pre odoslanie správy
        </p>
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