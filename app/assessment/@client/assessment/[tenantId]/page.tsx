import React from 'react';
import { SignedIn, SignedOut, useOrganization } from '@clerk/nextjs';
import AssessmentForm from '@/components/AssessmentForm';
import AssessmentList from '@/components/AssessmentList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useToast } from '@/components/ui/use-toast';

const AssessmentPage: React.FC = () => {
    const { organization } = useOrganization();
    const { toast } = useToast();

    if (!organization) {
        toast({
            title: 'Error',
            description: 'You need to be part of an organization to access assessments.',
            variant: 'destructive',
        });
        return null;
    }

    return (
        <SignedIn>
            <ErrorBoundary>
                <SignedOut />
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Vehicle Assessments</h1>
                    <Tabs defaultValue="new">
                        <TabsList>
                            <TabsTrigger value="new">New Assessment</TabsTrigger>
                            <TabsTrigger value="list">View Assessments</TabsTrigger>
                        </TabsList>
                        <TabsContent value="new">
                            <AssessmentForm />
                        </TabsContent>
                        <TabsContent value="list">
                            <AssessmentList />
                        </TabsContent>
                    </Tabs>
                </div>
            </ErrorBoundary>
        </SignedIn>
    );
};

export default AssessmentPage;