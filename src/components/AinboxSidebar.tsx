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
  Trash2,
  Settings,
  User,
  Bell,
  Shield,
  LogOut,
  ChevronDown,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent } from "./ui/dialog";

interface AinboxSidebarProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
}

export const AinboxSidebar = ({ selectedSection, onSectionChange }: AinboxSidebarProps) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const aiTools = [
    { id: "summarizer", label: "Summarizer", icon: Sparkles, count: 3 },
    { id: "calendar-deadliner", label: "Kalendár & Deadliny", icon: Calendar, count: 13 },
    { id: "ai-tagging", label: "AI Tagging", icon: Tag },
    { id: "ai-assistant", label: "AI Asistent", icon: Bot },
  ];

  const workflowItems = [
    { id: "all-emails", label: "Všetky emaily", icon: Mail, count: 47 },
    { id: "send-later", label: "Send Later", icon: Send, count: 2 },
    { id: "drafts", label: "Rozpísané", icon: FileEdit, count: 4 },
    { id: "archive", label: "Archív", icon: Archive },
  ];

  const mainItems = [
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
    <>
      <div className="w-80 bg-ai-sidebar border-r border-ai-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-ai-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start p-0 h-auto hover:bg-muted"
            onClick={() => setShowProfileModal(true)}
          >
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-ai-primary text-primary-foreground text-sm font-medium">
                  MK
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-foreground">Martin Kováč</h3>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-ai-success rounded-full"></div>
                  <span className="text-xs text-muted-foreground">AI pripravený</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </Button>
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

      {/* Profile Settings Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-none w-screen h-screen m-0 p-0 rounded-none">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-semibold">Nastavenia účtu</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowProfileModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Settings Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Profile Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profil používateľa
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card rounded-lg border">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Meno</label>
                        <p className="text-lg">Martin Kováč</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-lg">martin.kovac@email.com</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback className="bg-ai-primary text-primary-foreground text-2xl font-medium">
                          MK
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>

                {/* General Settings */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Všeobecné nastavenia
                  </h3>
                  <div className="p-6 bg-card rounded-lg border space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Tmavý režim</span>
                      <Button variant="outline" size="sm">Zapnúť</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Jazyk</span>
                      <Button variant="outline" size="sm">Slovenčina</Button>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifikácie
                  </h3>
                  <div className="p-6 bg-card rounded-lg border space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Email notifikácie</span>
                      <Button variant="outline" size="sm">Zapnuté</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Urgentné emaily</span>
                      <Button variant="outline" size="sm">Zapnuté</Button>
                    </div>
                  </div>
                </div>

                {/* Privacy & Security */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Súkromie & bezpečnosť
                  </h3>
                  <div className="p-6 bg-card rounded-lg border space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Dvojfaktorové overenie</span>
                      <Button variant="outline" size="sm">Nastaviť</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Zmeniť heslo</span>
                      <Button variant="outline" size="sm">Zmeniť</Button>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="pt-4 border-t">
                  <Button variant="destructive" className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Odhlásiť sa z účtu
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};