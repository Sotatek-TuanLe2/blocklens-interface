export enum VALUE_VISUALIZATION {
  query = 'query',
  bar = 'bar',
  line = 'line',
  area = 'area',
  pie = 'pie',
  scatter = 'scatter',
  counter = 'counter',
  table = 'table',
}

export enum TYPE_VISUALIZATION {
  table = 'table',
  counter = 'counter',
  bar = 'bar',
  line = 'line',
  area = 'area',
  pie = 'pie',
  column = 'column',
  scatter = 'scatter',
  new = 'newVisualization',
}

export type VisualizationType = {
  id: string;
  name: string;
  type: string;
  createdAt: Date | number;
  updatedAt?: Date | number;
  options: any;
  query?: any;
};

export interface IQuery {
  id: string;
  name: string;
  isPrivate?: boolean;
  isArchived?: boolean;
  isTemp?: boolean;
  createdAt: Date | number;
  updatedAt?: Date | number;
  query: string;
  forkedQuery?: null;
  user?: {
    id: string | number;
    name: string;
    avatarUrl: string;
  };
  visualizations: VisualizationType[];
}

export type TableAttributeType = {
  blockchains: string[];
  column_name: string;
  data_type: string;
  full_name: string;
  id: string;
};
export type ResultDataConfigsType = {
  columnMapping: ColumnMappingType;
};

export type ColumnMappingType = {
  xAxis: string;
  yAxis: string[];
};

export type ChartOptionConfigsType = {
  name: string;
  showLegend: boolean;
  showDataLabels: boolean;
  percentValues?: boolean;
  stacking?: boolean;
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
  logarithmic: boolean;
};

export type ChartType = {
  globalSeriesType: string;
};

export type VisualizationOptionsType = ChartType &
  ResultDataConfigsType & {
    chartOptionsConfigs: Partial<ChartOptionConfigsType>;
  } & {
    xAxisConfigs: XAxisConfigsType;
  } & { yAxisConfigs: YAxisConfigsType } & { numberFormat?: string };

export type QueryType = {
  name: string;
  query: string;
  // visualizations: VisualizationType[];
};

export type QueryTypeSingle = {
  name: string;
  query: string;
  visualizations: VisualizationType;
  id: number;
};

export type QueryExecutedResponse = {
  id: string;
  query: IQuery;
  createdAt: string;
  result: any;
  status: string;
  updatedAt: string;
};

export type QueryResultResponse = {
  id: string;
  query: IQuery;
  resultId: string;
  createAt: string;
  updatedAt: string;
};
