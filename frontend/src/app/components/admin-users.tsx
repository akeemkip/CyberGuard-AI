import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Moon,
  Sun,
  Search,
  MoreVertical,
  UserCheck,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  Shield,
  Plus,
  Edit,
  Download,
  UserCog,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useTheme } from "./theme-provider";
import userService, { CreateUserData } from "../services/user.service";
import { AdminSidebar } from "./admin-sidebar";
import { toast } from "sonner";

interface AdminUsersProps {
  userEmail: string;
  onNavigate: (page: string, userId?: string) => void;
  onLogout: () => void;
}

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: "ADMIN" | "STUDENT";
  createdAt: string;
  _count: {
    enrollments: number;
  };
}

type SortField = "name" | "email" | "createdAt" | "enrollments";
type SortDirection = "asc" | "desc";

export function AdminUsers({ userEmail, onNavigate, onLogout }: AdminUsersProps) {
  const { theme, toggleTheme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "ADMIN" | "STUDENT">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const usersPerPage = 10;

  // Create user form state
  const [createForm, setCreateForm] = useState<CreateUserData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "STUDENT"
  });
  const [isCreating, setIsCreating] = useState(false);

  // Edit user form state
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const fetchedUsers = await userService.getAllUsers();
      setUsers(fetchedUsers as User[]);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setIsCreating(true);
      const newUser = await userService.createUser(createForm);
      setUsers([newUser as User, ...users]);
      setShowCreateDialog(false);
      setCreateForm({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "STUDENT"
      });
      toast.success(`User ${createForm.firstName} ${createForm.lastName} created successfully!`);
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.response?.data?.error || "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      setIsEditing(true);
      const updatedUser = await userService.updateUser(selectedUser.id, editForm);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...updatedUser } : u));
      setShowEditDialog(false);
      toast.success(`User ${editForm.firstName} ${editForm.lastName} updated successfully!`);
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.error || "Failed to update user");
    } finally {
      setIsEditing(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: "ADMIN" | "STUDENT") => {
    try {
      const updatedUser = await userService.changeUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, ...updatedUser } : u));
      toast.success(`User role changed to ${newRole.toLowerCase()}`);
    } catch (error: any) {
      console.error("Error changing role:", error);
      toast.error(error.response?.data?.error || "Failed to change user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setDeletingId(userId);
      await userService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportToCSV = () => {
    const headers = ["Name", "Email", "Role", "Enrollments", "Join Date"];
    const rows = filteredUsers.map(user => [
      getDisplayName(user),
      user.email,
      user.role,
      user._count?.enrollments || 0,
      formatDate(user.createdAt)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cyberguard-users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("User data exported successfully!");
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    return user.email.split("@")[0];
  };

  const sortUsers = (usersToSort: User[]) => {
    return [...usersToSort].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = getDisplayName(a).localeCompare(getDisplayName(b));
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "enrollments":
          comparison = (a._count?.enrollments || 0) - (b._count?.enrollments || 0);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  const filteredUsers = sortUsers(users.filter((user) => {
    const displayName = getDisplayName(user);
    const matchesSearch =
      displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  }));

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge variant="default">Admin</Badge>;
      default:
        return <Badge variant="outline">Student</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" ?
      <ArrowUp className="w-4 h-4 ml-1" /> :
      <ArrowDown className="w-4 h-4 ml-1" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AdminSidebar
        userEmail={userEmail}
        currentPage="admin-users"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-muted-foreground">Manage users, roles, and permissions</p>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Total Users</span>
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold">{users.length}</div>
            </Card>
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Students</span>
                <UserCheck className="w-5 h-5 text-success" />
              </div>
              <div className="text-3xl font-bold">{users.filter(u => u.role === "STUDENT").length}</div>
            </Card>
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Admins</span>
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold">{users.filter(u => u.role === "ADMIN").length}</div>
            </Card>
          </div>

          {/* Actions Bar */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input-background"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={roleFilter === "all" ? "default" : "outline"}
                  onClick={() => setRoleFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={roleFilter === "STUDENT" ? "default" : "outline"}
                  onClick={() => setRoleFilter("STUDENT")}
                >
                  Students
                </Button>
                <Button
                  variant={roleFilter === "ADMIN" ? "default" : "outline"}
                  onClick={() => setRoleFilter("ADMIN")}
                >
                  Admins
                </Button>
                <Button variant="outline" onClick={handleExportToCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Add a new user to the platform
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>First Name</Label>
                          <Input
                            value={createForm.firstName}
                            onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <Label>Last Name</Label>
                          <Input
                            value={createForm.lastName}
                            onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={createForm.email}
                          onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      <div>
                        <Label>Password</Label>
                        <Input
                          type="password"
                          value={createForm.password}
                          onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                          placeholder="Minimum 6 characters"
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Select
                          value={createForm.role}
                          onValueChange={(value: "STUDENT" | "ADMIN") => setCreateForm({ ...createForm, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="STUDENT">Student</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser} disabled={isCreating}>
                        {isCreating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create User"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>

          {/* Users Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center hover:text-foreground"
                    >
                      User
                      <SortIcon field="name" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("email")}
                      className="flex items-center hover:text-foreground"
                    >
                      Email
                      <SortIcon field="email" />
                    </button>
                  </TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("enrollments")}
                      className="flex items-center hover:text-foreground"
                    >
                      Enrollments
                      <SortIcon field="enrollments" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("createdAt")}
                      className="flex items-center hover:text-foreground"
                    >
                      Joined
                      <SortIcon field="createdAt" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-medium">
                              {getDisplayName(user).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="font-medium">{getDisplayName(user)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user._count?.enrollments || 0} courses
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onNavigate("admin-user-profile", user.id)}
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user);
                              setEditForm({
                                firstName: user.firstName || "",
                                lastName: user.lastName || "",
                                email: user.email
                              });
                              setShowEditDialog(true);
                            }}
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.role === "ADMIN" ? (
                            // Demote admin - requires confirmation
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={user.email === userEmail}
                                  title={user.email === userEmail ? "Cannot demote yourself" : "Demote to Student"}
                                >
                                  <UserCog className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Admin Privileges?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to demote {getDisplayName(user)} from Admin to Student?
                                    They will lose access to all admin features including user management,
                                    content management, and analytics.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleChangeRole(user.id, "STUDENT")}
                                  >
                                    Demote to Student
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            // Promote student - no confirmation needed
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleChangeRole(user.id, "ADMIN")}
                              title="Promote to Admin"
                            >
                              <UserCog className="w-4 h-4" />
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={user.role === "ADMIN"}
                                title={user.role === "ADMIN" ? "Cannot delete admin" : "Delete User"}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {getDisplayName(user)}? This action cannot be undone. All user data, enrollments, and progress will be permanently deleted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-destructive text-destructive-foreground"
                                  disabled={deletingId === user.id}
                                >
                                  {deletingId === user.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="border-t border-border p-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * usersPerPage) + 1} to{" "}
                {Math.min(currentPage * usersPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Edit User Dialog */}
          {selectedUser && (
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>
                    Update user information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditUser} disabled={isEditing}>
                    {isEditing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </div>
    </div>
  );
}
