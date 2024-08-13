import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface VideoUploaderProps {
    onUpload: (videoUrl: string) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onUpload }) => {
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            // Here, you would typically upload the file to your server or a cloud storage service
            // For this example, we'll simulate an upload by creating an object URL
            const uploadedUrl = URL.createObjectURL(file);

            onUpload(uploadedUrl);
            toast({
                title: 'Success',
                description: 'Video uploaded successfully.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to upload video. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="video-upload"
            />
            <Button
                as="label"
                htmlFor="video-upload"
                disabled={uploading}
            >
                {uploading ? 'Uploading...' : 'Upload Video'}
            </Button>
        </div>
    );
};

export default VideoUploader;