export interface DataAccessList<T> {
  perPage: number;
  lastPage: number;
  currentPage: number;
  total: number;
  data: T[];
}
