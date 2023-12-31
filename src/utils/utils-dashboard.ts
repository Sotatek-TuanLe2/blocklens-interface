import {
  IDashboardDetail,
  ITextWidget,
  IUserInfo,
  IVisualizationWidget,
  WidgetOptions,
} from './query.type';
import { Visualization, VisualizationInterface } from './utils-query';
import { UserInterface } from './utils-user';

export interface TextWidgetInterface {
  id: string;
  createdAt: string;
  updatedAt: string;
  text: string;
  options: WidgetOptions;

  getId: () => string;
  getText: () => string;
  getCreatedTime: () => string;
  getOptions: () => WidgetOptions;
}

export interface DashboardVisualInterface {
  id: string;
  createdAt: string;
  updatedAt: string;
  options: WidgetOptions;
  visualization: VisualizationInterface;

  getId: () => string;
  getCreatedTime: () => string;
  getOptions: () => WidgetOptions;
  getVisualization: () => VisualizationInterface;
}

export interface DashboardInterface {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  privateMode: boolean;
  userId: UserInterface | string;
  chains: string[] | null;
  forkedDashboardId: string | null;
  forkedDashboardName: string | null;
  textWidgets?: TextWidget[];
  dashboardVisuals?: DashboardVisual[];

  userInfo: IUserInfo;

  getId: () => string;
  getName: () => string;
  getCreatedTime: () => string;
  getUpdatedTime: () => string;
  getThumnail: () => string | null;
  getTags: () => string[];
  getForkedId: () => string | null;
  getForkedName: () => string | null;
  getChains: () => string[] | null;
  getTextWidgets: () => TextWidget[] | null;
  getUser: () => IUserInfo | null;
  getUserFirstName: () => string;
  getUserLastName: () => string;
  getUserAvatar: () => string;
  getUserId: () => string;
  getDashboardVisuals: () => DashboardVisual[] | null;
  getTextWidgetById: (id: string) => TextWidget | null;
  getDashboardVisualById: (id: string) => DashboardVisual | null;

  isPrivate: () => boolean;
}

export class TextWidget implements TextWidgetInterface {
  public id = '';
  public createdAt = '';
  public updatedAt = '';
  public text = '';
  public options = {
    col: 0,
    row: 0,
    sizeX: 0,
    sizeY: 0,
  };

  constructor(textWidget: ITextWidget) {
    this.id = textWidget.id;
    this.createdAt = textWidget.createdAt;
    this.updatedAt = textWidget.updatedAt;
    this.text = textWidget.text;
    this.options = textWidget.options;
  }

  getId() {
    return this.id;
  }

  getText() {
    return this.text;
  }

  getCreatedTime() {
    return this.createdAt;
  }

  getOptions() {
    return this.options;
  }
}

export class DashboardVisual implements DashboardVisualInterface {
  public id = '';
  public createdAt = '';
  public updatedAt = '';
  public options = {
    col: 0,
    row: 0,
    sizeX: 0,
    sizeY: 0,
  };
  public visualization;

  constructor(dashboardVisual: IVisualizationWidget) {
    this.id = dashboardVisual.id;
    this.createdAt = dashboardVisual.createdAt;
    this.updatedAt = dashboardVisual.updatedAt;
    this.options = dashboardVisual.options;
    this.visualization = new Visualization(dashboardVisual.visualization);
  }

  getId() {
    return this.id;
  }

  getCreatedTime() {
    return this.createdAt;
  }

  getOptions() {
    return this.options;
  }

  getVisualization() {
    return this.visualization;
  }
}

export class Dashboard implements DashboardInterface {
  public id = '';
  public name = '';
  public createdAt = '';
  public updatedAt = '';
  public thumbnail;
  public tags;
  public privateMode = false;
  public userId;
  public forkedDashboardId;
  public forkedDashboardName;
  public userInfo: IUserInfo;
  public textWidgets: TextWidget[];
  public chains: string[];
  public dashboardVisuals: DashboardVisual[];

  constructor(dashboard: IDashboardDetail) {
    this.id = dashboard.id;
    this.name = dashboard.name;
    this.createdAt = dashboard.createdAt;
    this.updatedAt = dashboard.updatedAt;
    this.tags = dashboard.tags;
    this.privateMode = dashboard.isPrivate;
    this.userId = dashboard.userId;
    this.forkedDashboardId = dashboard.forkedDashboardId;
    this.forkedDashboardName = dashboard.forkedDashboardName;
    this.textWidgets = [];
    this.thumbnail = dashboard.thumbnail;
    this.userInfo = dashboard.userInfo;
    this.chains = dashboard.utilizedChains;
    if (dashboard.textWidgets) {
      dashboard.textWidgets.forEach((item) => {
        this.textWidgets.push(new TextWidget(item));
      });
    }
    this.dashboardVisuals = [];
    if (dashboard.dashboardVisuals) {
      dashboard.dashboardVisuals.forEach((item) => {
        this.dashboardVisuals.push(new DashboardVisual(item));
      });
    }
  }

  getId() {
    return this.id;
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

  getChains() {
    return this.chains;
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

  getTextWidgets() {
    return this.textWidgets || null;
  }

  getDashboardVisuals() {
    return this.dashboardVisuals || null;
  }

  getTextWidgetById(id: string) {
    if (!this.textWidgets) {
      return null;
    }
    return this.textWidgets.find((item) => item.getId() === id) || null;
  }

  getDashboardVisualById(id: string) {
    if (!this.dashboardVisuals) {
      return null;
    }
    return this.dashboardVisuals.find((item) => item.getId() === id) || null;
  }

  getForkedId() {
    return this.forkedDashboardId || null;
  }

  getForkedName() {
    return this.forkedDashboardName || null;
  }

  isPrivate() {
    return this.privateMode;
  }
}
