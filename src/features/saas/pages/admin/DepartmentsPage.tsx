import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
  Plus,
  Settings,
  Users,
  UserCircle,
  Route,
} from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockDepartments, mockUsers, mockRoutingRules } from '../../data/mockData';
import { Department } from '../../types';
import { useToast } from '@/hooks/use-toast';

export const DepartmentsPage = () => {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');

  const handleAddDepartment = () => {
    if (!newDeptName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a department name",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Department created",
      description: `${newDeptName} has been created`,
    });
    setAddDialogOpen(false);
    setNewDeptName('');
  };

  const handleManage = (dept: Department) => {
    setSelectedDept(dept);
    setIsDetailOpen(true);
  };

  const getDeptMembers = (deptId: string) => {
    return mockUsers.filter(u => u.departments.includes(deptId));
  };

  const getDeptRules = (deptId: string) => {
    return mockRoutingRules.filter(r => r.actions.assignToId === deptId && r.actions.assignTo === 'department');
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Departments</h1>
          <p className="text-sm text-muted-foreground">
            Organize your team into departments
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Department</DialogTitle>
              <DialogDescription>
                Create a new department to organize your team members
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Marketing"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDepartment}>
                Create Department
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {mockDepartments.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No departments yet"
          description="Create departments to organize your team and route emails efficiently."
          actionLabel="Add Department"
          onAction={() => setAddDialogOpen(true)}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Default Owner</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDepartments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{dept.membersCount} members</Badge>
                    </TableCell>
                    <TableCell>
                      {dept.defaultOwnerName || (
                        <span className="text-muted-foreground">Not set</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleManage(dept)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Department Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedDept && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle>{selectedDept.name}</SheetTitle>
              </SheetHeader>

              <div className="space-y-6">
                {/* Default Owner */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Default Owner
                  </Label>
                  <Select defaultValue={selectedDept.defaultOwnerId || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {getDeptMembers(selectedDept.id).map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Emails assigned to this department will default to this owner
                  </p>
                </div>

                {/* Members */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Members
                    </Label>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {getDeptMembers(selectedDept.id).map(user => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    ))}
                    {getDeptMembers(selectedDept.id).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No members in this department
                      </p>
                    )}
                  </div>
                </div>

                {/* Routing Rules */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Route className="h-4 w-4" />
                    Routing Rules
                  </Label>
                  <div className="space-y-2">
                    {getDeptRules(selectedDept.id).map(rule => (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                            {rule.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {getDeptRules(selectedDept.id).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No routing rules target this department
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t">
                  <Button variant="destructive" className="w-full">
                    Delete Department
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
