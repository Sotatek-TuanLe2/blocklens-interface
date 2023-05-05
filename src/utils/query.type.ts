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

export enum CHAIN_NAME {
  ETH_GOERLI = 'eth_goerli',
  ETH_MAINNET = 'eth_mainnet',
  BSC_TESTNET = 'bsc_testnet',
  BSC_MAINNET = 'bsc_mainnet',
  APTOS_TESTNET = 'aptos_testnet',
  APTOS_MAINNET = 'aptos_mainnet',
  polygon_mumbai = 'polygon_mumbai',
  POLYGON_MAINNET = 'polygon_mainnet',
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
export interface IDashboard {
  id: string;
  name: string;
  isPrivate: boolean;
  isArchived: boolean;
  user: string;
  forkedDashboard: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITextWidget {
  id: string;
  text: string;
  options: {
    col: number;
    row: number;
    sizeX: number;
    sizeY: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVisualizationWidget {
  id: string;
  visualization: VisualizationType;
  dashboard: IDashboard;
  user: string;
  options?: null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDashboardDetail {
  id: string;
  name: string;
  isPrivate: boolean;
  isArchived: boolean;
  user: string;
  forkedDashboard?: IDashboard;
  createdAt: Date;
  updatedAt: Date;
  visualizationWidgets?: IVisualizationWidget[];
  isTemp?: boolean;
  query?: string;
  textWidgets: ITextWidget[];
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
