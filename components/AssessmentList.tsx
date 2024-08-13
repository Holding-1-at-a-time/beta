"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useOrganization, useUser } from '@clerk/nextjs';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useToast } from '@/components/ui/use-toast';

const ITEMS_PER_PAGE = 10;

const AssessmentList: React.FC = () => {
    const { organization } = useOrganization();
    const { user } = useUser();
    const { toast } = useToast();
    const [status, setStatus] = useState<"pending" | "in_progress" | "completed" | undefined>(undefined);
    const [cursor, setCursor] = useState<string | undefined>(undefined);

    const assessments = useQuery(api.assessments.getAssessments,
        organization
            ? { organizationId: organization.id, status, limit: ITEMS_PER_PAGE, cursor }
            : 'skip'
    );

    const updateAssessmentStatus = useMutation(api.assessments.updateAssessmentStatus);

    if (!organization || !user) {
        return <p>You need to be part of an organization to view assessments.</p>;
    }

    if (assessments === undefined) {
        return <p>Loading assessments...</p>;
    }

    const handleStatusChange = async (assessmentId: string, newStatus: "pending" | "in_progress" | "completed") => {
        try {
            await updateAssessmentStatus({ assessmentId, status: newStatus });
            toast({
                title: 'Success',
                description: 'Assessment status updated successfully.',
            });
        } catch (error) {
            console.error('Error updating assessment status:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update assessment status. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <ErrorBoundary>
            <div className="space-y-4">
                <Select onValueChange={(value) => setStatus(value as any)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>

                {assessments.length === 0 ? (
                    <p>No assessments found.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {assessments.map((assessment) => (
                            <Card key={assessment._id}>
                                <CardHeader>
                                    <CardTitle>{assessment.vehicleType}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p><strong>Condition:</strong> {assessment.condition}</p>
                                    <p><strong>Issues:</strong> {assessment.issues.join(', ')}</p>
                                    <p><strong>Status:</strong> {assessment.status}</p>
                                    <Select
                                        onValueChange={(value) => handleStatusChange(assessment._id, value as any)}
                                        defaultValue={assessment.status}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Update status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {assessments.length === ITEMS_PER_PAGE && (
                    <Button onClick={() => setCursor(assessments[assessments.length - 1]._id)}>
                        Load More
                    </Button>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default AssessmentList;