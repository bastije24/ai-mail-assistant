import { useState } from "react";
import { AinboxSidebar } from "@/components/AinboxSidebar";
import { EmailDetail, useEmailData, AllEmails, EmailsList, Drafts, Trash, Archive } from "@/features/email";
import { AiAssistantPanel } from "@/components/AiAssistantPanel";
import { Summarizer } from "@/components/Summarizer";
import { CalendarDeadliner } from "@/components/CalendarDeadliner";
import { AiTagging } from "@/components/AiTagging";
import { SendLater } from "@/components/SendLater";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";

export const AinboxManager = () => {
  const { emails, selectedEmail, setSelectedEmail } = useEmailData();
  const [selectedSection, setSelectedSection] = useState("inbox");
  const [fullscreenEmail, setFullscreenEmail] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const renderMainContent = () => {
    switch (selectedSection) {
      case "summarizer": return <Summarizer emails={emails} />;
      case "calendar-deadliner": return <CalendarDeadliner emails={emails} />;
      case "ai-tagging": return <AiTagging emails={emails} />;
      case "ai-assistant": return <AiAssistantPanel email={selectedEmail} />;
      case "send-later": return <SendLater emails={emails} />;
      case "drafts": return <Drafts emails={emails} />;
      case "all-emails": return <EmailsList emails={emails} />;
      case "archive": return <Archive emails={emails} />;
      case "trash": return <Trash emails={emails} />;
      case "settings": return (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-8 min-h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Nastavenia účtu</h1>
                <p className="text-sm text-muted-foreground">Spravujte svoj profil a predvoľby aplikácie</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-card rounded-lg border">
                <h3 className="text-lg font-medium mb-4">🌙 Nastavenia témy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <span className="font-medium">Tmavý režim</span>
                      <p className="text-sm text-muted-foreground">
                        {theme === "dark" ? "Zapnutý - používa tmavé farby" : 
                         theme === "light" ? "Vypnutý - používa svetlé farby" : 
                         "Automatický - sleduje systémové nastavenie"}
                      </p>
                    </div>
                    <Switch 
                      checked={theme === "dark"} 
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <span className="font-medium">Sledovať systém</span>
                      <p className="text-sm text-muted-foreground">Automaticky prepína podľa systémového nastavenia</p>
                    </div>
                    <Switch 
                      checked={theme === "system"} 
                      onCheckedChange={(checked) => setTheme(checked ? "system" : "light")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      case "inbox": 
      default: return <EmailDetail email={selectedEmail} />;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <AinboxSidebar 
        selectedSection={selectedSection}
        onSectionChange={(section) => {
          setSelectedSection(section);
          setSidebarOpen(false); // Close sidebar on mobile after selection
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 min-w-0 overflow-hidden">
        {renderMainContent()}
      </div>
    </div>
  );
};