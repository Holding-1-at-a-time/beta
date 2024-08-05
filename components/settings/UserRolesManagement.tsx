// components/settings/UserRolesManagement.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useOrganization, useOrganizationList, useAuth } from "@clerk/nextjs";
import { Loader2 } from 'lucide-react';

type Role = {
    key: string;
    name: string;
    description: string;
};

interface UserRolesManagementProps {
    tenantId: Id<"tenants">;
}

export default function UserRolesManagement({ tenantId }: UserRolesManagementProps) {
    const { toast } = useToast();
    const { organization, isLoaded: isOrgLoaded } = useOrganization();
    const { setActive } = useOrganizationList();
    const { getToken } = useAuth();
    const [organizationRole, setOrganizationRole] = useState<string | null>(null);
    const [organizationPermissions, setOrganizationPermissions] = useState<string[]>([]);
    const [loadingRole, setLoadingRole] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const roles = useQuery(api.organizationRoles.list, { tenantId });
    const updateMemberRole = useMutation(api.organizationRoles.updateMemberRole);

    useEffect(() => {
        const fetchRoleAndPermissions = async () => {
            if (isOrgLoaded && organization) {
                const token = await getToken({ template: "convex" });
                if (token) {
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    setOrganizationRole(decodedToken.organizationRole || null);
                    setOrganizationPermissions(decodedToken.org_membership_permission?.split(',') || []);
                }
            }
        };
        fetchRoleAndPermissions();
    }, [isOrgLoaded, organization, getToken]);

    const handleRoleToggle = useCallback(async (role: Role) => {
        if (!organization || isUpdating || organizationRole !== 'org:admin') return;

        setLoadingRole(role.key);
        setIsUpdating(true);

        try {
            const isActive = !organizationPermissions.includes(role.key);
            await updateMemberRole({
                tenantId,
                organizationId: organization.id,
                role: role.key,
                isActive,
            });

            setOrganizationPermissions(prev =>
                isActive ? [...prev, role.key] : prev.filter(p => p !== role.key)
            );

            toast({
                title: "Success",
                description: `Role "${role.name}" has been ${isActive ? 'added' : 'removed'}.`,
            });
        } catch (error) {
            console.error('Error updating role:', error);
            toast({
                title: "Error",
                description: "Failed to update role. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoadingRole(null);
            setIsUpdating(false);
        }
    }, [organization, organizationRole, organizationPermissions, tenantId, updateMemberRole, toast, isUpdating]);

    const handleManageOrganization = useCallback(() => {
        if (organization) {
            setActive({ organization: organization.id });
        }
    }, [organization, setActive]);

    if (!isOrgLoaded || roles === undefined) {
        return (
            <Card className="bg-white/10 backdrop-blur-md shadow-lg shadow-[#00AE98]/30 rounded-2xl overflow-hidden">
                <CardContent className="p-6 flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                </CardContent>
            </Card>
        );
    }

    if (!organization) {
        return (
            <Card className="bg-white/10 backdrop-blur-md shadow-lg shadow-[#00AE98]/30 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                    <p className="text-white text-center">No organization selected.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white/10 backdrop-blur-md shadow-lg shadow-[#00AE98]/30 rounded-2xl overflow-hidden">
            <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>Manage user access and permissions</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                {roles.map((role) => (
                    <div key={role.key} className="flex items-center justify-between mb-4">
                        <div>
                            <Label htmlFor={`role-${role.key}`} className="text-lg font-medium text-white">
                                {role.name}
                            </Label>
                            <p className="text-sm text-white/80">{role.description}</p>
                        </div>
                        <Switch
                            id={`role-${role.key}`}
                            checked={organizationPermissions.includes(role.key)}
                            onCheckedChange={() => handleRoleToggle(role)}
                            disabled={loadingRole === role.key || isUpdating || organizationRole !== 'org:admin'}
                            aria-label={`Toggle ${role.name} role`}
                        />
                    </div>
                ))}
                <Button
                    onClick={handleManageOrganization}
                    className="mt-4 w-full"
                    disabled={isUpdating}
                >
                    Manage Organization in Clerk
                </Button>
            </CardContent>
        </Card>
    );
}