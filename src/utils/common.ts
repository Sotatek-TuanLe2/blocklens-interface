import moment from 'moment';

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

export const VISUALIZATION_COLORS = {
  POSITIVE: '#28c76f',
  NEGATIVE: '#ff3b2e',
};

export const COLORS = [
  'rgb(244, 96, 62)',
  'rgb(200, 143, 251)',
  'rgb(230, 131, 16)',
  'rgb(36, 121, 108)',
  'rgb(153, 201, 69)',
  'rgb(82, 188, 163)',
  'rgb(93, 105, 177)',
  'rgb(65, 100, 74)',
  'rgb(242, 183, 1)',
  'rgb(204, 97, 176)',
  'rgb(5, 191, 219)',
];

export const getHourAndMinute = (date: string) => {
  return moment(new Date(date)).format('HH:mm');
};
