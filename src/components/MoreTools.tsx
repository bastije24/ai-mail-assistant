import { MoreHorizontal, Zap, Settings, Download, Upload, Filter, Search, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface Email {
  id: string;
  from: string;
  subject: string;
  content: string;
  timestamp: Date;
}

interface MoreToolsProps {
  emails: Email[];
}

export const MoreTools = ({ emails }: MoreToolsProps) => {
  const advancedTools = [
    {
      id: "advanced-search",
      name: "Pokročilé vyhľadávanie",
      icon: Search,
      description: "Komplexné vyhľadávanie v emailoch s AI filtrami",
      usage: "847 vyhľadávaní",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      id: "bulk-actions",
      name: "Hromadné akcie",
      icon: Zap,
      description: "Spracovanie viacerých emailov naraz",
      usage: "23 akcií dnes",
      color: "bg-yellow-50 border-yellow-200", 
      iconColor: "text-yellow-600"
    },
    {
      id: "smart-filters",
      name: "Smart filtre",
      icon: Filter,
      description: "AI filtre pre automatickú kategorizáciu",
      usage: "12 aktívnych filtrov",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600"
    },
    {
      id: "notifications",
      name: "Inteligentné notifikácie", 
      icon: Bell,
      description: "Personalizované upozornenia na dôležité emaily",
      usage: "Aktívne",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600"
    },
    {
      id: "export-import",
      name: "Export / Import",
      icon: Download,
      description: "Zálohovanie a prenos dát",
      usage: "Posledný export: včera",
      color: "bg-gray-50 border-gray-200",
      iconColor: "text-gray-600"
    },
    {
      id: "integrations",
      name: "Integrácie",
      icon: Upload,
      description: "Prepojenie s externými službami",
      usage: "3 aktívne integrácie",
      color: "bg-indigo-50 border-indigo-200",
      iconColor: "text-indigo-600"
    }
  ];

  const quickStats = [
    { label: "Celkom emailov", value: "2,847", change: "+12%" },
    { label: "AI operácie", value: "1,234", change: "+8%" },
    { label: "Ušetrený čas", value: "23.5h", change: "+15%" },
    { label: "Presnosť AI", value: "94.2%", change: "+2%" }
  ];

  const recentActivity = [
    { action: "Bulk archive", count: "45 emailov", time: "pred 2h", type: "bulk" },
    { action: "Smart filter", count: "Nový filter vytvorený", time: "pred 4h", type: "filter" },
    { action: "Export dát", count: "156 emailov", time: "včera", type: "export" },
    { action: "AI analýza", count: "Mesačný report", time: "pred 2 dňami", type: "analysis" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-slate-500 rounded-lg flex items-center justify-center">
          <MoreHorizontal className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Rozšírené nástroje</h1>
          <p className="text-sm text-muted-foreground">Pokročilé funkcie a nástroje pre správu emailov</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-ai-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
              <Badge variant="secondary" className="text-xs">
                {stat.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Tools */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">Pokročilé nástroje</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {advancedTools.map((tool) => (
            <Card key={tool.id} className={`hover:shadow-sm transition-shadow ${tool.color}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                  {tool.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{tool.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{tool.usage}</span>
                  <Button size="sm" variant="outline" className="h-7">
                    Otvoriť
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nedávna aktivita</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{activity.action}</h3>
                      <p className="text-xs text-muted-foreground">{activity.count}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                {index < recentActivity.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nastavenia systému</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto AI spracovanie</span>
              <Button size="sm" variant="outline">Zapnuté</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Zálohovanie</span>
              <Button size="sm" variant="outline">Týždenne</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">AI model</span>
              <Button size="sm" variant="outline">GPT-4</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Výkon systému</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Využitie AI</span>
                <span>78%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-ai-primary h-2 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Spracovanie emailov</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analytics */}
      <Card className="bg-ai-primary-light border-ai-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-6 w-6 bg-ai-primary rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">AI</span>
            </div>
            AI Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Detailná analýza využitia AI nástrojov a efektivity práce s emailmi.
          </p>
          <Button className="bg-ai-primary hover:bg-ai-primary/90">
            Otvoriť Analytics
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};