import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  Building2, 
  Route, 
  ShieldCheck,
  ChevronLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/app/admin/overview' },
  { id: 'seats', label: 'Seats & Code', icon: CreditCard, path: '/app/admin/seats' },
  { id: 'people', label: 'People', icon: Users, path: '/app/admin/people' },
  { id: 'departments', label: 'Departments', icon: Building2, path: '/app/admin/departments' },
  { id: 'routing', label: 'Routing Rules', icon: Route, path: '/app/admin/routing' },
  { id: 'policies', label: 'Policies', icon: ShieldCheck, path: '/app/admin/policies' },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Admin Sub-navigation */}
      <aside className="lg:w-56 border-b lg:border-b-0 lg:border-r bg-card">
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground mb-4"
            onClick={() => navigate('/app/inbox')}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Inbox
          </Button>
          
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {adminNavItems.map((item) => (
              <Button
                key={item.id}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className={cn(
                  "justify-start gap-2 whitespace-nowrap",
                  isActive(item.path) && "bg-secondary"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Admin content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};
