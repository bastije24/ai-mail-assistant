import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  CreditCard,
  Route,
  Bell,
  UserPlus,
  Building2,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockRoutingRules, mockPendingApprovals, mockUsers } from '../../data/mockData';

export const AdminOverviewPage = () => {
  const navigate = useNavigate();
  const { organization } = useApp();

  const urgentUsersCount = mockUsers.filter(u => u.urgentMode).length;
  const enabledRulesCount = mockRoutingRules.filter(r => r.enabled).length;

  const stats = [
    {
      title: 'Seats Used',
      value: `${organization.seatsUsed} / ${organization.seatsTotal}`,
      icon: CreditCard,
      description: `${organization.seatsTotal - organization.seatsUsed} seats available`,
      color: 'text-ai-primary',
      bgColor: 'bg-ai-primary-light',
    },
    {
      title: 'Pending Approvals',
      value: mockPendingApprovals.length,
      icon: Users,
      description: 'Users waiting for approval',
      color: 'text-ai-warning',
      bgColor: 'bg-ai-warning-light',
    },
    {
      title: 'Routing Rules',
      value: enabledRulesCount,
      icon: Route,
      description: `${mockRoutingRules.length} total rules`,
      color: 'text-ai-success',
      bgColor: 'bg-ai-success-light',
    },
    {
      title: 'Urgent Notifications',
      value: urgentUsersCount,
      icon: Bell,
      description: 'Users with urgent mode enabled',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  const quickActions = [
    {
      label: 'Invite Users',
      icon: UserPlus,
      onClick: () => navigate('/app/admin/people'),
    },
    {
      label: 'Create Department',
      icon: Building2,
      onClick: () => navigate('/app/admin/departments'),
    },
    {
      label: 'Create Routing Rule',
      icon: Plus,
      onClick: () => navigate('/app/admin/routing'),
    },
    {
      label: 'Rotate Join Code',
      icon: RefreshCw,
      onClick: () => navigate('/app/admin/seats'),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">
          Manage {organization.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={action.onClick}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals Preview */}
      {mockPendingApprovals.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pending Approvals</CardTitle>
            <Button variant="link" onClick={() => navigate('/app/admin/people')}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{approval.userName}</p>
                    <p className="text-sm text-muted-foreground">{approval.userEmail}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Reject</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
