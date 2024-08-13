// app/ConvexClerkProvider.tsx
import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider } from "@clerk/nextjs";

const convexURL = process.env.NEXT_PUBLIC_CONVEX_URL!;
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const convexClient = new ConvexReactClient(convexURL);

export function ConvexClerkProvider({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider publishableKey={clerkPublishableKey}>
            <ConvexProviderWithClerk client={convexClient}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
