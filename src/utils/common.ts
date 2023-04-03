export interface IListAppResponse {
  pagingCounter?: number;
  offset?: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalDocs: number;
  limit?: number;
  page: number;
  docs: IListAppResponse;
  totalAppActive?: number;
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

export const randomColor = Math.floor(Math.random() * 16777215).toString(16);

export const getHourAndMinute = (date: Date) => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${hour}:${minute}`;
};
