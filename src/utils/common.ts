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

export type TableAttributeType = {
  blockchains: string[];
  full_name: string;
  id: string;
  namespace: string;
  table_name: string;
  __typename: string;
};

export interface SchemaType {
  column_name: string;
  data_type: string;
  full_name: string;
  namespace: string;
  table_name: string;
}

// export const randomColor = Math.floor(Math.random() * 16777215).toString(16);
export const randomColor = '#8884d8';

export const getHourAndMinute = (date: Date) => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${hour}:${minute}`;
};

export enum VALUE_VISUALIZATION {
  query = 'query',
  bar = 'bar',
  line = 'line',
  area = 'area',
  pie = 'pie',
}

export enum TYPE_VISUALIZATION {
  table = 'table',
  bar = 'bar',
  line = 'line',
  area = 'area',
  pie = 'pie',
  column = 'column',
}
