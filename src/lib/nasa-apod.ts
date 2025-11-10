import { z } from 'zod';

const ApodSchema = z.object({
  copyright: z.string().optional(),
  date: z.string(),
  explanation: z.string(),
  hdurl: z.string().optional(),
  media_type: z.enum(['image', 'video']),
  service_version: z.string(),
  title: z.string(),
  url: z.string(),
});

export type ApodData = z.infer<typeof ApodSchema>;
export type ApodResponse = ApodData | { code: number; msg: string };

export async function fetchApod(date: string): Promise<ApodResponse> {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });

    const text = await response.text();
    if (!response.ok) {
      console.error('NASA API Error:', response.status, text);
      return {
        code: response.status,
        msg: `API request failed with status ${response.status}: ${text}`,
      };
    }

    let data: unknown;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      console.error('Invalid JSON from NASA API:', text);
      return {
        code: 500,
        msg: 'NASA API returned invalid JSON.',
      };
    }

    const parsedData = ApodSchema.safeParse(data);
    if (!parsedData.success) {
      console.error('Zod parsing error:', parsedData.error);
      return {
        code: 500,
        msg: 'Failed to parse API response.',
      };
    }

    return parsedData.data;
  } catch (error) {
    console.error('Error fetching APOD:', error);
    return {
      code: 500,
      msg: error instanceof Error ? error.message : 'Unknown error occurred.',
    };
  }
}

export function isApodError(response: ApodResponse): response is { code: number; msg: string } {
  return 'code' in response;
}
