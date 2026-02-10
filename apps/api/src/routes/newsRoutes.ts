import { Router, Request, Response } from 'express';
import { PaginatedNewsResponse, ErrorResponse } from '@app/shared';
import { validateCategory, validatePagination } from '../middleware/validation';
import { getNewsByCategory, getTop4Actualidad } from '../services/newsService';

const router = Router();

router.get('/actualidad/4', async (req: Request, res: Response) => {
  try {
    const data = await getTop4Actualidad();
    res.json({ data });
  } catch (error) {
    console.error('Error in top 4 actualidad endpoint:', error);
    const errorResponse: ErrorResponse = {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch top 4 actualidad news',
      },
    };
    res.status(500).json(errorResponse);
  }
});

router.get(
  '/:category',
  validatePagination,
  async (req: Request, res: Response) => {
    const { category } = req.params;
    const page = parseInt(req.query.page as string);
    const pageSize = parseInt(req.query.pageSize as string);

    if (!validateCategory(category)) {
      const errorResponse: ErrorResponse = {
        error: {
          code: 'INVALID_CATEGORY',
          message: `Invalid category. Valid values: actualidad, politica, economia, deportes, finanzas`,
          details: { category },
        },
      };
      return res.status(400).json(errorResponse);
    }

    try {
      const { data, total } = await getNewsByCategory(category, page, pageSize);
      const totalPages = Math.ceil(total / pageSize);

      const response: PaginatedNewsResponse = {
        data,
        page,
        pageSize,
        total,
        totalPages,
      };

      res.json(response);
    } catch (error) {
      console.error('Error in category endpoint:', error);
      const errorResponse: ErrorResponse = {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch news',
        },
      };
      res.status(500).json(errorResponse);
    }
  }
);

export default router;
