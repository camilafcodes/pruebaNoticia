import { PaginatedNewsResponse, NewsItem, ErrorResponse } from '@app/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new APIError(
        errorData.error.message,
        errorData.error.code,
        errorData.error.details
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      'Failed to fetch data from API',
      'NETWORK_ERROR',
      { originalError: error }
    );
  }
}

export async function fetchNewsByCategory(
  category: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedNewsResponse> {
  return fetchAPI<PaginatedNewsResponse>(
    `/api/v1/${category}?page=${page}&pageSize=${pageSize}`
  );
}

export async function fetchTop4Actualidad(): Promise<{ data: NewsItem[] }> {
  return fetchAPI<{ data: NewsItem[] }>('/api/v1/actualidad/4');
}

export { APIError };
