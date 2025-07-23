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
  X,
  Camera,
  Upload,
  Eye,
  EyeOff,
  Save
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AinboxSidebarProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
}

export const AinboxSidebar = ({ selectedSection, onSectionChange }: AinboxSidebarProps) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
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
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profil používateľa
                    </h3>
                    {!editingProfile && (
                      <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)}>
                        Upraviť profil
                      </Button>
                    )}
                  </div>
                  
                  {editingProfile ? (
                    <div className="p-6 bg-card rounded-lg border space-y-6">
                      {/* Profile Photo Upload */}
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <Avatar className="h-24 w-24">
                            <AvatarFallback className="bg-ai-primary text-primary-foreground text-2xl font-medium">
                              MK
                            </AvatarFallback>
                          </Avatar>
                          <Button 
                            size="icon" 
                            variant="secondary"
                            className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            Nahrať foto
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            Odstrániť
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Odporúčané: JPG, PNG do 5MB. Minimálne 400x400px
                        </p>
                      </div>
                      
                      {/* Profile Form */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Krstné meno</Label>
                          <Input id="firstName" defaultValue="Martin" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Priezvisko</Label>
                          <Input id="lastName" defaultValue="Kováč" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Spoločnosť</Label>
                          <Input id="company" placeholder="Názov spoločnosti" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position">Pozícia</Label>
                          <Input id="position" placeholder="Vaša pozícia" />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditingProfile(false)}>
                          Zrušiť
                        </Button>
                        <Button onClick={() => setEditingProfile(false)}>
                          <Save className="h-4 w-4 mr-2" />
                          Uložiť zmeny
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card rounded-lg border">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Meno</label>
                          <p className="text-lg font-medium">Martin Kováč</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <p className="text-lg">martin.kovac@email.com</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Spoločnosť</label>
                          <p className="text-sm text-muted-foreground">Nenastavená</p>
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
                  )}
                </div>

                {/* Email Change Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Zmena emailu
                    </h3>
                    {!changingEmail && (
                      <Button variant="outline" size="sm" onClick={() => setChangingEmail(true)}>
                        Zmeniť email
                      </Button>
                    )}
                  </div>
                  
                  {changingEmail ? (
                    <div className="p-6 bg-card rounded-lg border space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentEmail">Aktuálny email</Label>
                        <Input id="currentEmail" value="martin.kovac@email.com" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newEmail">Nový email</Label>
                        <Input id="newEmail" type="email" placeholder="novy@email.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Potvrdenie hesla</Label>
                        <Input id="confirmPassword" type="password" placeholder="Zadajte heslo pre potvrdenie" />
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          <strong>Upozornenie:</strong> Na nový email bude odoslaný verifikačný odkaz. 
                          Pôvodný email bude aktívny až do overenia nového.
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setChangingEmail(false)}>
                          Zrušiť
                        </Button>
                        <Button>Zmeniť email</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-card rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">martin.kovac@email.com</p>
                          <p className="text-sm text-muted-foreground">Overený email</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Overený
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Change Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Zmena hesla
                    </h3>
                    {!changingPassword && (
                      <Button variant="outline" size="sm" onClick={() => setChangingPassword(true)}>
                        Zmeniť heslo
                      </Button>
                    )}
                  </div>
                  
                  {changingPassword ? (
                    <div className="p-6 bg-card rounded-lg border space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Aktuálne heslo</Label>
                        <div className="relative">
                          <Input 
                            id="currentPassword" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Zadajte aktuálne heslo" 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nové heslo</Label>
                        <div className="relative">
                          <Input 
                            id="newPassword" 
                            type={showNewPassword ? "text" : "password"} 
                            placeholder="Zadajte nové heslo" 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword">Potvrdenie nového hesla</Label>
                        <Input id="confirmNewPassword" type="password" placeholder="Zopakujte nové heslo" />
                      </div>
                      
                      {/* Password Requirements */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm font-medium text-blue-900 mb-2">Požiadavky na heslo:</p>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Minimálne 8 znakov</li>
                          <li>• Aspoň jedno veľké písmeno</li>
                          <li>• Aspoň jedno malé písmeno</li>
                          <li>• Aspoň jedna číslica</li>
                          <li>• Aspoň jeden špeciálny znak (!@#$%^&*)</li>
                        </ul>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setChangingPassword(false)}>
                          Zrušiť
                        </Button>
                        <Button>Zmeniť heslo</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-card rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Heslo</p>
                          <p className="text-sm text-muted-foreground">Naposledy zmenené pred 3 mesiacmi</p>
                        </div>
                        <Button variant="outline" size="sm">
                          ••••••••
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* General Settings */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Všeobecné nastavenia
                  </h3>
                  <div className="p-6 bg-card rounded-lg border space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium">Tmavý režim</span>
                      <Button variant="outline" size="sm">Zapnúť</Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium">Jazyk</span>
                      <Button variant="outline" size="sm">Slovenčina</Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium">Časové pásmo</span>
                      <Button variant="outline" size="sm">UTC+1</Button>
                    </div>
                  </div>
                </div>

                {/* Subscription Management */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Predplatné
                  </h3>
                  <div className="p-6 bg-card rounded-lg border space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="font-medium">Aktuálny plán</span>
                        <p className="text-sm text-muted-foreground">Premium - €9.99/mesiac</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Aktívne
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium">Zmeniť predplatné</span>
                      <Button variant="outline" size="sm">Upraviť plán</Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium">Správa platby</span>
                      <Button variant="outline" size="sm">Spravovať</Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-red-600">Zrušiť predplatné</span>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        Zrušiť
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Account Security */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Bezpečnosť účtu
                  </h3>
                  <div className="p-6 bg-card rounded-lg border space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="font-medium">Dvojfaktorové overenie</span>
                        <p className="text-sm text-muted-foreground">Dodatočná ochrana vašeho účtu</p>
                      </div>
                      <Button variant="outline" size="sm">Nastaviť</Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="font-medium">Aktívne relácie</span>
                        <p className="text-sm text-muted-foreground">Spravovať prihlásené zariadenia</p>
                      </div>
                      <Button variant="outline" size="sm">Zobraziť</Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="font-medium">História prihlásení</span>
                        <p className="text-sm text-muted-foreground">Zobraziť nedávne prihlásenia</p>
                      </div>
                      <Button variant="outline" size="sm">História</Button>
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
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="font-medium">Email upozornenia</span>
                        <p className="text-sm text-muted-foreground">Nové správy a aktualizácie</p>
                      </div>
                      <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200">
                        Zapnuté
                      </Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="font-medium">Urgentné emaily</span>
                        <p className="text-sm text-muted-foreground">Okamžité upozornenia na dôležité správy</p>
                      </div>
                      <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200">
                        Zapnuté
                      </Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="font-medium">Týždenné súhrny</span>
                        <p className="text-sm text-muted-foreground">Prehľad aktivity za týždeň</p>
                      </div>
                      <Button variant="outline" size="sm">Vypnuté</Button>
                    </div>
                  </div>
                </div>

                {/* Data & Privacy */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Dáta a súkromie
                  </h3>
                  <div className="p-6 bg-card rounded-lg border space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium">Stiahnuť moje dáta</span>
                      <Button variant="outline" size="sm">Stiahnuť</Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium">Vymazať históriu</span>
                      <Button variant="outline" size="sm">Vymazať</Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-red-600">Vymazať účet</span>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        Vymazať
                      </Button>
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