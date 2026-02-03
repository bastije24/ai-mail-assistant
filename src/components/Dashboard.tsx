import { useState } from "react";
import { 
  TrendingUp, Clock, Sparkles, Calendar as CalendarIcon, 
  ArrowUpRight, ExternalLink, MoreVertical,
  Mail, CheckCircle, RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Performance data for line chart
const performanceData = [
  { date: "20 Jan", value: 2800 },
  { date: "21 Jan", value: 3200 },
  { date: "22 Jan", value: 2900 },
  { date: "23 Jan", value: 4500 },
  { date: "24 Jan", value: 3800 },
  { date: "25 Jan", value: 3500 },
  { date: "26 Jan", value: 4200 },
  { date: "27 Jan", value: 3900 },
];

// Heatmap data - activity by category per day
const heatmapData = [
  { category: "Práca", data: [1, 2, 2, 3, 4, 4, 3] },
  { category: "Projekty", data: [2, 3, 4, 4, 3, 2, 1] },
  { category: "Klienti", data: [3, 3, 4, 4, 4, 3, 2] },
  { category: "Osobné", data: [1, 2, 2, 2, 3, 4, 4] },
  { category: "Newsletter", data: [2, 2, 3, 3, 4, 4, 3] },
  { category: "Iné", data: [1, 1, 2, 3, 3, 4, 4] },
];

const days = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];

// AI Usage data
const aiUsageData = [
  { name: "Summarizer", used: 68, total: 120, percentage: 57 },
  { name: "AI Tagging", used: 91, total: 140, percentage: 65 },
];

export const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("daily");
  const [heatmapRange, setHeatmapRange] = useState("daily");

  const getHeatmapColor = (value: number) => {
    if (value === 1) return "bg-primary/20";
    if (value === 2) return "bg-primary/40";
    if (value === 3) return "bg-primary/60";
    if (value === 4) return "bg-primary";
    return "bg-muted";
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Prehľad</h1>
            <p className="text-sm text-muted-foreground">
              Tu je prehľad vašej emailovej produktivity.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <ExternalLink className="h-4 w-4 mr-2" />
            Exportovať dáta
          </Button>
        </div>

        {/* Top Stats Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Today's Emails */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Spracované dnes</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">247</span>
                <span className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  +23
                </span>
                <span className="text-xs text-muted-foreground">oproti včera</span>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Emailová aktivita k dnešnému dňu. Aktualizované každú hodinu.
              </p>
            </CardContent>
          </Card>

          {/* Pending Responses */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Čakajúce odpovede</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">12 emailov</span>
                <span className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  +2%
                </span>
                <span className="text-xs text-muted-foreground">oproti včera</span>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Čakajú na vašu odpoveď alebo potvrdenie.
              </p>
            </CardContent>
          </Card>

          {/* Monthly Goals */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Mesačné ciele</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Cieľ</p>
                      <p className="text-lg font-semibold">500</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Dosiahnuté</p>
                      <p className="text-lg font-semibold">310</p>
                    </div>
                  </div>
                </div>
                {/* Circular Progress */}
                <div className="relative h-20 w-20">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${62 * 2.51} 251`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-foreground">62%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Row - Heatmap + Line Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Activity Heatmap */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-medium">Top kategórie</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={heatmapRange} onValueChange={setHeatmapRange}>
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Denné</SelectItem>
                    <SelectItem value="weekly">Týždenné</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {heatmapData.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20 truncate">
                      {row.category}
                    </span>
                    <div className="flex gap-1 flex-1">
                      {row.data.map((value, colIndex) => (
                        <div
                          key={colIndex}
                          className={`h-8 flex-1 rounded ${getHeatmapColor(value)}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                {/* Day labels */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-20" />
                  <div className="flex gap-1 flex-1">
                    {days.map((day, index) => (
                      <span key={index} className="flex-1 text-center text-xs text-muted-foreground">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Line Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-medium">Výkon emailov</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[100px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Denne</SelectItem>
                    <SelectItem value="weekly">Týždenne</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="outline" className="h-8 px-3 flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  20-27 Jan 2025
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#colorValue)"
                      name="Emaily"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - AI Usage + Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* AI Usage */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-medium">Využitie AI</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {aiUsageData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground">
                      {item.total} · <span className="text-primary">({item.percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-8 bg-muted rounded-md overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-md flex items-center px-3"
                      style={{ width: `${item.percentage}%` }}
                    >
                      <span className="text-xs text-primary-foreground font-medium">
                        {item.used}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* AI Tip */}
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg mt-4">
                <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  AI Tagging využíva 65% svojej mesačnej kapacity, zatiaľ čo Summarizer je na 57%. 
                  Upravte alokácie pre optimálny výkon.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-medium">Nedávna aktivita</CardTitle>
              <div className="flex items-center gap-2">
                <Select defaultValue="latest">
                  <SelectTrigger className="w-[100px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Najnovšie</SelectItem>
                    <SelectItem value="oldest">Najstaršie</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Martin K.", action: "AI sumarizoval 5 emailov", time: "pred 2h", rating: 5 },
                { name: "Anna M.", action: "Automatické tagovanie dokončené", time: "pred 4h", rating: 4 },
                { name: "Peter S.", action: "Naplánovaný email odoslaný", time: "včera", rating: 5 },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {activity.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{activity.name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${i < activity.rating ? 'text-yellow-500' : 'text-muted'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
