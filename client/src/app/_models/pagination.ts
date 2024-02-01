//generalized interface and class implementation to retrieve paginated data from the api and keep track of it
export interface Pagination{
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number

}

export class PaginatedResult<T>{
  result?: T
  pagination?: Pagination

}
