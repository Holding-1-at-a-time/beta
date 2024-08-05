// components/settings/UserRolesManagement.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function UserRolesManagement() {
    return (
        <Card className="bg-white/10 backdrop-blur-md shadow-lg shadow-[#00AE98]/30 rounded-2xl overflow-hidden">
            <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>Manage user access and permissions</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-medium text-white">Admin</h3>
                        <p className="text-sm text-white/80">Full access to all features</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-medium text-white">Manager</h3>
                        <p className="text-sm text-white/80">Manage users and settings</p>
                    </div>
                    <Switch />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-white">User</h3>
                        <p className="text-sm text-white/80">View and use basic features</p>
                    </div>
                    <Switch />
                </div>
            </CardContent>
        </Card>
    )
}