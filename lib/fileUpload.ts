// lib/fileUpload.ts
import axios from 'axios';

export async function uploadFile(
    type: 'images' | 'videos',
    files: FileList | null | undefined
): Promise<string[]> {
    if (!files || files.length === 0) {
        return [];
    }

    const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.url;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('File upload failed');
        }
    });

    return Promise.all(uploadPromises);
}