import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingJustificationTool({ services }) {
    const totalCost = services.reduce((total, service) => total + service.price, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Service Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                {services.map((service, index) => (
                    <div key={index} className="flex justify-between py-2">
                        <span>{service.name}</span>
                        <span>${service.price.toFixed(2)}</span>
                    </div>
                ))}
                <div className="flex justify-between py-2 font-bold border-t mt-2">
                    <span>Total</span>
                    <span>${totalCost.toFixed(2)}</span>
                </div>
            </CardContent>
        </Card>
    );
}