import { UserInterface } from './utils-user';

interface VisualizationConfigs {
  columns?: any[]; // for table
  chartOptionsConfigs?: any;
  columnMapping?: {
    xAxis: string;
    yAxis: string[];
  };
  globalSeriesType?: string;
}

export interface VisualizationInterface {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  type: string;
  options: VisualizationConfigs;
  query?: QueryInterface;

  getId: () => string;
  getCreatedTime: () => string;
  getUpdatedTime: () => string;
  getName: () => string;
  getType: () => string;
  getConfigs: () => VisualizationConfigs;
  getQuery: () => QueryInterface | null;
}

export interface QueryInterface {
  id: string;
  resultId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  privateMode: boolean;
  temporaryMode: boolean;
  query: string;

  user: UserInterface;
  visualizations: VisualizationInterface[];

  getId: () => string;
  getResultId: () => string;
  getName: () => string;
  getCreatedTime: () => string;
  getUpdatedTime: () => string;
  getQuery: () => string;
  getUser: () => UserInterface | string;
  getVisualizations: () => VisualizationInterface[];
  getVisualizationById: (id: string) => VisualizationInterface | null;

  isPrivate: () => boolean;
  isTemp: () => boolean;
}

export class Visualization implements VisualizationInterface {
  public id = '';
  public createdAt = '';
  public updatedAt = '';
  public name = '';
  public type = '';
  public options;
  public query;

  constructor(visualization: VisualizationInterface) {
    this.id = visualization.id;
    this.createdAt = visualization.createdAt;
    this.updatedAt = visualization.updatedAt;
    this.name = visualization.name;
    this.type = visualization.type;
    this.options = visualization.options;
    this.query = visualization.query;
  }

  getId() {
    return this.id;
  }

  getCreatedTime() {
    return this.createdAt;
  }

  getUpdatedTime() {
    return this.updatedAt;
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  getConfigs() {
    return this.options;
  }

  getQuery() {
    return this.query || null;
  }
}

export class Query implements QueryInterface {
  public id = '';
  public resultId = '';
  public name = '';
  public createdAt = '';
  public updatedAt = '';
  public privateMode = false;
  public temporaryMode = false;
  public query = '';

  public user;
  public visualizations;

  constructor(query: QueryInterface) {
    this.id = query.id;
    this.resultId = query.id;
    this.name = query.name;
    this.createdAt = query.createdAt;
    this.updatedAt = query.updatedAt;
    this.privateMode = query.privateMode;
    this.temporaryMode = query.temporaryMode;
    this.query = query.query;
    this.user = query.user;
    this.visualizations = query.visualizations;
  }

  getId() {
    return this.id;
  }

  getResultId() {
    return this.resultId;
  }

  getName() {
    return this.name;
  }

  getCreatedTime() {
    return this.createdAt;
  }

  getUpdatedTime() {
    return this.updatedAt;
  }

  getQuery() {
    return this.query;
  }

  getUser() {
    return this.user;
  }

  getVisualizations() {
    return this.visualizations;
  }

  getVisualizationById(id: string) {
    return this.visualizations.find((item) => item.getId() === id) || null;
  }

  isPrivate() {
    return this.privateMode;
  }

  isTemp() {
    return this.temporaryMode;
  }
}
