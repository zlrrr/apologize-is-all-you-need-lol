import { Request, Response, NextFunction } from 'express';
import { LLMError } from '../types/index.js';

/**
 * Global error handling middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', error);

  // Handle LLM errors
  if (error instanceof LLMError) {
    const statusCode = getStatusCodeForLLMError(error);
    res.status(statusCode).json({
      error: error.code,
      message: error.message,
    });
    return;
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation Error',
      message: error.message,
    });
    return;
  }

  // Handle generic errors
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : error.message,
  });
}

/**
 * Get HTTP status code for LLM error
 */
function getStatusCodeForLLMError(error: LLMError): number {
  switch (error.code) {
    case 'CONNECTION_REFUSED':
      return 503; // Service Unavailable
    case 'TIMEOUT':
      return 504; // Gateway Timeout
    case 'API_ERROR':
      return error.statusCode || 502; // Bad Gateway
    case 'NETWORK_ERROR':
      return 502; // Bad Gateway
    default:
      return 500; // Internal Server Error
  }
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
}
