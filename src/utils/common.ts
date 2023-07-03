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
  TRIGGERS: '/triggers',
  APP: '/app',
  WEBHOOKS: '/webhooks',
  ACCOUNT: '/account',
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

export interface SchemaType {
  column_name: string;
  data_type: string;
  full_name: string;
  namespace: string;
  table_name: string;
}

export interface IPagination {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItem?: number;
}

export const VISUALIZATION_COLORS = {
  POSITIVE: '#28c76f',
  NEGATIVE: '#ff3b2e',
};

export const COLORS = [
  '#0E8AFD',
  '#FFB547',
  '#67DF9D',
  '#D53E54',
  '#6651AF',
  '#899BA9',
  '#E07BC4',
  '#1E7B98',
  '#DC420C',
  '#663327',
  '#F6E1E9',
  '#A781FF',
  '#114351',
  '#9CABFF',
  '#C38154',
  '#D7C0AE',
  '#967E76',
  '#47A992',
  '#FFE569',
  '#4942E4',
];

export const getMonthAndDate = (date: string) => {
  return moment(new Date(date)).format('MMM DD');
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

export const generateAvatarFromId = (id: string | undefined) => {
  return Number(id?.replace(/[a-z -]/gm, ''));
};

export const QUERY_RESULT_STATUS = {
  DONE: 'DONE',
  WAITING: 'WAITING',
  FAILED: 'FAILED',
};

export const TYPE_OF_MODAL = {
  SETTING: 'SETTING',
  FORK: 'FORK',
  CREATE: 'CREATE',
};
