import { QueryInterface, VisualizationInterface } from './utils-query';
import { UserInterface } from './utils-user';

interface WidgetOptions {
  col: number;
  row: number;
  sizeX: number;
  sizeY: number;
}

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
  visualization: VisualizationInterface & {
    query: QueryInterface;
  };

  getId: () => string;
  getCreatedTime: () => string;
  getOptions: () => WidgetOptions;
  getVisualization: () => VisualizationInterface & { query: QueryInterface };
}

export interface DashboardInterface {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  privateMode: boolean;
  tags: string[];

  user: UserInterface | string;

  forkedDashboardId?: string;
  textWidgets?: TextWidgetInterface[];
  dashboardVisuals?: DashboardVisualInterface[];

  getId: () => string;
  getName: () => string;
  getUser: () => UserInterface | string;
  getCreatedTime: () => string;
  getUpdatedTime: () => string;
  getTags: () => string[];
  getForkedDashboardId: () => string | null;
  getTextWidgets: () => TextWidgetInterface[] | null;
  getDashboardVisuals: () => DashboardVisualInterface[] | null;
  getTextWidgetById: (id: string) => TextWidgetInterface | null;
  getDashboardVisualById: (id: string) => DashboardVisualInterface | null;

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

  constructor(textWidget: TextWidgetInterface) {
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

  constructor(dashboardVisual: DashboardVisualInterface) {
    this.id = dashboardVisual.id;
    this.createdAt = dashboardVisual.createdAt;
    this.updatedAt = dashboardVisual.updatedAt;
    this.options = dashboardVisual.options;
    this.visualization = dashboardVisual.visualization;
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
  public privateMode = false;
  public tags;
  public user;
  public forkedDashboardId;
  public textWidgets;
  public dashboardVisuals;

  constructor(dashboard: DashboardInterface) {
    this.id = dashboard.id;
    this.name = dashboard.name;
    this.createdAt = dashboard.createdAt;
    this.updatedAt = dashboard.updatedAt;
    this.tags = dashboard.tags;
    this.privateMode = dashboard.privateMode;
    this.user = dashboard.user;
    this.forkedDashboardId = dashboard.forkedDashboardId;
    this.textWidgets = dashboard.textWidgets;
    this.dashboardVisuals = dashboard.dashboardVisuals;
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

  getTags() {
    return this.tags;
  }

  getUser() {
    return this.user;
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

  getForkedDashboardId() {
    return this.forkedDashboardId || null;
  }

  isPrivate() {
    return this.privateMode;
  }
}
