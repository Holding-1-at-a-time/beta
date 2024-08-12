// File: src/components/RecentEstimatesInvoices.tsx

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Pagination } from "@/components/ui/pagination";
import { useTenantContext } from "@/contexts/TenantContext";

interface Estimate {
    _id: string;
    number: string;
    clientName: string;
    total: number;
    status: 'pending' | 'approved' | 'declined';
    createdAt: number;
}

interface Invoice {
    _id: string;
    number: string;
    clientName: string;
    total: number;
    status: 'paid' | 'unpaid' | 'overdue';
    dueDate: number;
}

const EstimateCard: React.FC<{ estimate: Estimate }> = ({ estimate }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex justify-between">
                <span>Estimate #{estimate.number}</span>
                <Badge>{estimate.status}</Badge>
            </CardTitle>
            <CardDescription>{estimate.clientName}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold">${estimate.total.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
                Created on {new Date(estimate.createdAt).toLocaleDateString()}
            </p>
        </CardContent>
        <CardFooter>
            <Button className="w-full">View Details</Button>
        </CardFooter>
    </Card>
);

const InvoiceCard: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex justify-between">
                <span>Invoice #{invoice.number}</span>
                <Badge>{invoice.status}</Badge>
            </CardTitle>
            <CardDescription>{invoice.clientName}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold">${invoice.total.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
                Due on {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
        </CardContent>
        <CardFooter>
            <Button className="w-full">View Details</Button>
        </CardFooter>
    </Card>
);

const RecentEstimatesInvoices: React.FC = () => {
    const { tenant } = useTenantContext();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'estimates' | 'invoices'>('estimates');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 6;
    const estimatesQuery = useQuery(api.estimates.listRecent, tenant ? {
        tenantId: tenant._id,
        page,
        pageSize: PAGE_SIZE
    } : null);
    const invoicesQuery = useQuery(api.invoices.listRecent, tenant ? {
        tenantId: tenant._id,
        page,
        pageSize: PAGE_SIZE
    } : null);
    const [estimates, setEstimates] = useState<Estimate[] | undefined>(undefined);
    const [invoices, setInvoices] = useState<Invoice[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const totalPages = useMemo(() => {
        if (activeTab === 'estimates') return estimatesQuery?.totalCount ? Math.ceil(estimatesQuery.totalCount / PAGE_SIZE) : 1;
        return invoicesQuery?.totalCount ? Math.ceil(invoicesQuery.totalCount / PAGE_SIZE) : 1;
    }, [activeTab, estimatesQuery, invoicesQuery, PAGE_SIZE]);

    useEffect(() => {
        const fetchData = async () => {
            if (estimatesQuery && !(estimatesQuery instanceof Error)) {
                setEstimates(estimatesQuery.items);
            }
            if (invoicesQuery && !(invoicesQuery instanceof Error)) {
                setInvoices(invoicesQuery.items);
            }
            setIsLoading(false);
            if (estimatesQuery instanceof Error || invoicesQuery instanceof Error) {
                setError(true);
            }
        };
        fetchData();
    }, [estimatesQuery, invoicesQuery]);

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: "Failed to fetch data. Please try again.",
                variant: "destructive",
            });
        }
    }, [error, toast]);

    const renderContent = (items: Estimate[] | Invoice[] | undefined, cardComponent: React.FC<CardProps>) => {
        if (isLoading) {
            return Array.from({ length: PAGE_SIZE }).map((_, invoice) => (
                <Skeleton key={invoiceId} className="h-[200px] w-full" />
            ));
        }

        if (!items || items.length === 0) {
            return (
                <Alert>
                    <AlertTitle>No data</AlertTitle>
                    <AlertDescription>No {activeTab} found.</AlertDescription>
                </Alert>
            );
        }

        return items.map((item) => (
            React.createElement(cardComponent, { key: item._id, [activeTab.slice(0, -1)]: item })
        ));
    };

    return (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'estimates' | 'invoices')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="estimates">Recent Estimates</TabsTrigger>
                <TabsTrigger value="invoices">Recent Invoices</TabsTrigger>
            </TabsList>
            <TabsContent value="estimates">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {renderContent(estimates, EstimateCard)}
                </div>
            </TabsContent>
            <TabsContent value="invoices">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {renderContent(invoices, InvoiceCard)}
                </div>
            </TabsContent>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </Tabs>
    )
};
const RecentEstimatesInvoices: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'estimates' | 'invoices'>('estimates');
    const [page, setPage] = useState(1);
    const { tenant } = useTenantContext();
    const { toast } = useToast();

    const PAGE_SIZE = 6;

    const estimatesQuery = useQuery(api.estimates.listRecent, tenant ? {
        tenantId: tenant._id,
        page,
        pageSize: PAGE_SIZE
    } : null);

    const invoicesQuery = useQuery(api.invoices.listRecent, tenant ? {
        tenantId: tenant._id,
        page,
        pageSize: PAGE_SIZE
    } : null);

    const isLoading = estimatesQuery === undefined || invoicesQuery === undefined;
    const error = estimatesQuery instanceof Error ? estimatesQuery : invoicesQuery instanceof Error ? invoicesQuery : null;

    const estimates = estimatesQuery && !(estimatesQuery instanceof Error) ? estimatesQuery.items : [];
    const invoices = invoicesQuery && !(invoicesQuery instanceof Error) ? invoicesQuery.items : [];

    let totalPages;
    if (activeTab === 'estimates') {
        if (estimatesQuery && !(estimatesQuery instanceof Error)) {
            totalPages = Math.ceil(estimatesQuery.totalCount / PAGE_SIZE);
        } else {
            totalPages = 1;
        }
    } else {
        if (invoicesQuery && !(invoicesQuery instanceof Error)) {
            totalPages = Math.ceil(invoicesQuery.totalCount / PAGE_SIZE);
        } else {
            totalPages = 1;
        }
    }
    const totalPages = activeTab === 'estimates'
        ? estimatesQuery && !(estimatesQuery instanceof Error)
            ? Math.ceil(estimatesQuery.totalCount / PAGE_SIZE)
            : 1
        : invoicesQuery && !(invoicesQuery instanceof Error)
            ? Math.ceil(invoicesQuery.totalCount / PAGE_SIZE)
            : 1;

    if (error) {
        toast({
            title: "Error",
            description: "Failed to fetch data. Please try again.",
            variant: "destructive",
        });
    }

    const renderContent = (items: Estimate[] | Invoice[], cardComponent: React.FC<CardProps>) => {
        if (isLoading) {
            return Array.from({ length: PAGE_SIZE }).map((_, invoice) => (
                <Skeleton key={invoiceId} className="h-[200px] w-full" />
            ));
        }

        if (items.length === 0) {
            return (
                <Alert>
                    <AlertTitle>No data</AlertTitle>
                    <AlertDescription>No {activeTab} found.</AlertDescription>
                </Alert>
            );
        }

        return items.map((item) => (
            React.createElement(cardComponent, { key: item._id, [activeTab.slice(0, -1)]: item })
        ));
    };

    return (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'estimates' | 'invoices')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="estimates">Recent Estimates</TabsTrigger>
                <TabsTrigger value="invoices">Recent Invoices</TabsTrigger>
            </TabsList>
            <TabsContent value="estimates">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {renderContent(estimates, EstimateCard)}
                </div>
            </TabsContent>
            <TabsContent value="invoices">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {renderContent(invoices, InvoiceCard)}
                </div>
            </TabsContent>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </Tabs>
    )
};
