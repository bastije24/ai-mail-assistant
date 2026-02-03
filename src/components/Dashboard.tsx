import { useState } from "react";
import { 
  Mail, TrendingUp, Clock, Sparkles, Calendar as CalendarIcon, 
  ArrowUpRight, ArrowDownRight, BarChart3, 
  Send, CheckCircle, AlertCircle, Users, Tag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const emailActivityData = [
  { day: "Po", odoslane: 12, dokoncene: 38 },
  { day: "Ut", odoslane: 18, dokoncene: 45 },
  { day: "St", odoslane: 15, dokoncene: 32 },
  { day: "Št", odoslane: 22, dokoncene: 58 },
  { day: "Pi", odoslane: 28, dokoncene: 42 },
  { day: "So", odoslane: 5, dokoncene: 12 },
  { day: "Ne", odoslane: 2, dokoncene: 6 },
];

const weeklyTrendData = [
  { date: "1. týždeň", emails: 320, aiActions: 280 },
  { date: "2. týždeň", emails: 380, aiActions: 340 },
  { date: "3. týždeň", emails: 290, aiActions: 260 },
  { date: "4. týždeň", emails: 420, aiActions: 390 },
];

const categoryData = [
  { name: "Práca", count: 245, color: "bg-blue-500" },
  { name: "Osobné", count: 89, color: "bg-green-500" },
  { name: "Newsletter", count: 156, color: "bg-purple-500" },
  { name: "Dôležité", count: 67, color: "bg-destructive" },
  { name: "Promo", count: 203, color: "bg-orange-500" },
];

const upcomingEvents = [
  { title: "Team standup", time: "09:00", type: "meeting" },
  { title: "Deadline: Report Q4", time: "12:00", type: "deadline" },
  { title: "Call s klientom", time: "14:30", type: "meeting" },
  { title: "Review PR", time: "16:00", type: "task" },
];

export const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const stats = [
    {
      title: "Dokončené úlohy",
      value: "47",
      change: "+8%",
      changeType: "positive",
      icon: CheckCircle,
      subtitle: "za posledných 7 dní",
    },
    {
      title: "Čakajúce odpovede",
      value: "12",
      change: "-3",
      changeType: "positive",
      icon: AlertCircle,
      subtitle: "potrebujú pozornosť",
    },
    {
      title: "Odoslané emaily",
      value: "156",
      change: "+15%",
      changeType: "positive",
      icon: Send,
      subtitle: "vrátane naplánovaných",
    },
    {
      title: "Aktívne kontakty",
      value: "234",
      change: "+12",
      changeType: "positive",
      icon: Users,
      subtitle: "tento mesiac",
    },
  ];

  const goals = {
    target: 500,
    achieved: 420,
    percentage: 84,
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Prehľad vašej emailovej produktivity
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <BarChart3 className="h-4 w-4 mr-2" />
          Exportovať dáta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </span>
                    <span
                      className={`text-xs font-medium flex items-center ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.changeType === "positive" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Email Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              Aktivita
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Týždeň</SelectItem>
                  <SelectItem value="month">Mesiac</SelectItem>
                  <SelectItem value="year">Rok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emailActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="odoslane"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    name="Odoslané"
                  />
                  <Line
                    type="monotone"
                    dataKey="dokoncene"
                    stroke="hsl(142.1 76.2% 36.3%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(142.1 76.2% 36.3%)", strokeWidth: 2 }}
                    name="Dokončené"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Odoslané</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Dokončené</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Kalendár
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0 p-0"
            />
            {/* Today's Events */}
            <div className="w-full mt-4 pt-4 border-t space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase">Dnes</p>
              {upcomingEvents.slice(0, 3).map((event, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-foreground truncate">{event.title}</span>
                  <Badge variant="outline" className="text-xs shrink-0 ml-2">
                    {event.time}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Kategórie emailov
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{category.name}</span>
                  <span className="text-muted-foreground">{category.count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${category.color} rounded-full transition-all`}
                    style={{
                      width: `${(category.count / 300) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Usage Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI využitie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar 
                    dataKey="emails" 
                    fill="hsl(var(--muted))" 
                    radius={[4, 4, 0, 0]}
                    name="Emaily"
                  />
                  <Bar 
                    dataKey="aiActions" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    name="AI akcie"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted-foreground/50" />
                <span className="text-sm text-muted-foreground">Emaily</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">AI akcie</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Vaša produktivita rastie!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tento týždeň ste spracovali o 18% viac emailov vďaka AI
                </p>
              </div>
            </div>
            <Button variant="outline">
              Zobraziť detaily
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
