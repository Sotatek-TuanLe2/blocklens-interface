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

export type SchemaType = {
  blockchains: string[];
  full_name: string;
  id: string;
  namespace: string;
  table_name: string;
  __typename: string;
};

export type TableAttributeType = {
  blockchains: string[];
  column_name: string;
  data_type: string;
  full_name: string;
  id: string;
};
export type ResultDataConfigsType = {
  columnMapping: {
    [key: string]: 'x' | 'y';
  };
};

export type ChartOptionConfigsType = {
  name: string;
  showLegend: boolean;
  showDataLabels: boolean;
  series: {
    percentValues: boolean;
  };
};

export type XAxisConfigsType = {
  title: string;
  sortX: boolean;
  reverseX: boolean;
  tickFormat: string;
};

export type YAxisConfigsType = {
  title: string;
  tickFormat: string;
  labelFormat: string;
};

export type ChartType = {
  globalSeriesType: string;
};

type VisualizationOptionsType = ChartType &
  ResultDataConfigsType &
  ChartOptionConfigsType &
  XAxisConfigsType &
  YAxisConfigsType;

export type VisualizationType = {
  // created_at: Date;
  icon?: React.ReactNode;
  id: string;
  name: string;
  options: Partial<VisualizationOptionsType>;
  type: string;
};

export type QueryType = {
  name: string;
  query: string;
  visualizations: VisualizationType[];
  id: string;
};

export type QueryTypeSingle = {
  name: string;
  query: string;
  visualizations: VisualizationType;
  id: number;
};

// export const randomColor = Math.floor(Math.random() * 16777215).toString(16);
export const randomColor = '#8884d8';

export const getHourAndMinute = (date: Date) => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${hour}:${minute}`;
};

export enum VALUE_VISUALIZATION {
  scatter = 'scatter',
  query = 'query',
  bar = 'bar',
  line = 'line',
  area = 'area',
  pie = 'pie',
}

export enum TYPE_VISUALIZATION {
  scatter = 'scatter',
  table = 'table',
  bar = 'bar',
  line = 'line',
  area = 'area',
  pie = 'pie',
  column = 'column',
}
