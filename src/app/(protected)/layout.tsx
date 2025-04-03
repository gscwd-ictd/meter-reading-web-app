import { AppSidebar } from "@mr/components/features/navigation/AppSidebar";
import { SidebarInset, SidebarProvider } from "@mr/components/ui/Sidebar";
import { type PropsWithChildren } from "react";

export default function ProtectedPageLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <SidebarProvider>
      <AppSidebar className="z-50" />
      <SidebarInset className="h-screen w-full p-5">
        <div className="h-full w-full overflow-y-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
