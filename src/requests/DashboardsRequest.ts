import { Layout } from 'react-grid-layout';
import config from 'src/config';
import { QueryType } from '../utils/query.type';
import BaseRequest from './BaseRequest';

export interface DashboardsParams {
  search?: string;
  tags?: string;
  order?: string;
  chain?: string;
}

export interface CreateDashboardParams {
  name: string;
  isPrivate: boolean;
}

interface TableParams {
  network?: string;
  chain?: string;
  search?: string;
}

export interface ForkDashboard {
  newDashboardName: string;
}

export interface QueriesParams {
  search?: string;
  tags?: string;
  order?: string;
  chain?: string;
}

export interface ILayout extends Layout {
  id: string;
}
export interface DataTextWidget {
  text: string;
  options: {
    sizeX: number;
    sizeY: number;
    col: number;
    row: number;
  };
  content: [];
}

export interface DataVisualWidget {
  visualizationId: string;
  options: {
    col: number;
    row: number;
    sizeX: number;
    sizeY: number;
  };
}
export interface DataQuery {
  queryId: string;
}

export interface IUpdateQuery {
  name?: string;
  query?: string;
  tags?: string;
  isPrivate?: boolean;
}

export interface SchemaParams {
  namespace: string;
  tableName: string;
}

export interface QueryResult {
  executionId: string;
}

export interface IInsertVisualization {
  queryId: string;
  type: string;
  name: string;
  options: any;
}

export interface IDeleteVisualization {
  visualId: string;
}

export interface IEditVisualization {
  name: string;
  options: any;
}

export interface IGetBrowse {
  search?: string;
  limit?: number;
  page?: number;
}

export default class DashboardsRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.dashboard;
  }

  /* Dashboards page */

  getAllDashboards(params: IGetBrowse) {
    const url = `/public/dashboards`;
    return this.get(url, params);
  }

  getAllQueries(params: IGetBrowse) {
    const url = `/public/queries`;
    return this.get(url, params);
  }

  getMyListDashboards(params: IGetBrowse) {
    const url = `/dashboards/list-browse-dashboards`;
    return this.get(url, params);
  }

  getMyListQueries(params: IGetBrowse) {
    const url = `/queries/list-browse-queries`;
    return this.get(url, params);
  }

  createNewDashboard(data: CreateDashboardParams) {
    const url = '/dashboards/create-dashboard';
    return this.post(url, data);
  }
  /* End of Dashboards page */

  /* Dashboard's detail page */
  getMyDashboardById(id: string) {
    const url = `/dashboards/find-my-dashboard`;
    return this.get(url, id);
  }

  getPublicDashboardById(id: string) {
    const url = `/public/dashboards/${id}`;
    return this.get(url);
  }

  getPublicDashboardTagsTrending() {
    const url = `/public/dashboards/tags/trending`;
    return this.get(url);
  }

  forkDashboard(data: ForkDashboard, id: ILayout) {
    const url = `/dashboards/fork-dashboard/${id}`;
    return this.post(url, data);
  }

  addDashboardItem(data: DataTextWidget) {
    const url = `/dashboards/insert-text-widget`;
    return this.post(url, data);
  }

  manageVisualizations(data: {
    dashboardId: string;
    listVisuals: DataVisualWidget[];
  }) {
    const url = `/dashboards/${data.dashboardId}/manage-dashboard-visuals`;
    return this.post(url, { listVisuals: data.listVisuals });
  }

  insertVisualizations(data: {
    dashboardId: string;
    dataVisualWidget: DataVisualWidget;
  }) {
    const url = `/dashboards/${data.dashboardId}/insert-dashboard-visual`;
    return this.post(url, data.dataVisualWidget);
  }

  updateDashboardItem(data: ILayout, id: string) {
    const url = `/dashboards/${id}/update-dashboard`;
    return this.patch(url, data);
  }

  removeTextWidget(id: ILayout) {
    const url = `/dashboards/text-widgets/${id}/remove-text-widget`;
    return this.delete(url, id);
  }
  removeVisualization(id: ILayout) {
    const url = `/dashboards/dashboard-visuals/${id}/remove-dashboard-visuals`;
    return this.delete(url, id);
  }
  removeDashboard(id: string) {
    const url = `/dashboards/${id}`;
    return this.delete(url);
  }

  /* End of Dashboard's detail page */

  /* Query page */

  getSchemas() {
    const url = `/schemas`;
    return this.get(url);
  }

  getMyQueryById(params: DataQuery) {
    const url = '/queries/find-my-query';
    return this.get(url, params);
  }

  getPublicQueryById(params: DataQuery) {
    const url = `/public/queries/${params.queryId}`;
    return this.get(url);
  }

  getPublicQueryTagsTrending() {
    const url = `/public/queries/tags/trending`;
    return this.get(url);
  }

  createNewQuery(query: QueryType) {
    const url = '/queries/create-query';
    return this.post(url, query);
  }

  executeQuery(queryId: string) {
    const url = '/query-executors/execute-query';
    return this.post(url, { queryId });
  }

  forkQueries(queryId: string, params: IUpdateQuery) {
    const url = `/queries/fork-query/${queryId}`;
    return this.post(url, { ...params, queryId });
  }

  getQueryExecutionId(params: DataQuery) {
    const url = '/query-results/query-result';
    return this.get(url, params);
  }

  getQueryResult(params: QueryResult) {
    const url = `/query-executors/get-execution`;
    return this.get(url, params);
  }

  getTemporaryQueryResult(query: string) {
    const url = '/query-executors/execute-tmp-query';
    return this.post(url, { query });
  }

  updateQuery(params: IUpdateQuery, queryId: string) {
    const url = `/queries/${queryId}/update-query`;
    return this.patch(url, params);
  }

  removeQuery(id: string) {
    const url = `/queries/${id}`;
    return this.delete(url);
  }

  insertVisualization(data: IInsertVisualization) {
    const url = `/visualizations/insert-visual`;
    return this.post(url, data);
  }

  deleteVisualization(data: IDeleteVisualization) {
    const url = `/visualizations/${data.visualId}/delete-visual`;
    return this.delete(url);
  }

  editVisualization(data: IEditVisualization, visualId: string) {
    const url = `/visualizations/${visualId}/edit-visual`;
    return this.patch(url, data);
  }

  getSupportedChains() {
    const url = '/databases/supported-chains';
    return this.get(url);
  }

  getListMyQueriesVisualizations(params: IGetBrowse) {
    const url = '/visualizations/list-my-queries-visualizations';
    return this.get(url, params);
  }

  checkVisualizationsInDashboards(queryId: string) {
    const url = `/queries/${queryId}/check-visualization-in-dashboard`;
    return this.get(url);
  }

  /* End of Query page */
}
