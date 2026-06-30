"use client";

import {
  HomeIcon,
  InboxIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  { icon: HomeIcon, label: "Home", active: false },
  { icon: LayoutDashboardIcon, label: "Dashboard", active: true },
  { icon: InboxIcon, label: "Inbox", badge: "4", active: false },
  { icon: UsersIcon, label: "Team", active: false },
  { icon: SettingsIcon, label: "Settings", active: false },
];

export function SidebarDemo() {
  return (
    <SidebarProvider className="h-[480px] min-h-0 overflow-hidden rounded-lg border contain-strict">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="ING Design">
                <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-bold">
                  ING
                </div>
                <span className="font-semibold">ING Design</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarInput placeholder="Search…" />
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      isActive={item.active}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Account" size="lg">
                <div className="bg-muted size-8 shrink-0 rounded-full" />
                <div className="flex flex-col text-left text-xs leading-tight">
                  <span className="font-medium">Nuno Santos</span>
                  <span className="text-muted-foreground truncate">
                    nunosantos@inginfinitive.pt
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Dashboard</span>
        </header>
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="text-muted-foreground flex flex-col items-center gap-2 text-center text-sm">
            <LayoutDashboardIcon className="size-8 opacity-30" />
            <span>Main content area</span>
            <Button variant="outline" size="sm">
              <SearchIcon />
              Browse components
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
