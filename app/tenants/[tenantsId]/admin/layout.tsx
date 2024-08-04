// File: app/tenant/[tenantId]/admin/layout.tsx
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

// File: app/tenant/[tenantId]/admin/page.tsx
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminHomePage() {
    return <AdminDashboard />;
}

// File: app/tenant/[tenantId]/admin/users/page.tsx
import { UserManagement } from '@/components/admin/UserManagement';

export default function UserManagementPage() {
    return <UserManagement />;
}

// File: app/tenant/[tenantId]/admin/settings/page.tsx
import { TenantSettings } from '@/components/admin/TenantSettings';

export default function SettingsPage() {
    return <TenantSettings />;
}

// File: app/tenant/[tenantId]/admin/services/page.tsx
import { ServiceManagement } from '@/components/admin/ServiceManagement';

export default function ServiceManagementPage() {
    return <ServiceManagement />;
}

// File: app/tenant/[tenantId]/admin/reports/page.tsx
import { ReportsAndAnalytics } from '@/components/admin/ReportsAndAnalytics';

export default function ReportsPage() {
    return <ReportsAndAnalytics />;
}

// File: app/tenant/[tenantId]/admin/messages/page.tsx
import { MessagingSystem } from '@/components/admin/MessagingSystem';

export default function MessagingPage() {
    return <MessagingSystem />;
}