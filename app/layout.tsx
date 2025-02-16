"use client";
import { Manrope } from "next/font/google";
import ConvexClerkProvider from "../providers/ConvexClerkProvider";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const manrope = Manrope({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <head>
      {(process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview") && (
        // eslint-disable-next-line @next/next/no-sync-scripts
        <script
          data-project-id="aUG31xxAN4sSBo9ff7eObKGFbkuu0QUlYEVMA8k8"
          data-is-production-environment="false"
          src="https://snippet.meticulous.ai/v1/meticulous.js"
        />
      )}
      <ConvexClerkProvider>
        <Analytics />
        <SpeedInsights />

        <html lang="en">
          <body className={`${manrope.className}`}>
            {children}
          </body>
        </html>
      </ConvexClerkProvider>
    </head>
  );
}
