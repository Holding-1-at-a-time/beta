// File: components/AppointmentsCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Appointment {
    _id: string;
    date: string;
    service: string;
    client: string;
    depositPaid: boolean;
}

interface AppointmentsCardProps {
    appointments: Appointment[];
}

export default function AppointmentsCard({ appointments }: Readonly =  AppointmentsCardProps) {
    const upcomingCount = appointments.length;
    const depositPaidCount = appointments.filter(a => a.depositPaid).length;

    return (
        <Card className="bg-[#00AE98] text-primary-foreground shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>View and manage your upcoming appointments.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="font-semibold">Upcoming</div>
                        <div className="text-4xl font-bold">{upcomingCount}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="font-semibold">Deposit Paid</div>
                        <div className="text-4xl font-bold">{depositPaidCount}</div>
                    </div>
                </div>
                {appointments[0] && (
                    <div className="mt-4 grid grid-cols-2 gap-4 text-black">
                        <div>
                            <div className="font-semibold">Booked Date</div>
                            <div>{new Date(appointments[0].date).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Service</div>
                            <div>{appointments[0].service}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Client</div>
                            <div>{appointments[0].client}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Deposit Paid</div>
                            <div className="text-black">{appointments[0].depositPaid ? 'Yes' : 'No'}</div>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button size="sm">View Appointments</Button>
            </CardFooter>
        </Card>
    );
}