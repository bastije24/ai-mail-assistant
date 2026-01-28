import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  UserPlus,
  Upload,
  MoreHorizontal,
  Mail,
  Trash2,
  UserCog,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockUsers, mockDepartments, mockPendingApprovals } from '../../data/mockData';
import { UserRole, UserStatus } from '../../types';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '../../context/AppContext';

export const PeoplePage = () => {
  const { toast } = useToast();
  const { organization } = useApp();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [emails, setEmails] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('member');
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'org_admin':
        return <Badge className="bg-ai-primary text-primary-foreground">Org Admin</Badge>;
      case 'dept_admin':
        return <Badge variant="secondary">Dept Admin</Badge>;
      default:
        return <Badge variant="outline">Member</Badge>;
    }
  };

  const handleInvite = () => {
    const emailList = emails.split(/[,\n]/).map(e => e.trim()).filter(Boolean);
    if (emailList.length === 0) {
      toast({
        title: "No emails",
        description: "Please enter at least one email address",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Invitations sent",
      description: `Sent ${emailList.length} invitation(s)`,
    });
    setInviteDialogOpen(false);
    setEmails('');
    setSelectedRole('member');
    setSelectedDepts([]);
  };

  const handleApprove = (userId: string) => {
    toast({
      title: "User approved",
      description: "User has been approved and can now access the organization",
    });
  };

  const handleReject = (userId: string) => {
    toast({
      title: "User rejected",
      description: "User request has been rejected",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">People</h1>
          <p className="text-sm text-muted-foreground">
            Manage your organization's members
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Invite Members</DialogTitle>
                <DialogDescription>
                  Send invitations to new team members. They'll receive an email with a join link.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="emails">Email addresses</Label>
                  <Textarea
                    id="emails"
                    placeholder="Enter email addresses (one per line or comma-separated)"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="dept_admin">Department Admin</SelectItem>
                      <SelectItem value="org_admin">Organization Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Departments (optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select departments" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDepartments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitations
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pending Approvals */}
      {organization.joinMode === 'approval' && mockPendingApprovals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Approval Queue
              <Badge variant="secondary">{mockPendingApprovals.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{approval.userName}</p>
                    <p className="text-sm text-muted-foreground">{approval.userEmail}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleReject(approval.userId)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleApprove(approval.userId)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Departments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.departments.length > 0 
                        ? user.departments.map(deptId => {
                            const dept = mockDepartments.find(d => d.id === deptId);
                            return dept ? (
                              <Badge key={deptId} variant="outline" className="text-xs">
                                {dept.name}
                              </Badge>
                            ) : null;
                          })
                        : <span className="text-muted-foreground text-sm">-</span>
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <UserCog className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Resend Invite
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
