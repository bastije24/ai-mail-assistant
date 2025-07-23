import { useState } from "react";
import { Sparkles, TrendingUp, Mail, Clock, AlertCircle, Info, CheckCircle2, Filter, Calendar, Eye, Archive, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ComposeEmailDialog } from "./ComposeEmailDialog";
import { EmailTagManager } from "./EmailTagManager";

interface Email {
  id: string;
  from: string;
  fromEmail?: string;
  subject: string;
  content: string;
  timestamp: Date;
  priority?: string;
  category?: string;
  source?: string;
}

interface SummarizerProps {
  emails: Email[];
}

export const Summarizer = ({ emails }: SummarizerProps) => {
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("today");
  
  // Extended mock data with priority levels and dates
  const allEmails = [
    ...emails,
    // Today's emails
    {
      id: "3", from: "Urgent Client", subject: "Kritický problém - potrebná okamžitá reakcia",
      content: "Systém nefunguje, klienti sa sťažujú...", timestamp: new Date("2024-01-15T09:30:00"),
      priority: "high", category: "urgent", source: "client"
    },
    {
      id: "4", from: "Team Lead", subject: "Týždenný report - deadline zajtra",
      content: "Potrebujem finálny report do zajtra...", timestamp: new Date("2024-01-15T11:15:00"),
      priority: "high", category: "work", source: "internal"
    },
    {
      id: "5", from: "Newsletter", subject: "Nové funkcie v našej aplikácii",
      content: "Predstavujeme vám nové funkcie...", timestamp: new Date("2024-01-15T14:20:00"),
      priority: "low", category: "marketing", source: "newsletter"
    },
    {
      id: "6", from: "HR Department", subject: "Pozvánka na team building",
      content: "Pozývame vás na firemný team building...", timestamp: new Date("2024-01-15T16:45:00"),
      priority: "medium", category: "hr", source: "internal"
    },
    
    // Yesterday's emails
    {
      id: "7", from: "Support Team", subject: "Aktualizácia systému",
      content: "Plánovaná údržba dnes večer...", timestamp: new Date("2024-01-14T08:00:00"),
      priority: "medium", category: "system", source: "internal"
    },
    {
      id: "8", from: "Client Services", subject: "Nová objednávka #12345",
      content: "Prijali sme novú objednávku...", timestamp: new Date("2024-01-14T13:30:00"),
      priority: "high", category: "business", source: "client"
    },
    {
      id: "9", from: "Marketing", subject: "Štatistiky kampaní",
      content: "Mesačné výsledky reklamných kampaní...", timestamp: new Date("2024-01-14T10:15:00"),
      priority: "low", category: "marketing", source: "internal"
    },
    
    // This week's emails
    {
      id: "10", from: "Project Manager", subject: "Milestone dosiahnutý",
      content: "Úspešne sme dokončili prvú fázu...", timestamp: new Date("2024-01-13T15:20:00"),
      priority: "medium", category: "project", source: "internal"
    },
    {
      id: "11", from: "Security Alert", subject: "Bezpečnostné upozornenie",
      content: "Detekovaná podozrivá aktivita...", timestamp: new Date("2024-01-12T07:45:00"),
      priority: "high", category: "security", source: "system"
    },
    
    // This month's emails
    {
      id: "12", from: "Finance", subject: "Mesačné vyúčtovanie",
      content: "Finančná správa za december...", timestamp: new Date("2024-01-05T09:00:00"),
      priority: "medium", category: "finance", source: "internal"
    }
  ];

  const priorityLevels = [
    { id: "all", label: "Všetky priority", count: allEmails.length },
    { id: "high", label: "Vysoká", count: allEmails.filter(e => e.priority === "high").length, color: "bg-red-100 text-red-800" },
    { id: "medium", label: "Stredná", count: allEmails.filter(e => e.priority === "medium").length, color: "bg-yellow-100 text-yellow-800" },
    { id: "low", label: "Nízka", count: allEmails.filter(e => e.priority === "low").length, color: "bg-green-100 text-green-800" }
  ];

  const getEmailsByPeriod = (period: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(today);
    monthStart.setDate(monthStart.getDate() - 30);

    switch (period) {
      case "today":
        return allEmails.filter(email => email.timestamp >= today);
      case "yesterday": 
        return allEmails.filter(email => email.timestamp >= yesterday && email.timestamp < today);
      case "week":
        return allEmails.filter(email => email.timestamp >= weekStart);
      case "month":
        return allEmails.filter(email => email.timestamp >= monthStart);
      default:
        return allEmails;
    }
  };

  const getFilteredEmails = () => {
    const periodEmails = getEmailsByPeriod(selectedPeriod);
    if (selectedPriority === "all") return periodEmails;
    return periodEmails.filter(email => email.priority === selectedPriority);
  };

  const filteredEmails = getFilteredEmails();

  const getStatistics = () => {
    const periodEmails = getEmailsByPeriod(selectedPeriod);
    return {
      total: periodEmails.length,
      high: periodEmails.filter(e => e.priority === "high").length,
      medium: periodEmails.filter(e => e.priority === "medium").length,
      low: periodEmails.filter(e => e.priority === "low").length,
      categories: {
        urgent: periodEmails.filter(e => e.category === "urgent").length,
        work: periodEmails.filter(e => e.category === "work").length,
        business: periodEmails.filter(e => e.category === "business").length,
        system: periodEmails.filter(e => e.category === "system").length,
        marketing: periodEmails.filter(e => e.category === "marketing").length,
        hr: periodEmails.filter(e => e.category === "hr").length,
      }
    };
  };

  const stats = getStatistics();

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "medium": return <Info className="h-4 w-4 text-yellow-600" />;
      case "low": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500 bg-red-50";
      case "medium": return "border-l-yellow-500 bg-yellow-50";
      case "low": return "border-l-green-500 bg-green-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "today": return "Dnes";
      case "yesterday": return "Včera";
      case "week": return "Tento týždeň";
      case "month": return "Tento mesiac";
      default: return "Všetky";
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Summarizer</h1>
          <p className="text-sm text-muted-foreground">Inteligentné rozdelenie emailov podľa dôležitosti</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-2 block">Časové obdobie</label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger>
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Dnes</SelectItem>
              <SelectItem value="yesterday">Včera</SelectItem>
              <SelectItem value="week">Tento týždeň</SelectItem>
              <SelectItem value="month">Tento mesiac</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-2 block">Úroveň dôležitosti</label>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorityLevels.map((level) => (
                <SelectItem key={level.id} value={level.id}>
                  {level.label} ({level.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Celkom emailov</div>
            <div className="text-xs text-muted-foreground">{getPeriodLabel(selectedPeriod)}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.high}</div>
            <div className="text-sm text-muted-foreground">Vysoká priorita</div>
            <div className="text-xs text-muted-foreground">{stats.total > 0 ? Math.round((stats.high / stats.total) * 100) : 0}% z celku</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
            <div className="text-sm text-muted-foreground">Stredná priorita</div>
            <div className="text-xs text-muted-foreground">{stats.total > 0 ? Math.round((stats.medium / stats.total) * 100) : 0}% z celku</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.low}</div>
            <div className="text-sm text-muted-foreground">Nízka priorita</div>
            <div className="text-xs text-muted-foreground">{stats.total > 0 ? Math.round((stats.low / stats.total) * 100) : 0}% z celku</div>
          </CardContent>
        </Card>
      </div>

      {/* Email List by Priority */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Emaily - {priorityLevels.find(p => p.id === selectedPriority)?.label} - {getPeriodLabel(selectedPeriod)}</span>
            <Badge variant="secondary">{filteredEmails.length} emailov</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredEmails.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Žiadne emaily pre zvolené kritériá</p>
            </div>
          ) : (
            filteredEmails.map((email) => (
              <div key={email.id} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(email.priority)} hover:shadow-sm transition-shadow`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    {getPriorityIcon(email.priority)}
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1 line-clamp-1">
                        {email.subject}
                      </h3>
                      <p className="text-sm text-muted-foreground">Od: {email.from}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {email.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={priorityLevels.find(p => p.id === email.priority)?.color || "bg-gray-100 text-gray-800"}>
                      {priorityLevels.find(p => p.id === email.priority)?.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(email.timestamp)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Button size="sm" variant="outline">
                    <Eye className="mr-1 h-3 w-3" />
                    Detail
                  </Button>
                  <ComposeEmailDialog 
                    replyTo={email.fromEmail || `${email.from}@email.com`}
                    subject={`Re: ${email.subject}`}
                  >
                    <Button size="sm" variant="outline">
                      Odpovedať
                    </Button>
                  </ComposeEmailDialog>
                  <EmailTagManager>
                    <Button size="sm" variant="outline">
                      <Tag className="mr-1 h-3 w-3" />
                      Tag
                    </Button>
                  </EmailTagManager>
                  <Button size="sm" variant="ghost">
                    <Archive className="mr-1 h-3 w-3" />
                    Archív
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Categories Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rozdelenie podľa kategórií - {getPeriodLabel(selectedPeriod)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-semibold text-red-700">{stats.categories.urgent}</div>
              <div className="text-xs text-red-600">Urgentné</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-700">{stats.categories.work}</div>
              <div className="text-xs text-blue-600">Pracovné</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-700">{stats.categories.business}</div>
              <div className="text-xs text-green-600">Obchodné</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-700">{stats.categories.system}</div>
              <div className="text-xs text-purple-600">Systémové</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-semibold text-orange-700">{stats.categories.marketing}</div>
              <div className="text-xs text-orange-600">Marketing</div>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-lg font-semibold text-indigo-700">{stats.categories.hr}</div>
              <div className="text-xs text-indigo-600">HR</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-ai-primary-light border-ai-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-6 w-6 bg-ai-primary rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">AI</span>
            </div>
            Insights pre {getPeriodLabel(selectedPeriod).toLowerCase()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Štatistiky</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Priemer emailov za deň: {Math.round(stats.total / (selectedPeriod === 'today' ? 1 : selectedPeriod === 'yesterday' ? 1 : selectedPeriod === 'week' ? 7 : 30))}</li>
                <li>• Najčastejšia priorita: {stats.high >= stats.medium && stats.high >= stats.low ? 'Vysoká' : stats.medium >= stats.low ? 'Stredná' : 'Nízka'}</li>
                <li>• Urgentné emaily: {stats.total > 0 ? Math.round((stats.high / stats.total) * 100) : 0}% z celku</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">AI odporúčania</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {stats.high > 0 && <li>• Sústrediť sa na vysoké priority ({stats.high} emailov)</li>}
                {stats.medium > 0 && <li>• Naplánovať čas pre stredné priority ({stats.medium} emailov)</li>}
                {stats.low > 0 && <li>• Nízke priority môžu čakať ({stats.low} emailov)</li>}
                {stats.high === 0 && stats.medium === 0 && stats.low === 0 && <li>• Žiadne emaily v tomto období</li>}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};