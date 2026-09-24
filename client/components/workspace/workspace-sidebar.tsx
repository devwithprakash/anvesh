"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  ChatCircleIcon,
  BookOpenIcon,
  SignOutIcon,
  GearIcon,
  HouseIcon,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppState } from "@/components/providers/app-provider";
import { CreateWorkspaceDialog } from "@/components/workspace/workspace-dialog";

interface WorkspaceSidebarProps {
  activeWorkspaceId?: string;
}

export function WorkspaceSidebar({ activeWorkspaceId }: WorkspaceSidebarProps) {
  const router = useRouter();
  const { workspaces } = useAppState();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon">
        {/* Header */}
        <SidebarHeader>
          <div className="flex items-center gap-2 px-1 py-1">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              N
            </div>
            <span className="font-heading font-semibold text-sm truncate group-data-[collapsible=icon]:hidden">
              Anvesh
            </span>
            <div className="ml-auto group-data-[collapsible=icon]:hidden">
              <SidebarTrigger className="size-6" />
            </div>
          </div>
        </SidebarHeader>

        <SidebarSeparator />

        {/* Navigation */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<button onClick={() => router.push("/dashboard")} />}
                  tooltip="Home"
                  isActive={!activeWorkspaceId}
                >
                  <HouseIcon />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Workspaces */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between pr-1">
              <span>Workspaces</span>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={() => setCreateOpen(true)}
                      className="flex size-4 items-center justify-center rounded-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:hidden"
                    />
                  }
                >
                  <PlusIcon className="size-3" />
                </TooltipTrigger>
                <TooltipContent side="right">New Workspace</TooltipContent>
              </Tooltip>
            </SidebarGroupLabel>

            <SidebarMenu>
              {workspaces.map((ws) => (
                <SidebarMenuItem key={ws.id}>
                  <SidebarMenuButton
                    render={
                      <button onClick={() => router.push(`/workspace/${ws.id}`)} />
                    }
                    tooltip={ws.title}
                    isActive={activeWorkspaceId === ws.id}
                    size="default"
                  >
                    <span className="text-base leading-none">{ws.icon}</span>
                    <span className="truncate">{ws.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Add new workspace (icon mode) */}
              <SidebarMenuItem className="group-data-[collapsible=icon]:block hidden">
                <SidebarMenuButton
                  render={<button onClick={() => setCreateOpen(true)} />}
                  tooltip="New Workspace"
                >
                  <PlusIcon />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer - User */}
        <SidebarSeparator />
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-open:bg-sidebar-accent"
                    />
                  }
                >
                  <Avatar size="sm">
                    <AvatarImage src="" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-xs group-data-[collapsible=icon]:hidden">
                    <span className="font-medium leading-tight">John Doe</span>
                    <span className="text-muted-foreground leading-tight truncate max-w-32">
                      john@example.com
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-52">
                  <DropdownMenuItem>
                    <GearIcon className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => router.push("/login")}
                  >
                    <SignOutIcon className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
