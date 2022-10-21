export interface IListAppResponse {
  pagingCounter?: number;
  offset?: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalDocs: number;
  limit?: number;
  page: number;
  docs: IListAppResponse;
}

export interface IAppResponse {
  appId: number;
  userId: number;
  name?: string;
  status?: string;
  description?: string;
  chain: string;
  network: string;
  key: string;
}
