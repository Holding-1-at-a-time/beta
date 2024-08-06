// components/settings/BusinessDetails.tsx
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const businessDetailsSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    address: z.string().min(1, "Address is required"),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
});

type BusinessDetailsForm = z.infer<typeof businessDetailsSchema>;

interface BusinessDetailsProps {
    tenantId: Id<"tenants">;
}

export default function BusinessDetails({ tenantId }: BusinessDetailsProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const businessDetails = useQuery(api.tenants.getBusinessDetails, { tenantId });
    const updateBusinessDetails = useMutation(api.tenants.updateBusinessDetails);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BusinessDetailsForm>({
        resolver: zodResolver(businessDetailsSchema),
        defaultValues: businessDetails || {
            companyName: '',
            address: '',
            phoneNumber: '',
        },
    });

    const onSubmit = async (data: BusinessDetailsForm) => {
        setIsSubmitting(true);
        try {
            await updateBusinessDetails({ tenantId, ...data });
            toast({
                title: "Success",
                description: "Business details updated successfully",
            });
        } catch (error) {
            Console.error('Error updating business details:', error);
            toast({
                title: "Error",
                description: "Failed to update business details. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (businessDetails === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="bg-white/10 backdrop-blur-md shadow-lg shadow-[#00AE98]/30 rounded-2xl overflow-hidden">
            <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>Update your company information</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="companyName" className="text-white">Company Name</Label>
                        <Input
                            id="companyName"
                            {...register('companyName')}
                            className="bg-white/20 text-white placeholder:text-white/60 focus:ring-[#00AE98] focus:border-[#00AE98]"
                        />
                        {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="address" className="text-white">Address</Label>
                        <Textarea
                            id="address"
                            {...register('address')}
                            className="bg-white/20 text-white placeholder:text-white/60 focus:ring-[#00AE98] focus:border-[#00AE98]"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            {...register('phoneNumber')}
                            className="bg-white/20 text-white placeholder:text-white/60 focus:ring-[#00AE98] focus:border-[#00AE98]"
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                    </div>
                    <div className="flex justify-between">
                        <Button type="button" onClick={() => reset()} variant="outline" disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}