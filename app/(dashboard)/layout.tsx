import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-[calc(100vh-4.5rem)] flex-col bg-muted/30 lg:flex-row">
            <DashboardSidebar />

            <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
                <DashboardHeader />

                {children}
            </main>
        </div>
    );
}