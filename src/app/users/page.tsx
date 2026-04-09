import { PharmacyShell } from "@/components/pharmacy-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <PharmacyShell title="Users" description="User management page reserved for auth and role management.">
      <Card className="rounded-[28px] border border-border/70 bg-card">
        <CardHeader>
          <CardTitle>User module</CardTitle>
          <CardDescription>This page is ready for current-user, staff, and role CRUD once those backend endpoints are added.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Right now the backend does not expose user CRUD endpoints yet, so this page is intentionally staged.</p>
        </CardContent>
      </Card>
    </PharmacyShell>
  );
}
