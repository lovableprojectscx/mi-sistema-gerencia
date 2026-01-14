import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-secondary/20">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 border-b border-border bg-background flex items-center gap-4">
                        <SidebarTrigger />
                        <div className="w-10 h-10 flex items-center justify-center">
                            <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="font-semibold text-lg">Panel de Administración</h1>
                    </div>
                    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
                <Toaster />
            </div>
        </SidebarProvider>
    );
}
