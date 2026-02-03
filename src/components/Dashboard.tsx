import { useState } from "react";
import { 
  Mail, TrendingUp, Clock, Sparkles, Calendar, 
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart,
  Send, Inbox, Archive, Tag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
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
  { day: "Po", received: 45, sent: 12, aiProcessed: 38 },
  { day: "Ut", received: 52, sent: 18, aiProcessed: 45 },
  { day: "St", received: 38, sent: 15, aiProcessed: 32 },
  { day: "Št", received: 65, sent: 22, aiProcessed: 58 },
  { day: "Pi", received: 48, sent: 28, aiProcessed: 42 },
  { day: "So", received: 15, sent: 5, aiProcessed: 12 },
  { day: "Ne", received: 8, sent: 2, aiProcessed: 6 },
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
  { name: "Dôležité", count: 67, color: "bg-red-500" },
  { name: "Promo", count: 203, color: "bg-orange-500" },
];

export const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("week");

  const stats = [
    {
      title: "Prijaté emaily",
      value: "1,247",
      change: "+12%",
      changeType: "positive",
      icon: Inbox,
      subtitle: "za posledných 7 dní",
    },
    {
      title: "AI spracované",
      value: "1,089",
      change: "+18%",
      changeType: "positive",
      icon: Sparkles,
      subtitle: "87% automatizácia",
    },
    {
      title: "Odoslané emaily",
      value: "156",
      change: "-5%",
      changeType: "negative",
      icon: Send,
      subtitle: "vrátane naplánovaných",
    },
    {
      title: "Ušetrený čas",
      value: "12.5h",
      change: "+23%",
      changeType: "positive",
      icon: Clock,
      subtitle: "vďaka AI asistentovi",
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
              Emailová aktivita
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
                    dataKey="received"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    name="Prijaté"
                  />
                  <Line
                    type="monotone"
                    dataKey="aiProcessed"
                    stroke="hsl(142.1 76.2% 36.3%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(142.1 76.2% 36.3%)", strokeWidth: 2 }}
                    name="AI spracované"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Prijaté</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">AI spracované</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Goals */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Mesačné ciele
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative h-36 w-36">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${goals.percentage * 2.51} 251`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">
                    {goals.percentage}%
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Cieľ</p>
                <p className="text-lg font-semibold text-foreground">
                  {goals.target}
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Dosiahnuté</p>
                <p className="text-lg font-semibold text-primary">
                  {goals.achieved}
                </p>
              </div>
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
