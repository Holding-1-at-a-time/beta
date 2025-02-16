// File: components/FileUploadsComponent.tsx
"use client";

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const FileUploads: React.FC = () => {
    const { setValue, formState: { errors } } = useFormContext();
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const saveFile = useMutation(api.files.saveFile);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: 'images' | 'videos') => {
        const files = event.target.files;
        if (!files) return;

        setUploadError(null);
        setUploadProgress(0);

        const uploadedFiles = [];

        for (const file of files) {
            // Validate file size and type
            if (file.size > MAX_FILE_SIZE) {
                setUploadError(`File ${file.name} is too large. Max size is 10MB.`);
                continue;
            }

            const allowedTypes = fileType === 'images' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
            if (!allowedTypes.includes(file.type)) {
                setUploadError(`File ${file.name} has an unsupported format.`);
                continue;
            }

            try {
                // Get a short-lived upload URL
                const uploadUrl = await generateUploadUrl();

                // Upload the file to the URL
                const result = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });

                if (!result.ok) {
                    throw new Error(`Upload failed with status ${result.status}`);
                }

                // Save the file in Convex
                const fileId = await saveFile({
                    storageId: result.headers.get("storageId")!,
                    fileName: file.name,
                    fileType: file.type
                });

                uploadedFiles.push(fileId);

                // Update progress
                setUploadProgress((prevProgress) => prevProgress + (100 / files.length));
            } catch (error) {
                Console.error('Upload error:', error);
                setUploadError(`Failed to upload ${file.name}. Please try again.`);
            }
        }

        // Update form value with uploaded file IDs
        setValue(fileType, uploadedFiles);
    };

    return (
        <Card>
            <CardContent className="space-y-4">
                <Label className="font-semibold text-lg">Upload Images/Videos</Label>
                <p className="text-sm text-muted-foreground">
                    Capture the current condition of your vehicle using your smartphone camera.
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                    >
                        Upload Images
                    </Button>
                    <input
                        id="image-upload"
                        type="file"
                        accept={ALLOWED_IMAGE_TYPES.join(',')}
                        multiple
                        onChange={(e) => handleFileUpload(e, 'images')}
                        className="hidden"
                    />
                    <Button
                        variant="outline"
                        onClick={() => document.getElementById('video-upload')?.click()}
                    >
                        Upload Videos
                    </Button>
                    <input
                        id="video-upload"
                        type="file"
                        accept={ALLOWED_VIDEO_TYPES.join(',')}
                        multiple
                        onChange={(e) => handleFileUpload(e, 'videos')}
                        className="hidden"
                    />
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                    <Progress value={uploadProgress} className="w-full" />
                )}
                {uploadError && (
                    <div className="flex items-center text-red-500">
                        <AlertCircle className="mr-2" />
                        <p>{uploadError}</p>
                    </div>
                )}
                {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
                {errors.videos && <p className="text-red-500 text-sm">{errors.videos.message}</p>}
            </CardContent>
        </Card>
    );
};

export default FileUploads;