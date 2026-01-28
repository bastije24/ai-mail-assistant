import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Inbox,
  Users,
  Send,
  Shield,
  Settings,
  Search,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Building2,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '../../context/AppContext';

const navItems = [
  { id: 'inbox', label: 'My Inbox', icon: Inbox, path: '/app/inbox' },
  { id: 'team', label: 'Team Inbox', icon: Users, path: '/app/team' },
  { id: 'delegated', label: 'Delegated', icon: Send, path: '/app/delegated' },
];

const adminNavItems = [
  { id: 'admin', label: 'Admin', icon: Shield, path: '/app/admin' },
];

const settingsItem = { id: 'settings', label: 'Settings', icon: Settings, path: '/app/settings' };

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { organization, currentUser, isAdmin } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);
  const isAdminSection = location.pathname.startsWith('/app/admin');

  // Breadcrumbs for admin section
  const getBreadcrumbs = () => {
    if (!isAdminSection) return null;
    
    const parts = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Admin', path: '/app/admin' }];
    
    if (parts.length > 2) {
      const section = parts[2];
      const sectionLabels: Record<string, string> = {
        overview: 'Overview',
        seats: 'Seats & Code',
        people: 'People',
        departments: 'Departments',
        routing: 'Routing Rules',
        policies: 'Policies',
      };
      breadcrumbs.push({ label: sectionLabels[section] || section, path: location.pathname });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">AINBOX</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isActive(item.path) && "bg-secondary"
              )}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}

          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3">
                  Administration
                </span>
              </div>
              {adminNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive(item.path) && "bg-secondary"
                  )}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </>
          )}
        </nav>

        {/* Settings at bottom */}
        <div className="p-4 border-t">
          <Button
            variant={isActive(settingsItem.path) ? "secondary" : "ghost"}
            className="w-full justify-start gap-3"
            onClick={() => {
              navigate(settingsItem.path);
              setSidebarOpen(false);
            }}
          >
            <settingsItem.icon className="h-4 w-4" />
            {settingsItem.label}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Org Switcher */}
            <Select defaultValue={organization.id}>
              <SelectTrigger className="w-[180px] hidden sm:flex">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={organization.id}>
                  {organization.name}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Breadcrumbs */}
            {breadcrumbs && (
              <nav className="hidden md:flex items-center gap-1 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center gap-1">
                    {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    <Button
                      variant="link"
                      className={cn(
                        "p-0 h-auto text-sm",
                        index === breadcrumbs.length - 1
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}
                      onClick={() => navigate(crumb.path)}
                    >
                      {crumb.label}
                    </Button>
                  </div>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                className="pl-9 w-[200px] lg:w-[280px]"
              />
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">
                    {currentUser.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{currentUser.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {currentUser.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/app/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/login')}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
