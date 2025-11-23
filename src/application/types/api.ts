

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: any;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
    
}