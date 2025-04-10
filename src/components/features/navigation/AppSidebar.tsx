"use client";

import * as React from "react";
import { NavMain, NavSecondary } from "./NavItems";
import { mainNav, secondaryNav, teams, user } from "./items";
import { NavUser } from "./NavUser";
import { TeamSwitcher } from "./TeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@mr/components/ui/Sidebar";

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <NavMain items={mainNav} />
        <NavSecondary items={secondaryNav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
