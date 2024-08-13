import React, { useState } from 'react';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorBoundary from '@/components/ErrorBoundary';
import { uploadFile } from '@/lib/fileUpload';

const assessmentSchema = z.object({
    vehicleType: z.string().min(1, "Vehicle type is required"),
    condition: z.string().min(1, "Condition is required"),
    issues: z.string().min(1, "At least one issue is required"),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

const AssessmentForm: React.FC = () => {
    const { organization } = useOrganization();
    const { user } = useUser();
    const createAssessment = useMutation(api.assessments.createAssessment);
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AssessmentFormData>({
        resolver: zodResolver(assessmentSchema),
    });

    const onSubmit = async (data: AssessmentFormData) => {
        if (!organization || !user) {
            toast({
                title: 'Error',
                description: 'Organization or user information is missing.',
                variant: 'destructive',
            });
            return;
        }

        setUploading(true);

        try {
            const images = await uploadFile('images', filesRef.current?.files);
            const video = await uploadFile('videos', videoRef.current?.files?.[0]);

            await createAssessment({
                organizationId: organization.id,
                clientId: user.id,
                vehicleType: data.vehicleType,
                condition: data.condition,
                issues: data.issues.split(',').map(issue => issue.trim()),
                images,
                video,
            });

            toast({
                title: 'Success',
                description: 'Assessment submitted successfully.',
            });

            reset();
        } catch (error) {
            console.error('Error submitting assessment:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to submit assessment. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    const filesRef = React.useRef<HTMLInputElement>(null);
    const videoRef = React.useRef<HTMLInputElement>(null);

    return (
        <ErrorBoundary>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    {...register('vehicleType')}
                    placeholder="Vehicle Type"
                />
                {errors.vehicleType && <p className="text-red-500">{errors.vehicleType.message}</p>}

                <Input
                    {...register('condition')}
                    placeholder="Vehicle Condition"
                />
                {errors.condition && <p className="text-red-500">{errors.condition.message}</p>}

                <Textarea
                    {...register('issues')}
                    placeholder="Issues (comma-separated)"
                />
                {errors.issues && <p className="text-red-500">{errors.issues.message}</p>}

                <input
                    type="file"
                    ref={filesRef}
                    multiple
                    accept="image/*"
                />

                <input
                    type="file"
                    ref={videoRef}
                    accept="video/*"
                />

                <Button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Submit Assessment'}
                </Button>
            </form>
        </ErrorBoundary>
    );
};

export default AssessmentForm;