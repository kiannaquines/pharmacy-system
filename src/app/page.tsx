import {
  BookOpen,
  Boxes,
  ChevronDown,
  ChevronRight,
  CircleEllipsis,
  LayoutGrid,
  Package,
  PanelLeft,
  Pill,
  ScrollText,
  Search,
  Settings2,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { fetchBatches, fetchDashboardSummary, fetchProducts, fetchSales, fetchSuppliers } from "@/lib/api";
import { cn } from "@/lib/utils";

const platformItems = [
  {
    label: "Overview",
    icon: LayoutGrid,
    active: true,
    children: ["Dashboard", "Inventory", "Sales"],
  },
  {
    label: "Catalog",
    icon: Package,
    children: ["Products", "Categories", "Units"],
  },
  {
    label: "Suppliers",
    icon: Truck,
    children: ["Vendors", "Returns"],
  },
  {
    label: "Users",
    icon: Users,
    children: ["Roles", "Activity"],
  },
  {
    label: "Reports",
    icon: TrendingUp,
    children: ["Sales", "Expiry", "Low Stock"],
  },
  {
    label: "Documentation",
    icon: BookOpen,
  },
  {
    label: "Settings",
    icon: Settings2,
  },
];

const projectItems = [
  "Prescription Medicines",
  "OTC Products",
  "Medical Supplies",
  "Vitamins",
  "More",
];

export default async function Home() {
  const [dashboard, suppliers, products, batches, sales] = await Promise.all([
    fetchDashboardSummary(),
    fetchSuppliers(),
    fetchProducts(),
    fetchBatches(),
    fetchSales(),
  ]);

  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="border-r border-border/60 bg-[#fafaf9]">
        <SidebarHeader className="border-b border-border/60 px-5 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-semibold tracking-tight">Acme Pharmacy</p>
                <p className="text-sm text-muted-foreground">Enterprise</p>
              </div>
            </div>
            <Button variant="ghost" size="icon-sm" className="rounded-xl text-muted-foreground">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-sm font-medium text-muted-foreground">
              Platform
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {platformItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    {item.children ? (
                      <Collapsible defaultOpen={item.active}>
                        <div>
                          <CollapsibleTrigger className="w-full">
                            <SidebarMenuButton
                              className={cn(
                                "h-11 w-full rounded-xl px-3 text-[15px]",
                                item.active && "bg-white shadow-sm",
                              )}
                              isActive={item.active}
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                              <ChevronDown className="ml-auto h-4 w-4" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="mt-1 space-y-1 pl-8">
                          {item.children.map((child) => (
                            <button
                              key={child}
                              className={cn(
                                "flex h-10 w-full items-center rounded-xl px-3 text-left text-sm text-muted-foreground transition hover:bg-white",
                                child === "Dashboard" && "bg-muted/60 text-foreground",
                              )}
                            >
                              {child}
                            </button>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton className="h-11 rounded-xl px-3 text-[15px]">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="px-3 text-sm font-medium text-muted-foreground">
              Projects
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projectItems.map((item) => (
                  <SidebarMenuItem key={item}>
                    <SidebarMenuButton className="h-11 rounded-xl px-3 text-[15px]">
                      {item === "More" ? <CircleEllipsis className="h-4 w-4" /> : <Boxes className="h-4 w-4" />}
                      <span>{item}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/60 px-4 py-4">
          <div className="flex items-center gap-3 rounded-2xl px-2 py-2">
            <Avatar className="h-10 w-10 border border-border/60">
              <AvatarFallback className="bg-[#f3e8ff] text-sm font-semibold text-[#6d28d9]">SC</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">shadcn</p>
              <p className="text-xs text-muted-foreground">Design system</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-[#f8f8f7] p-3 md:p-6">
        <div className="min-h-[calc(100vh-1.5rem)] rounded-[28px] border border-border/60 bg-white">
          <header className="flex items-center gap-4 border-b border-border/60 px-6 py-5 md:px-8">
            <div className="md:hidden">
              <SidebarTrigger className="rounded-xl border border-border/60 bg-white">
                <PanelLeft className="h-4 w-4" />
              </SidebarTrigger>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ScrollText className="h-4 w-4" />
              <span>Build Your Application</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Data Fetching</span>
            </div>
          </header>

          <main className="space-y-6 p-6 md:p-8">
            <section className="grid gap-5 lg:grid-cols-3">
              <Card className="h-[280px] rounded-[28px] border-0 bg-[#fafaf8] shadow-none">
                <CardContent className="flex h-full flex-col justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Total products</p>
                    <p className="mt-3 text-4xl font-semibold tracking-tight">{dashboard.totals.products}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Managed across pharmacy inventory categories.</p>
                </CardContent>
              </Card>
              <Card className="h-[280px] rounded-[28px] border-0 bg-[#fafaf8] shadow-none">
                <CardContent className="flex h-full flex-col justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Suppliers</p>
                    <p className="mt-3 text-4xl font-semibold tracking-tight">{suppliers.length}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Approved suppliers and vendors for restocking.</p>
                </CardContent>
              </Card>
              <Card className="h-[280px] rounded-[28px] border-0 bg-[#fafaf8] shadow-none">
                <CardContent className="flex h-full flex-col justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Sales records</p>
                    <p className="mt-3 text-4xl font-semibold tracking-tight">{sales.length}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Daily encoded sales reflected in the live backend.</p>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card className="min-h-[360px] rounded-[28px] border-0 bg-[#fafaf8] shadow-none">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Operations summary</p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight">Overview of inventory, batches, and low-stock pressure</h2>
                    </div>
                    <Button variant="outline" className="rounded-xl">
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-border/60 bg-white p-5">
                      <p className="text-sm text-muted-foreground">Low stock</p>
                      <p className="mt-3 text-3xl font-semibold">{dashboard.totals.lowStock}</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-white p-5">
                      <p className="text-sm text-muted-foreground">Near expiry</p>
                      <p className="mt-3 text-3xl font-semibold">{dashboard.totals.nearExpiry}</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-white p-5">
                      <p className="text-sm text-muted-foreground">Tracked batches</p>
                      <p className="mt-3 text-3xl font-semibold">{batches.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.slice(0, 3).map((product: any) => (
                <Card key={product.id} className="rounded-[24px] border-0 bg-[#fafaf8] shadow-none">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight">{product.brandName}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{product.genericName}</p>
                    <div className="mt-8 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stock</span>
                      <span className="font-medium">{product.stockAvailable}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
