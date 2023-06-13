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
export enum LABEL_VISUALIZATION {
  bar = 'Bar chart',
  line = 'Line chart',
  area = 'Area chart',
  pie = 'Pie chart',
  scatter = 'Scatter chart',
  counter = 'Counter',
  table = 'Table',
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
  OPTIMISM_MAINET = 'optimism_mainet',
  OPTIMISM_TESTNET = 'optimism_testnet',
  SOLANA_MAINET = 'solana_mainet',
  SOLANA_TESTNET = 'solana_testnet',
  ARBITRUM_MAINET = 'arbitrum_mainet',
  ARBITRUM_TESTNET = 'arbitrum_testnet',
  SUI_MAINET = 'sui_mainnet',
  SUI_TESTNET = 'sui_testnet',
}

export enum LAYOUT_QUERY {
  FULL = 'full',
  HALF = 'half',
  HIDDEN = 'hidden',
}

export interface WidgetOptions {
  col: number;
  row: number;
  sizeX: number;
  sizeY: number;
}

export type VisualizationType = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  options: any;
  query?: IQuery;
  queryId?: string;
};

export type IUserInfo = {
  email: string;
  firstName: string;
  lastName: string;
  userId: string;
};

export interface IQuery {
  id: string;
  name: string;
  isPrivate: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  query: string;
  forkedQuery?: null;
  // user?: {
  //   id: string | number;
  //   name: string;
  //   avatarUrl: string;
  // };
  visualizations: VisualizationType[];
  utilizedChains: string[];
  thumbnail: string | null;
  userInfo: IUserInfo;
}
export interface IDashboard {
  id: string;
  name: string;
  isPrivate: boolean;
  isArchived: boolean;
  user: string;
  forkedDashboard: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITextWidget {
  id: string;
  text: string;
  options: WidgetOptions;
  createdAt: string;
  updatedAt: string;
}

export interface IVisualizationWidget {
  id: string;
  createdAt: string;
  updatedAt: string;
  options: WidgetOptions;
  visualization: VisualizationType;
  user: string;
}

export interface IDashboardDetail {
  id: string;
  name: string;
  isPrivate: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  user: string;
  forkedDashboardId: string | null;
  tags?: string[];
  dashboardVisuals?: IVisualizationWidget[];
  textWidgets?: ITextWidget[];
  utilizedChains: string[];
  thumbnail: string | null;
  userInfo: IUserInfo;
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

export interface IErrorExecuteQuery {
  message: string;
  name: string;
  metadata: { position: string; code: string };
}
