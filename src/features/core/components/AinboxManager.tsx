import { useState } from "react";
import { AinboxSidebar } from "@/components/AinboxSidebar";
import { EmailDetail } from "@/features/email";
import { useEmailData } from "@/features/email";
import { AiAssistantPanel } from "@/components/AiAssistantPanel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";

export const AinboxManager = () => {
  const { emails, selectedEmail, setSelectedEmail } = useEmailData();
  const [selectedSection, setSelectedSection] = useState("inbox");
  const [fullscreenEmail, setFullscreenEmail] = useState<any>(null);
  const { theme, setTheme } = useTheme();

  const renderMainContent = () => {
    switch (selectedSection) {
      case "inbox": 
      default: return <EmailDetail email={selectedEmail} />;
    }
  };

  return (
    <div className="h-screen flex bg-background">
      <AinboxSidebar 
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
      />
      
      {renderMainContent()}
      
      {selectedSection === "inbox" && (
        <AiAssistantPanel email={selectedEmail} />
      )}
    </div>
  );
};