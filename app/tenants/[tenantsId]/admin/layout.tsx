// File: app/tenant/[tenantId]/admin/layout.tsx
import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { ReceiptIcon } from '@/components/Icons/Icons';

export default function AdminLayout({ children }: Readonly = { children: React.ReactNode }) {
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

            <body>
        <div className="flex flex-col min-h-screen font-geistSans">
            <header className="bg-[#00AE98] text-primary-foreground py-4 px-6 shadow-lg">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-2 font-geistMono font-semibold">
                        <ReceiptIcon className="h-6 w-6" />
                        <span>Slick Solutions</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link href="/admin/estimates" className="hover:underline">Estimates</Link>
                        <Link href="/admin/invoices" className="hover:underline">Invoices</Link>
                        <Link href="/admin/transactions" className="hover:underline">Transactions</Link>
                        <Link href="/admin/appointments" className="hover:underline">Appointments</Link>
                        <Link href="/admin/settings" className="hover:underline">Settings</Link>
                        <UserButton />
                    </nav>
                </div>
            </header>
            <main className="flex-1 py-8 px-6">
                {children}
            </main>
        </div>
        </body>
        </head>
    );
}