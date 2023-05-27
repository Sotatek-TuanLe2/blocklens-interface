import moment from 'moment';
import { LABEL_VISUALIZATION, TYPE_VISUALIZATION } from './query.type';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboards',
  QUERY: '/queries',
  MY_DASHBOARD: '/my-dashboards',
  MY_QUERY: '/my-queries',
  LOGIN: '/login',
  SIGN_UP: '/sign-up',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CONTACT_US: '/contact-us',
};

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
  'rgb(0, 117, 245)',
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

export const INPUT_DEBOUNCE = 500;

export const getDefaultVisualizationName = (chain: string | undefined) => {
  switch (chain) {
    case TYPE_VISUALIZATION.table:
      return LABEL_VISUALIZATION.table;

    case TYPE_VISUALIZATION.scatter:
      return LABEL_VISUALIZATION.scatter;

    case TYPE_VISUALIZATION.area:
      return LABEL_VISUALIZATION.area;

    case TYPE_VISUALIZATION.line:
      return LABEL_VISUALIZATION.line;

    case TYPE_VISUALIZATION.pie:
      return LABEL_VISUALIZATION.pie;

    case TYPE_VISUALIZATION.bar:
      return LABEL_VISUALIZATION.bar;

    case TYPE_VISUALIZATION.counter:
      return LABEL_VISUALIZATION.counter;

    default:
      return '';
  }
};

export const QUERY_RESULT_STATUS = {
  DONE: 'DONE',
  WAITING: 'WAITING',
  FAILED: 'FAILED',
};

export const PROMISE_STATUS = {
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
  PENDING: 'pending',
};
