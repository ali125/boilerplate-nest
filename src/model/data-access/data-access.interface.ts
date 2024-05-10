export interface DataAccessList<T> {
  perPage: number;
  lastPage: number;
  currentPage: number;
  total: number;
  data: T[];
}

export type GenerateSlugParams = {
  slug?: string;
  title?: string;
  id?: string;
};
