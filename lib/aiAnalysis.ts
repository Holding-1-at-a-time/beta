import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function analyzeImages(images: string[]): Promise<string> {
    try {
        const responses = await Promise.all(images.map(image =>
            openai.createImageAnalysis({
                image: image,
                model: "gpt-4-vision-preview",
                max_tokens: 300,
            })
        ));

        const analyses = responses.map(response => response.data.choices[0].text);
        return analyses.join('\n\n');
    } catch (error) {
        console.error('Error analyzing images:', error);
        throw new Error('Failed to analyze images');
    }
}