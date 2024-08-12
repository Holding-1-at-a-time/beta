// File: app/page.tsx
"use client";

import { Suspense } from 'react';
import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardCard from '@/components/Dashboard/DashboardCard';
import AppointmentsCard from '@/components/AppointmentsCard';
import EstimateCard from '@/components/EstimateCard';
import InvoiceCard from '@/components/InvoiceCard';
import { ReceiptIcon } from '@/components/Icons/Icons';

export default function AdminDashboard() {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}

function Dashboard() {
  const estimates = useQuery(api.estimates.listEstimates) || [];
  const invoices = useQuery(api.invoices.listInvoices) || [];
  const appointments = useQuery(api.appointments.listAppointments) || [];
  const transactions = useQuery(api.transactions.getSummary) || { deposits: 0, payments: 0, refunds: 0, total: 0 };

  // Helper function to safely format numbers
  const formatCurrency = (value: number | undefined) => {
    return typeof value === 'number' ? `$${value.toFixed(2)}` : '$0.00';
  };

  return (
    <div className="flex flex-col min-h-screen font-geistSans">
      <header className="bg-[#00AE98] text-primary-foreground py-4 px-6 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-geistMono font-semibold">
            <ReceiptIcon className="h-6 w-6" />
            <span>Slick Solutions</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/estimates" className="hover:underline">Estimates</Link>
            <Link href="/invoices" className="hover:underline">Invoices</Link>
            <Link href="/transactions" className="hover:underline">Transactions</Link>
            <Link href="/appointments" className="hover:underline">Appointments</Link>
            <Link href="/settings" className="hover:underline">Settings</Link>
            <Button variant="secondary" size="sm">New Estimate</Button>
            <UserButton />
          </nav>
        </div>
      </header>
      <main className="flex-1 py-8 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard
            title="Estimates"
            description="Create and manage estimates for your clients."
            stats={[
              { label: "Pending", value: estimates.filter(e => e.status === 'pending').length },
              { label: "Approved", value: estimates.filter(e => e.status === 'approved').length },
              { label: "Declined", value: estimates.filter(e => e.status === 'declined').length },
              { label: "Total", value: estimates.length }
            ]}
            action="Create Estimate"
          />
          <DashboardCard
            title="Invoices"
            description="Manage your invoices and get paid faster."
            stats={[
              { label: "Unpaid", value: invoices.filter(i => i.status === 'unpaid').length },
              { label: "Paid", value: invoices.filter(i => i.status === 'paid').length },
              { label: "Overdue", value: invoices.filter(i => i.status === 'overdue').length },
              { label: "Total", value: invoices.length }
            ]}
            action="Create Invoice"
          />
          <DashboardCard
            title="Transactions"
            description="View and manage your financial transactions."
            stats={[
              { label: "Deposits", value: formatCurrency(transactions.deposits) },
              { label: "Payments", value: formatCurrency(transactions.payments) },
              { label: "Refunds", value: formatCurrency(transactions.refunds) },
              { label: "Total", value: formatCurrency(transactions.total) }
            ]}
            action="View Transactions"
          />
          <AppointmentsCard appointments={appointments} />
        </div>
        <div className="container mx-auto mt-8">
          <Tabs defaultValue="estimates">
            <TabsList className="border-b border-[#00AE98]">
              <TabsTrigger value="estimates">Estimates</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </TabsList>
            <TabsContent value="estimates">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {estimates.slice(0, 3).map((estimate) => (
                  <EstimateCard key={estimate._id} estimate={estimate} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="invoices">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {invoices.slice(0, 3).map((invoice) => (
                  <InvoiceCard key={invoice._id} invoice={invoice} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}