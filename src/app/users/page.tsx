import { MoreHorizontal, Plus, Search, Shield, UserCheck, UserCog, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PharmacyShell } from "@/components/pharmacy-shell";

const MOCK_USERS = [
  { id: 1, name: "Maria Santos",  email: "m.santos@pharmacy.com",  role: "Admin",     status: "Active",   lastActive: "Just now",   initials: "MS" },
  { id: 2, name: "Jose Reyes",    email: "j.reyes@pharmacy.com",   role: "Pharmacist",status: "Active",   lastActive: "2 hours ago", initials: "JR" },
  { id: 3, name: "Ana Cruz",      email: "a.cruz@pharmacy.com",    role: "Staff",     status: "Active",   lastActive: "Yesterday",  initials: "AC" },
  { id: 4, name: "Pedro Lim",     email: "p.lim@pharmacy.com",     role: "Staff",     status: "Inactive", lastActive: "3 days ago", initials: "PL" },
  { id: 5, name: "Rosa Garcia",   email: "r.garcia@pharmacy.com",  role: "Auditor",   status: "Active",   lastActive: "5 min ago",  initials: "RG" },
  { id: 6, name: "Carlos Bautista",email:"c.bautista@pharmacy.com",role: "Pharmacist",status: "Active",   lastActive: "1 hour ago", initials: "CB" },
];

const ROLE_COLORS: Record<string, string> = {
  Admin:      "bg-purple-50 text-purple-700 border-purple-200",
  Pharmacist: "bg-blue-50 text-blue-700 border-blue-200",
  Staff:      "bg-sky-50 text-sky-700 border-sky-200",
  Auditor:    "bg-amber-50 text-amber-700 border-amber-200",
};

const ROLE_ICONS: Record<string, React.ElementType> = {
  Admin:      Shield,
  Pharmacist: UserCog,
  Staff:      Users,
  Auditor:    UserCheck,
};

const STATS = [
  { label: "Total Users",   value: MOCK_USERS.length,                             icon: Users,     bg: "bg-primary/10",   color: "text-primary"   },
  { label: "Active",        value: MOCK_USERS.filter((u) => u.status === "Active").length, icon: UserCheck, bg: "bg-emerald-100",  color: "text-emerald-600" },
  { label: "Admins",        value: MOCK_USERS.filter((u) => u.role === "Admin").length,    icon: Shield,    bg: "bg-purple-100",   color: "text-purple-600" },
  { label: "Pharmacists",   value: MOCK_USERS.filter((u) => u.role === "Pharmacist").length, icon: UserCog, bg: "bg-blue-100", color: "text-blue-600" },
];

export default function UsersPage() {
  return (
    <PharmacyShell
      title="User Management"
      description="Manage staff roles, access levels, and account status"
    >
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, bg, color }) => (
          <Card key={label} className="border-0 shadow-none bg-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-0 shadow-none bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Team Members</CardTitle>
              <CardDescription>All registered users and their permission levels</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users…"
                  className="h-8 w-48 pl-8 text-xs"
                  readOnly
                />
              </div>
              <Button size="sm" className="h-8 gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" />
                Invite User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-b-xl">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-6">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_USERS.map((user) => {
                  const RoleIcon = ROLE_ICONS[user.role] ?? Users;
                  return (
                    <TableRow key={user.id} className="group">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            {user.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${ROLE_COLORS[user.role] ?? "bg-muted text-muted-foreground border-border"}`}
                        >
                          <RoleIcon className="h-3 w-3" />
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${user.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"}`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{user.lastActive}</TableCell>
                      <TableCell>
                        <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Roles guide */}
      <Card className="border-0 shadow-none bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Role Permissions</CardTitle>
          <CardDescription>Overview of access levels in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { role: "Admin",      desc: "Full system access, user management, and settings.",        color: ROLE_COLORS.Admin },
              { role: "Pharmacist", desc: "Manage products, batches, sales, and view reports.",         color: ROLE_COLORS.Pharmacist },
              { role: "Staff",      desc: "Record sales, view inventory, and create purchase orders.",  color: ROLE_COLORS.Staff },
              { role: "Auditor",    desc: "Read-only access to all records and reports.",               color: ROLE_COLORS.Auditor },
            ].map(({ role, desc, color }) => {
              const Icon = ROLE_ICONS[role] ?? Users;
              return (
                <div key={role} className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${color}`}>
                      <Icon className="h-3 w-3" />
                      {role}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{desc}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </PharmacyShell>
  );
}
