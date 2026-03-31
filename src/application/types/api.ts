

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: any;
};

export interface ListWithTotalCount<T> {
  list: T[];
  total_count: number;
}

export type ApiErrorResponse = {
  success: false;
  error: string;
    
}