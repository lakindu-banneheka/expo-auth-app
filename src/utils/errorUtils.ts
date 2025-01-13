export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public additionalInfo?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: any) => {
  if (error instanceof AppError) {
    return error;
  }

  // Firebase Auth errors
  if (error.code?.startsWith('auth/')) {
    return new AppError(
      error.message,
      error.code,
      { type: 'auth' }
    );
  }

  // Network errors
  if (error.message?.includes('network')) {
    return new AppError(
      'Please check your internet connection',
      'network/offline',
      { type: 'network' }
    );
  }

  // Default error
  return new AppError(
    'An unexpected error occurred',
    'unknown/error',
    { originalError: error }
  );
};