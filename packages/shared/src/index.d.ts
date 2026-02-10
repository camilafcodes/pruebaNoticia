export interface HealthResponse {
    status: string;
    timestamp: string;
    version: string;
}
export interface NewsItem {
    newId: string;
    portalName: string;
    newTitle: string;
    newDate: string;
    image?: string;
    description?: string;
    content: string;
    category: string;
    flag: boolean;
}
export interface PaginatedNewsResponse {
    data: NewsItem[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}
export interface ErrorResponse {
    error: {
        code: string;
        message: string;
        details?: any;
    };
}
export type Category = 'actualidad' | 'politica' | 'economia' | 'deportes' | 'finanzas';
//# sourceMappingURL=index.d.ts.map