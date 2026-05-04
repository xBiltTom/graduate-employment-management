export type ServiceResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: ServiceError;
    };

export type ServiceError = {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
