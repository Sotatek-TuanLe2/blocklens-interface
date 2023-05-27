import { IQuery, VisualizationType } from './query.type';

export interface VisualizationInterface {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  type: string;
  options: any;
  query?: Query;

  getId: () => string;
  getCreatedTime: () => string;
  getUpdatedTime: () => string;
  getName: () => string;
  getType: () => string;
  getConfigs: () => any;
  getQuery: () => Query | null;
}

export interface QueryInterface {
  id: string;
  resultId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  privateMode: boolean;
  query: string;

  // user: UserInterface;
  visualizations: Visualization[];

  getId: () => string;
  getResultId: () => string;
  getName: () => string;
  getCreatedTime: () => string;
  getUpdatedTime: () => string;
  getThumnail: () => string | null;
  getTags: () => string[] | null;
  getQuery: () => string;
  // getUser: () => UserInterface | string;
  getVisualizations: () => Visualization[];
  getVisualizationById: (id: string) => Visualization | null;

  isPrivate: () => boolean;
}

export class Visualization implements VisualizationInterface {
  public id = '';
  public createdAt = '';
  public updatedAt = '';
  public name = '';
  public type = '';
  public options;
  public query;

  constructor(visualization: VisualizationType) {
    this.id = visualization.id;
    this.createdAt = visualization.createdAt;
    this.updatedAt = visualization.updatedAt;
    this.name = visualization.name;
    this.type = visualization.type;
    this.options = visualization.options;
    if (visualization.query) {
      this.query = new Query(visualization.query);
    }
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
  public createdAt;
  public updatedAt;
  public thumbnail;
  public tags;
  public privateMode = false;
  public query = '';

  // public user;
  public visualizations: Visualization[];

  constructor(query: IQuery) {
    this.id = query.id;
    this.resultId = query.id;
    this.name = query.name;
    this.createdAt = query.createdAt;
    this.updatedAt = query.updatedAt;
    this.tags = query.tags;
    this.privateMode = query.isPrivate;
    this.query = query.query;
    this.thumbnail = query.thumbnail;
    // this.user = query.user;
    this.visualizations = [];
    if (!!query.visualizations) {
      query.visualizations.forEach((visual) => {
        this.visualizations.push(new Visualization(visual));
      });
    }
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

  getThumnail() {
    return this.thumbnail || null;
  }

  getTags() {
    return this.tags || null;
  }

  getQuery() {
    return this.query;
  }

  // getUser() {
  //   return this.user;
  // }

  getVisualizations() {
    return this.visualizations;
  }

  getVisualizationById(id: string) {
    return this.visualizations.find((item) => item.getId() === id) || null;
  }

  isPrivate() {
    return this.privateMode;
  }
}
