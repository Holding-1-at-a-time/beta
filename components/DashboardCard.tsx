// File: components/DashboardCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stat {
    id: string; // Add a unique identifier
    label: string;
    value: number | string;
}

interface DashboardCardProps {
    title: string;
    description: string;
    stats: ReadonlyArray<Stat>;
    action: string;
}

export default function DashboardCard({ title, description, stats, action }:ReadOnly =  DashboardCardProps) {
    return (
        <Card className="bg-[#00AE98] text-primary-foreground shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.id} className="flex flex-col gap-2">
                            <div className="font-semibold">{stat.label}</div>
                            <div className="text-4xl font-bold">{stat.value}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button size="sm">{action}</Button>
            </CardFooter>
        </Card>
    );
}