import "./globals.css";
import { Inter } from "next/font/google";
import ConvexClerkProvider from "./ConvexClerkProvider";
import { Toaster } from '../components/ui/toaster';

const interFont = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <body className={interFont.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ConvexClerkProvider>
  );
}

