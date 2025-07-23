import { 
  Bot, 
  Clock, 
  Tag, 
  MessageCircle, 
  MoreHorizontal, 
  Send, 
  FileEdit, 
  Inbox, 
  Archive,
  Sparkles,
  Calendar,
  Mail,
  Trash2
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface AinboxSidebarProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
}

export const AinboxSidebar = ({ selectedSection, onSectionChange }: AinboxSidebarProps) => {
  const aiTools = [
    { id: "summarizer", label: "Summarizer", icon: Sparkles, count: 3 },
    { id: "calendar-deadliner", label: "Kalendár & Deadliny", icon: Calendar, count: 13 },
    { id: "ai-tagging", label: "AI Tagging", icon: Tag },
    { id: "ai-assistant", label: "AI Asistent", icon: Bot },
  ];

  const workflowItems = [
    { id: "send-later", label: "Send Later", icon: Send, count: 2 },
    { id: "drafts", label: "Rozpísané", icon: FileEdit, count: 4 },
  ];

  const mainItems = [
    { id: "inbox", label: "Inbox", icon: Inbox, count: 12 },
    { id: "all-emails", label: "Všetky emaily", icon: Mail, count: 47 },
    { id: "archive", label: "Archív", icon: Archive },
    { id: "trash", label: "Kôš", icon: Trash2, count: 3 },
  ];

  const renderMenuItem = (item: any, isActive: boolean) => (
    <Button
      key={item.id}
      variant={isActive ? "secondary" : "ghost"}
      className={`w-full justify-start h-auto py-3 px-4 ${
        isActive ? "bg-ai-primary-light text-ai-primary" : "hover:bg-secondary"
      }`}
      onClick={() => onSectionChange(item.id)}
    >
      <item.icon className="mr-3 h-4 w-4" />
      <span className="flex-1 text-left">{item.label}</span>
      {item.count && (
        <Badge 
          variant={isActive ? "default" : "secondary"} 
          className="ml-2 h-5 min-w-5 text-xs"
        >
          {item.count}
        </Badge>
      )}
    </Button>
  );

  return (
    <div className="w-80 bg-ai-sidebar border-r border-ai-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-ai-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-ai-primary text-primary-foreground text-sm font-medium">
              MK
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">Martin Kováč</h3>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-ai-success rounded-full"></div>
              <span className="text-xs text-muted-foreground">AI pripravený</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tools Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            AI Nástroje
          </h4>
          <div className="space-y-1">
            {aiTools.map((item) => renderMenuItem(item, selectedSection === item.id))}
          </div>
        </div>

        {/* Workflow Section */}
        <div className="p-4 border-t border-ai-border">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Workflow
          </h4>
          <div className="space-y-1">
            {workflowItems.map((item) => renderMenuItem(item, selectedSection === item.id))}
          </div>
        </div>
      </div>

      {/* Bottom Main Items */}
      <div className="p-4 border-t border-ai-border bg-card">
        <div className="space-y-1">
          {mainItems.map((item) => renderMenuItem(item, selectedSection === item.id))}
        </div>
      </div>
    </div>
  );
};