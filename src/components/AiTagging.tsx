import { useState } from "react";
import { Tag, Zap, Users, Briefcase, Heart, AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { CreateAiTagDialog } from "@/features/email/components/CreateAiTagDialog";

interface Email {
  id: string;
  from: string;
  subject: string;
  content: string;
  timestamp: Date;
}

interface AiTaggingProps {
  emails: Email[];
}

export const AiTagging = ({ emails }: AiTaggingProps) => {
  const [customTags, setCustomTags] = useState<any[]>([]);
  
  const handleTagCreate = (newTag: { name: string; description: string; icon: string; keywords: string[] }) => {
    const tagWithStats = {
      ...newTag,
      icon: Tag, // Default icon for custom tags
      color: "bg-gray-100 text-gray-800 border-gray-200",
      count: 0,
      accuracy: 85,
      emails: []
    };
    setCustomTags(prev => [...prev, tagWithStats]);
  };

  const tagCategories = [
    {
      name: "Urgentné",
      icon: AlertCircle,
      color: "bg-red-100 text-red-800 border-red-200",
      count: 8,
      description: "Emaily vyžadujúce okamžitú pozornosť",
      accuracy: 95,
      emails: ["Deadline projekt X", "Urgentná schôdzka", "Klient čaká na odpoveď"]
    },
    {
      name: "Projekty", 
      icon: Briefcase,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      count: 23,
      description: "Komunikácia týkajúca sa projektov",
      accuracy: 92,
      emails: ["Projekt Alpha update", "Nové požiadavky", "Status report"]
    },
    {
      name: "Stretnutia",
      icon: Users, 
      color: "bg-green-100 text-green-800 border-green-200",
      count: 12,
      description: "Pozvánky a organizácia stretnutí",
      accuracy: 98,
      emails: ["Team meeting", "Client presentation", "Weekly standup"]
    },
    {
      name: "Obchodné",
      icon: Zap,
      color: "bg-purple-100 text-purple-800 border-purple-200", 
      count: 16,
      description: "Obchodné príležitosti a deals",
      accuracy: 89,
      emails: ["New lead inquiry", "Contract proposal", "Sales follow-up"]
    },
    {
      name: "Osobné",
      icon: Heart,
      color: "bg-pink-100 text-pink-800 border-pink-200",
      count: 5,
      description: "Osobná komunikácia a networked",
      accuracy: 87,
      emails: ["Birthday invitation", "Coffee chat", "Personal update"]
    }
  ];

  const recentlyTagged = [
    {
      id: "1",
      subject: "Urgentný deadline - projekt treba ukončiť",
      from: "Jan Novák",
      tags: ["Urgentné", "Projekty"],
      confidence: 96,
      timestamp: "pred 5 min"
    },
    {
      id: "2", 
      subject: "Stretnutie budúci týždeň",
      from: "Mária Svobodová",
      tags: ["Stretnutia"],
      confidence: 98,
      timestamp: "pred 12 min"
    },
    {
      id: "3",
      subject: "New business opportunity",
      from: "Robert Smith", 
      tags: ["Obchodné"],
      confidence: 91,
      timestamp: "pred 25 min"
    }
  ];

  const getTagColor = (tagName: string) => {
    const allCategories = [...tagCategories, ...customTags];
    const category = allCategories.find(cat => cat.name === tagName);
    return category ? category.color : "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-indigo-500 rounded-lg flex items-center justify-center">
          <Tag className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">AI Tagging</h1>
          <p className="text-sm text-muted-foreground">Automatické kategorizovanie emailov</p>
        </div>
      </div>

      {/* Tag Categories Overview */}
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Kategórie tagov</h2>
          <CreateAiTagDialog onTagCreate={handleTagCreate}>
            <Button size="sm" className="bg-ai-primary hover:bg-ai-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Nový AI tag
            </Button>
          </CreateAiTagDialog>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...tagCategories, ...customTags].map((category) => (
            <Card key={category.name} className="hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-auto">
                    {category.count}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{category.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">AI presnosť</span>
                    <span className="font-medium">{category.accuracy}%</span>
                  </div>
                  <Progress value={category.accuracy} className="h-2" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Posledné tagy:</span>
                  {category.emails.slice(0, 2).map((email, index) => (
                    <p key={index} className="text-xs text-muted-foreground truncate">
                      • {email}
                    </p>
                  ))}
                </div>

                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-3"
                  onClick={() => {
                    // Simulujeme zobrazenie všetkých emailov v kategórii
                    console.log(`Zobrazujem všetky emaily v kategórii: ${category.name}`);
                    // Trigger an action to show all emails for this category
                    window.dispatchEvent(new CustomEvent('showEmailsForCategory', {
                      detail: { category: category.name, emails: category.emails }
                    }));
                  }}
                >
                  Zobraz všetky
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recently Tagged */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">Nedávno označené</h2>
        <div className="space-y-3">
          {recentlyTagged.map((email) => (
            <Card key={email.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1 line-clamp-1">
                      {email.subject}
                    </h3>
                    <p className="text-sm text-muted-foreground">Od: {email.from}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="outline" className="text-xs">
                      {email.confidence}% presnosť
                    </Badge>
                    <span className="text-xs text-muted-foreground">{email.timestamp}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  {email.tags.map((tag) => (
                    <Badge key={tag} className={getTagColor(tag)}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Settings */}
      <Card className="bg-ai-primary-light border-ai-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-6 w-6 bg-ai-primary rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">AI</span>
            </div>
            Nastavenia AI Tagging
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Automatické označovanie</span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => console.log("Prepnutie automatického označovania")}
            >
              Zapnuté
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Minimálna presnosť</span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => console.log("Nastavenie minimálnej presnosti")}
            >
              85%
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Vlastné tagy</span>
            <Button 
              size="sm" 
              className="bg-ai-primary hover:bg-ai-primary/90"
              onClick={() => console.log("Správa vlastných tagov")}
            >
              Spravovať
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};