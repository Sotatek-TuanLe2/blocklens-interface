export enum VALUE_VISUALIZATION {
  query = 'query',
  bar = 'bar',
  line = 'line',
  area = 'area',
  pie = 'pie',

  scatter = 'scatter',
}

export enum TYPE_VISUALIZATION {
  table = 'table',
  bar = 'bar',
  line = 'line',
  area = 'area',
  pie = 'pie',
  column = 'column',
  scatter = 'scatter',
}

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
