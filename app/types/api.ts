export interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
}

export interface AdvancedPagination extends Pagination {
  point_in_time_id?: string;
  search_after?: (string | number)[];
}
