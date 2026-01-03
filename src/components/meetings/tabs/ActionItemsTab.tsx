import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  UserPlus, 
  Calendar, 
  Download,
  ExternalLink,
  Mail,
  Send,
  X
} from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  date: Date;
  duration: number;
  participants: string[];
  status: "processing" | "ready" | "attention";
  hasRecording: boolean;
  confidence: "high" | "medium" | "low";
  summary: string[];
  questionsCount: number;
  actionsCount: number;
  leaderboardTop: { name: string; score: number }[];
}

interface ActionItemsTabProps {
  meeting: Meeting;
}

interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: Date;
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
}

export const ActionItemsTab = ({ meeting }: ActionItemsTabProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: `Action Items: ${meeting.title}`,
    content: ""
  });

  // Mock action items data
  const actionItems: ActionItem[] = [
    {
      id: "1",
      task: "Dokončiť implementáciu autentifikácie",
      assignee: "Martin K.",
      dueDate: new Date(2024, 9, 28),
      status: "in-progress",
      priority: "high"
    },
    {
      id: "2", 
      task: "Pripraviť dokumentáciu pre nové API",
      assignee: "Anna S.",
      dueDate: new Date(2024, 9, 30),
      status: "pending", 
      priority: "medium"
    },
    {
      id: "3",
      task: "Code review pre projekt X",
      assignee: "Peter N.",
      dueDate: new Date(2024, 9, 25),
      status: "completed",
      priority: "high"
    },
    {
      id: "4",
      task: "Aktualizovať deployment skripty",
      assignee: "Lucia M.",
      dueDate: new Date(2024, 9, 22),
      status: "overdue",
      priority: "medium"
    },
    {
      id: "5",
      task: "Otestovať nové funkcie v staging prostredí",
      assignee: "Tomáš V.",
      dueDate: new Date(2024, 10, 2),
      status: "pending",
      priority: "low"
    }
  ];

  const getStatusIcon = (status: ActionItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ActionItem["status"]) => {
    const variants = {
      completed: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      overdue: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    };

    const labels = {
      completed: "Dokončené",
      "in-progress": "Prebieha", 
      overdue: "Po termíne",
      pending: "Čaká"
    };

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: ActionItem["priority"]) => {
    const variants = {
      high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    };

    const labels = {
      high: "Vysoká",
      medium: "Stredná", 
      low: "Nízka"
    };

    return (
      <Badge variant="outline" className={variants[priority]}>
        {labels[priority]}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("sk-SK", {
      day: "numeric",
      month: "short"
    });
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkAssign = () => {
    if (selectedItems.length > 0) {
      toast.success(`Priradenie ${selectedItems.length} úloh je pripravené`);
    }
  };

  const handleBulkDueDate = () => {
    if (selectedItems.length > 0) {
      toast.success(`Zmena termínu pre ${selectedItems.length} úloh je pripravená`);
    }
  };

  const handleBulkComplete = () => {
    if (selectedItems.length > 0) {
      toast.success(`Označenie ${selectedItems.length} úloh ako hotové`);
      setSelectedItems([]);
    }
  };

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleProjectTool = () => {
    toast.success("Otváranie v project management tool...");
  };

  const handleNewEmail = () => {
    const itemsList = actionItems
      .map(item => `• ${item.task} (${item.assignee}, termín: ${formatDate(item.dueDate)})`)
      .join("\n");
    
    setEmailData({
      to: "",
      subject: `Action Items: ${meeting.title}`,
      content: `Dobrý deň,\n\nposielam zoznam úloh z meetingu "${meeting.title}":\n\n${itemsList}\n\nS pozdravom`
    });
    setShowEmailDialog(true);
  };

  const handleSendEmail = () => {
    if (!emailData.to) {
      toast.error("Zadajte príjemcu emailu");
      return;
    }
    toast.success(`Email odoslaný na ${emailData.to}`);
    setShowEmailDialog(false);
    setEmailData({ to: "", subject: "", content: "" });
  };

  const stats = {
    total: actionItems.length,
    completed: actionItems.filter(item => item.status === "completed").length,
    inProgress: actionItems.filter(item => item.status === "in-progress").length,
    overdue: actionItems.filter(item => item.status === "overdue").length
  };

  if (meeting.status === "processing") {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400 animate-spin" />
            </div>
            <h3 className="font-medium mb-2">Extrahujeme úlohy ⏳</h3>
            <p className="text-sm text-muted-foreground">
              Action items budú dostupné po dokončení spracovania.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Celkom úloh</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Dokončené</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-sm text-muted-foreground">Prebieha</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              <p className="text-sm text-muted-foreground">Po termíne</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions / Workflow */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Workflow</CardTitle>
                <p className="text-sm text-muted-foreground">Spravujte a zdieľajte úlohy</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button 
              onClick={handleNewEmail}
              className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
            >
              <Mail className="h-5 w-5" />
              <span className="text-sm font-medium">Nový email</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="h-auto py-4 flex flex-col items-center gap-2 border-2 hover:bg-accent"
            >
              <Download className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Export</span>
            </Button>
            <Button 
              variant="outline"
              onClick={handleProjectTool}
              className="h-auto py-4 flex flex-col items-center gap-2 border-2 hover:bg-accent"
            >
              <ExternalLink className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Project tool</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => toast.success("Synchronizácia s kalendárom...")}
              className="h-auto py-4 flex flex-col items-center gap-2 border-2 hover:bg-accent"
            >
              <Calendar className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">Kalendár</span>
            </Button>
          </div>

          {/* Bulk Actions */}
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">Hromadné akcie ({selectedItems.length} vybraných)</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={selectedItems.length === 0}
                onClick={handleBulkAssign}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Priradiť
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={selectedItems.length === 0}
                onClick={handleBulkDueDate}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Zmeniť termín
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={selectedItems.length === 0}
                onClick={handleBulkComplete}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Označiť hotové
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Action Items ({actionItems.length})</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedItems.length === actionItems.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(actionItems.map(item => item.id));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Úloha</TableHead>
                  <TableHead>Priradený</TableHead>
                  <TableHead>Termín</TableHead>
                  <TableHead>Priorita</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Akcie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actionItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <input 
                        type="checkbox"
                        className="rounded"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="max-w-xs truncate">{item.task}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {getInitials(item.assignee)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{item.assignee}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${
                        item.status === "overdue" ? "text-red-600 font-medium" : "text-muted-foreground"
                      }`}>
                        {formatDate(item.dueDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(item.priority)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toast.success(`Upravenie úlohy: ${item.task}`)}
                        >
                          Upraviť
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toast.success(`Detail úlohy: ${item.task}`)}
                        >
                          Detail
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Action Items</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Vyberte formát pre export action items:
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  toast.success("Exportujem do CSV...");
                  setShowExportDialog(false);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  toast.success("Exportujem do Excel...");
                  setShowExportDialog(false);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  toast.success("Exportujem do PDF...");
                  setShowExportDialog(false);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle>Nový email</DialogTitle>
                <p className="text-sm text-muted-foreground">Pošlite action items emailom</p>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Príjemca</label>
              <Input 
                placeholder="email@example.com"
                value={emailData.to}
                onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                className="border-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Predmet</label>
              <Input 
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                className="border-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Obsah</label>
              <Textarea 
                value={emailData.content}
                onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
                className="border-2 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowEmailDialog(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Zrušiť
              </Button>
              <Button 
                onClick={handleSendEmail}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Odoslať email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};