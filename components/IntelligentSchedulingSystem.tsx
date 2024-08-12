"use client";

import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function IntelligentScheduling() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const availableSlots = useQuery(api.scheduling.getAvailableSlots, { date: selectedDate });
    const bookAppointment = useMutation(api.scheduling.bookAppointment);

    const handleBooking = async (slot) => {
        await bookAppointment({ date: selectedDate, slot });
        // Handle confirmation, perhaps send an email or SMS
    };

    return (
        <div className="space-y-4">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
            />
            <div className="grid grid-cols-3 gap-2">
                {availableSlots?.map((slot) => (
                    <Button key={slot} onClick={() => handleBooking(slot)}>
                        {slot}
                    </Button>
                ))}
            </div>
        </div>
    );
}