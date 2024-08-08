import { clerkMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default clerkMiddleware({
    publicRoutes: [
        "/",
        "/api/public(.*)",
        "/auth/(.*)",
        "/pricing",
        "/about",
        "/contact",
        "/terms",
        "/privacy"
    ],

    async afterAuth(auth, req, evt) {
        const url = new URL(req.url);

        // Handle unauthenticated users
        if (!auth.userId && !auth.isPublicRoute) {
            const signInUrl = new URL('/auth/sign-in', req.url);
            signInUrl.searchParams.set('redirect_url', req.url);
            return NextResponse.redirect(signInUrl);
        }

        // Handle authenticated users
        if (auth.userId) {
            const user = auth.user;

            // Ensure user has an active organization for org-specific routes
            if (url.pathname.startsWith('/org') && !auth.orgId) {
                return new NextResponse("Organization selection required", { status: 403 });
            }

            // Fetch user's permissions if not in publicMetadata
            if (!user.publicMetadata.permissions) {
                try {
                    const userDetails = await clerkClient.users.getUser(auth.userId);
                    user.publicMetadata.permissions = userDetails.publicMetadata.permissions;
                } catch (error) {
                    console.error("Failed to fetch user permissions:", error);
                    return new NextResponse("Internal Server Error", { status: 500 });
                }
            }

            const userPermissions = user.publicMetadata.permissions as string[];

            // RBAC checks
            if (url.pathname.startsWith('/admin') && !userPermissions.includes('org:admin')) {
                return new NextResponse("Forbidden", { status: 403 });
            }

            if (url.pathname.startsWith('/dashboard') && !userPermissions.includes('org:member')) {
                return new NextResponse("Forbidden", { status: 403 });
            }

            if (url.pathname.startsWith('/appointments') && !userPermissions.includes('org:appointments:read')) {
                return new NextResponse("Forbidden", { status: 403 });
            }

            if (url.pathname.startsWith('/services') && !userPermissions.includes('org:services:read')) {
                return new NextResponse("Forbidden", { status: 403 });
            }

            // Add more route-specific checks as needed
        }
    },
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};