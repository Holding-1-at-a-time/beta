import React from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function EstimatesList() {
    const [estimates, setEstimates] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

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

    React.useEffect(() => {
        const fetchEstimates = async () => {
            try {
                const data = await api.estimates.list();
                setEstimates(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchEstimates();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            {estimates.map((estimate) => (
                <div key={estimate.id}>
                    <h2>{estimate.title}</h2>
                    <p>{estimate.description}</p>
                    <button onClick={() => handleApprove(estimate.id)}>Approve</button>
                    <button onClick={() => handleDecline(estimate.id)}>Decline</button>
                    <button onClick={() => handleConvert(estimate.id)}>Convert to Invoice</button>
                    <button onClick={() => handleRevise(estimate.id)}>Revise</button>
                    {estimates.map((estimate) => (
                        <div key={estimate.id}>
                            {estimate.loading ? (
                                <div>Loading...</div>
                            ) : estimate.error ? (
                                <div>Error: {estimate.error.message}</div>
                            ) : (
                                <>
                                    <h2>{estimate.title}</h2>
                                    <p>{estimate.description}</p>
                                    <button onClick={() => handleApprove(estimate.id)}>Approve</button>
                                    <button onClick={() => handleDecline(estimate.id)}>Decline</button>
                                    <button onClick={() => handleConvert(estimate.id)}>Convert to Invoice</button>
                                    <button onClick={() => handleRevise(estimate.id)}>Revise</button>
                                </>
                            )}
                        </div>
                    ))}
                    {estimate.loading ? (
                        <div>Loading...</div>
                    ) : estimate.error ? (
                        <div>Error: {estimate.error.message}</div>
                    ) : (
                        <>
                            <h2>{estimate.title}</h2>
                            <p>{estimate.description}</p>
                            <button onClick={() => handleApprove(estimate.id)}>Approve</button>
                            <button onClick={() => handleDecline(estimate.id)}>Decline</button>
                            <button onClick={() => handleConvert(estimate.id)}>Convert to Invoice</button>
                            <button onClick={() => handleRevise(estimate.id)}>Revise</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}