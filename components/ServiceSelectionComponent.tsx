// File: components/ServiceSelectionComponent.tsx

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Id } from '@/convex/_generated/dataModel';

interface Service {
    _id: Id<"services">;
    name: string;
    description: string;
    basePrice: number;
}

interface ServiceSelectionProps {
    services: Service[];
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ services }) => {
    const { register, watch, formState: { errors } } = useFormContext();
    const selectedServices = watch('selectedServices');

    const calculateTotal = () => {
        return services.reduce((total, service) => {
            if (selectedServices[service._id]) {
                return total + service.basePrice;
            }
            return total;
        }, 0);
    };

    return (
        <Card>
            <CardContent className="space-y-4">
                <Label className="font-semibold text-lg">Detailing Services</Label>
                <p className="text-sm text-muted-foreground">Select the services you would like to add to your order.</p>
                {services.map((service) => (
                    <div key={service._id} className="flex items-center space-x-2">
                        <Checkbox
                            id={service._id}
                            {...register(`selectedServices.${service._id}`)}
                            checked={selectedServices[service._id] || false}
                        />
                        <Label htmlFor={service._id} className="flex-grow">
                            {service.name} - {service.description}
                        </Label>
                        <span className="text-sm font-medium">${service.basePrice.toFixed(2)}</span>
                    </div>
                ))}
                {errors.selectedServices && (
                    <p className="text-red-500 text-sm">Please select at least one service</p>
                )}
                <div className="mt-4 text-right">
                    <strong>Total: ${calculateTotal().toFixed(2)}</strong>
                </div>
            </CardContent>
        </Card>
    );
};

export default ServiceSelection;