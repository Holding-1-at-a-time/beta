"use client";
import { Manrope } from "next/font/google";
import ConvexClerkProvider from "../providers/ConvexClerkProvider";
import { UserButton } from "clerk/nextjs";

const manrope = Manrope({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", padding: 20 }}>

      <ConvexClerkProvider>
        <UserButton />
        <html lang="en">
          <body className={`${manrope.className}`}>
            {children}
          </body>
        </html>
      </ConvexClerkProvider>
    </header> 
  );
}
