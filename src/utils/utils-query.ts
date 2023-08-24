import { IQuery, IUserInfo, VisualizationType } from './query.type';

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
  executedId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  privateMode: boolean;
  query: string;
  forkedQueryId: string | null;
  forkedQueryName: string | null;
  userInfo: IUserInfo;
  chains: string[];
  visualizations: Visualization[];

  getId: () => string;
  getExecutionId: () => string;
  getName: () => string;
  getCreatedTime: () => string;
  getUpdatedTime: () => string;
  getThumnail: () => string | null;
  getTags: () => string[];
  getQuery: () => string;
  getForkedId: () => string | null;
  getForkedName: () => string | null;
  getChains: () => string[] | null;

  getUser: () => IUserInfo | null;
  getUserFirstName: () => string;
  getUserLastName: () => string;
  getUserAvatar: () => string;
  getUserId: () => string;
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
  public executedId = '';
  public name = '';
  public createdAt;
  public updatedAt;
  public thumbnail;
  public tags;
  public privateMode = false;
  public userId;
  public query = '';
  public forkedQueryId;
  public forkedQueryName;
  public userInfo: IUserInfo;
  public chains: string[];
  public visualizations: Visualization[];

  constructor(query: IQuery) {
    this.id = query.id;
    this.executedId = query.id;
    this.name = query.name;
    this.createdAt = query.createdAt;
    this.updatedAt = query.updatedAt;
    this.tags = query.tags;
    this.privateMode = query.isPrivate;
    this.userId = query.userId;
    this.query = query.query;
    this.forkedQueryId = query.forkedQueryId;
    this.forkedQueryName = query.forkedQueryName;
    this.thumbnail = query.thumbnail;
    this.userInfo = query.userInfo;
    this.chains = query.utilizedChains;
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

  getExecutionId() {
    return this.executedId;
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
    return this.tags || [];
  }

  getQuery() {
    return this.query;
  }

  getForkedId() {
    return this.forkedQueryId || '';
  }

  getForkedName() {
    return this.forkedQueryName || '';
  }

  getUser() {
    return this.userInfo || null;
  }

  getUserFirstName() {
    if (!this.getUser()) {
      return '';
    }
    return this.getUser().firstName || '';
  }

  getUserLastName() {
    if (!this.getUser()) {
      return '';
    }
    return this.getUser().lastName || '';
  }

  getUserAvatar() {
    if (!this.getUser()) {
      return '';
    }
    return this.getUser().avatar || '';
  }

  getUserId() {
    return this.userId || '';
  }

  getChains() {
    return this.chains;
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
}
