import { Request, Response, NextFunction } from 'express';
import { Category } from '@app/shared';

const validCategories: Category[] = ['actualidad', 'politica', 'economia', 'deportes', 'finanzas'];

export const validateCategory = (category: string): boolean => {
  return validCategories.includes(category as Category);
};

export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  if (page < 1 || isNaN(page)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_PAGE',
        message: 'Page number must be a positive integer',
        details: { page: req.query.page },
      },
    });
  }

  if (pageSize < 1 || pageSize > 50 || isNaN(pageSize)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_PAGE_SIZE',
        message: 'Page size must be between 1 and 50',
        details: { pageSize: req.query.pageSize },
      },
    });
  }

  req.query.page = page.toString();
  req.query.pageSize = pageSize.toString();
  next();
};
