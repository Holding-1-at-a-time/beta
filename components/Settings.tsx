// components/Settings.tsx
import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from './Icons/Icons';
import UserRolesManagement from './settings/UserRolesManagement';
import BusinessDetails from './settings/BusinessDetails';
import ServicePackages from './settings/ServicePackages';
import NotificationPreferences from './settings/NotificationPreferences';
import IntegrationsConfig from './settings/IntegrationsConfig';
import AdvancedSettings from './settings/AdvancedSettings';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

export default function Settings() {
    const params = useParams();
    const tenantId = params.tenantsId as string;

    if (!tenantId) {
        return <div>Error: Tenant ID not found</div>;
    }

    return (
        <div className="bg-gradient-to-br from-[#00AE98] to-[#00D5B6] min-h-screen p-8">
            <Card className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md shadow-2xl shadow-[#00AE98]/50 rounded-2xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl font-bold text-white">Settings</CardTitle>
                        <CardDescription className="text-lg text-white/80">Customize your account preferences</CardDescription>
                    </div>
                    <Button variant="ghost" className="text-white hover:bg-white/10 transition-colors">
                        <SettingsIcon className="w-6 h-6" />
                    </Button>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <ErrorBoundary fallback={<div>Error loading User Roles Management</div>}>
                        <Suspense fallback={<LoadingSpinner />}>
                            <UserRolesManagement tenantId={tenantId} />
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary fallback={<div>Error loading Business Details</div>}>
                        <Suspense fallback={<LoadingSpinner />}>
                            <BusinessDetails tenantId={tenantId} />
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary fallback={<div>Error loading Service Packages</div>}>
                        <Suspense fallback={<LoadingSpinner />}>
                            <ServicePackages tenantId={tenantId} />
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary fallback={<div>Error loading Notification Preferences</div>}>
                        <Suspense fallback={<LoadingSpinner />}>
                            <NotificationPreferences tenantId={tenantId} />
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary fallback={<div>Error loading Integrations Config</div>}>
                        <Suspense fallback={<LoadingSpinner />}>
                            <IntegrationsConfig tenantId={tenantId} />
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary fallback={<div>Error loading Advanced Settings</div>}>
                        <Suspense fallback={<LoadingSpinner />}>
                            <AdvancedSettings tenantId={tenantId} />
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </Card>
        </div>
    );
}