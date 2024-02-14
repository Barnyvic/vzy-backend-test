export interface ApiResponse<T> {
  error: boolean;
  statusCode?: number;
  message?: string;
  data: T | null;
}

export const HandleSuccess = <T>(
  data: T,
  statusCode = 200,
  message = '',
): ApiResponse<T> => ({
  error: false,
  statusCode,
  message,
  data,
});

export const HandleError = <T>(error: any): ApiResponse<T> => {
  const statusCode = error.status || 500;
  const message = error.message || 'An unexpected error occurred';

  return {
    error: true,
    statusCode,
    message,
    data: null,
  };
};
