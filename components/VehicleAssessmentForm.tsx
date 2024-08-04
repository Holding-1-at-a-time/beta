import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function VehicleAssessmentForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [images, setImages] = useState([]);
    const submitAssessment = useMutation(api.assessments.create);

    const onSubmit = async (data) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        images.forEach((image, index) => {
            formData.append(`image-${index}`, image);
        });

        await submitAssessment(formData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register("make", { required: true })} placeholder="Vehicle Make" />
            <Input {...register("model", { required: true })} placeholder="Vehicle Model" />
            <Input {...register("year", { required: true })} placeholder="Year" type="number" />
            <Input {...register("vin")} placeholder="VIN (optional)" />
            <Select {...register("vehicleType", { required: true })}>
                <option value="">Select Vehicle Type</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
            </Select>
            <Textarea {...register("condition")} placeholder="Describe the vehicle's condition" />
            <input
                type="file"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files))}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
            />
            <Button type="submit">Submit Assessment</Button>
        </form>
    );
}