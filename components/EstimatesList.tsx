import React from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

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
        updateStatus({ id, status: 'revised' });
    };
}