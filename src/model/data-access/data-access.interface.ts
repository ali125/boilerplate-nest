export interface DataAccessList<T> {
  perPage: number;
  currentPage: number;
  total: number;
  data: T[];
}
