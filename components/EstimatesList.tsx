import React from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import EstimateCard from './EstimateCard';

export default function EstimatesList() {
    const estimates = useQuery(api.estimates.list);
    const updateStatus = useMutation(api.estimates.updateStatus);
    const convertToInvoice = useMutation(api.estimates.convertToInvoice);

    const handleApprove = (id: string) => {
        updateStatus({ id, status: 'approved' });
    };

    const handleDecline = (id: string) => {
        updateStatus({ id, status: 'declined' });
    };

    const handleConvert = (id: string) => {
        convertToInvoice({ id });
    };

    const handleRevise = (id: string) => {
        // Revise the estimate by updating its status to 'revised' in the Convex database
        updateStatus({ id, status: 'revised' });
    };
    };

    if (!estimates) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            {estimates.map(estimate => (
                <EstimateCard
                    key={estimate._id}
                    estimate={estimate}
                    onApprove={handleApprove}
                    onDecline={handleDecline}
                    onConvert={handleConvert}
                    onRevise={handleRevise}
                />
            ))}
        </div>
    );
}