// components/settings/ServicePackages.tsx
import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const packageSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Package name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be non-negative"),
});

const servicePackagesSchema = z.object({
    packages: z.array(packageSchema),
});

type ServicePackagesForm = z.infer<typeof servicePackagesSchema>;

interface ServicePackagesProps {
    tenantId: Id<"tenants">;
}

export default function ServicePackages({ tenantId }: ServicePackagesProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const servicePackages = useQuery(api.servicePackages.list, { tenantId });
    const updateServicePackages = useMutation(api.servicePackages.update);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ServicePackagesForm>({
        resolver: zodResolver(servicePackagesSchema),
        defaultValues: { packages: servicePackages || [] },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "packages",
    });
    
    const onSubmit = async (data: ServicePackagesForm) => {
        setIsSubmitting(true);
        try {
            await updateServicePackages({ tenantId, packages: data.packages });
            toast({
                title: "Success",
                description: "Service packages updated successfully",
            });
        } catch (error) {
            Console.error('Error updating service packages:', error);
            toast({
                title: "Error",
                description: "Failed to update service packages. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (servicePackages === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="bg-white/10 backdrop-blur-md shadow-lg shadow-[#00AE98]/30 rounded-2xl overflow-hidden">
            <CardHeader>
                <CardTitle>Service Packages</CardTitle>
                <CardDescription>Configure your service offerings</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4 p-4 border border-white/20 rounded-lg">
                            <div>
                                <Label htmlFor={`packages.${index}.name`} className="text-white">Package Name</Label>
                                <Input
                                    id={`packages.${index}.name`}
                                    {...register(`packages.${index}.name`)}
                                    className="bg-white/20 text-white placeholder:text-white/60 focus:ring-[#00AE98] focus:border-[#00AE98]"
                                />
                                {errors.packages?.[index]?.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.packages[index]?.name?.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor={`packages.${index}.description`} className="text-white">Description</Label>
                                <Textarea
                                    id={`packages.${index}.description`}
                                    {...register(`packages.${index}.description`)}
                                    className="bg-white/20 text-white placeholder:text-white/60 focus:ring-[#00AE98] focus:border-[#00AE98]"
                                />
                                {errors.packages?.[index]?.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.packages[index]?.description?.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor={`packages.${index}.price`} className="text-white">Price</Label>
                                <Input
                                    id={`packages.${index}.price`}
                                    type="number"
                                    step="0.01"
                                    {...register(`packages.${index}.price`, { valueAsNumber: true })}
                                    className="bg-white/20 text-white placeholder:text-white/60 focus:ring-[#00AE98] focus:border-[#00AE98]"
                                />
                                {errors.packages?.[index]?.price && (
                                    <p className="text-red-500 text-sm mt-1">{errors.packages[index]?.price?.message}</p>
                                )}
                            </div>
                            <Button type="button" onClick={() => remove(index)} variant="destructive">
                                Remove Package
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        onClick={() => append({ name: '', description: '', price: 0 })}
                        variant="outline"
                    >
                        Add Package
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}