import { Layout } from 'react-grid-layout';
import { QueryType } from '../utils/query.type';
import BaseRequest from './BaseRequest';

export interface DashboardsParams {
  order?: string;
  timeRange?: string;
  search?: string;
  tags?: string;
}

export interface CreateDashboardParams {
  name: string;
  slug: string;
  isPrivate: boolean;
}

interface TableParams {
  network?: string;
  chain?: string;
  search?: string;
}

export interface ForkDashboard {
  newDashboardName: string;
  newDashboardSlug: string;
}

export interface ListParams {
  search: string;
  limit: number;
  page: number;
}

export interface QueriesParams {
  order?: string;
  timeRange?: string;
  search?: string;
  tags?: string;
}

export interface WizardsParams {
  search?: string;
}

export interface TeamsParams {
  search?: string;
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
export interface DataQuery {
  queryId: string;
}

export interface IUpdateQuery {
  name?: string;
  query?: string;
  isTemp?: boolean;
}

export interface SchemaParams {
  namespace: string;
  tableName: string;
}

export interface QueryResult {
  queryId: string;
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
    return '';
  }

  /* Dashboards page */

  getListBrowseDashboard(params: IGetBrowse) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/dashboard/list-browse-dashboards`;
    return this.get(url, params);
  }

  getListBrowseQueries(params: IGetBrowse) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/queries/list-browse-queries`;
    return this.get(url, params);
  }

  createNewDashboard(data: CreateDashboardParams) {
    const url =
      'https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/dashboard/create-dashboard';
    return this.post(url, data);
  }

  getPopularDashboardTags() {
    const url = 'https://run.mocky.io/v3/fd2b3e65-6c5f-44f1-bc61-e7249645f1c3';
    return this.get(url);
  }

  getPopularQueryTags() {
    const url = 'https://run.mocky.io/v3/50864550-87f8-41ae-9985-a15289cf7f77';
    return this.get(url);
  }

  /* End of Dashboards page */

  /* Dashboard's detail page */
  getDashboardById(id: string) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/dashboard/find-dashboard`;
    return this.get(url, id);
  }
  forkDashboard(data: ForkDashboard, id: ILayout) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/fork-dashboard/${id}`;
    return this.post(url, data);
  }
  getQueriesValues() {
    const url = 'https://run.mocky.io/v3/c2d9b9cf-afd4-4aad-ac74-7c770669525f';
    return this.get(url);
  }

  getVisualization() {
    const url = `https://642cf0d966a20ec9ce915e71.mockapi.io/queries/queries/`;
    return this.get(url);
  }

  getDashboardItem() {
    const url = `https://6071c80750aaea0017285222.mockapi.io/layouts`;
    return this.get(url);
  }

  addDashboardItem(data: DataTextWidget) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/dashboard/insert-text-widget`;
    return this.post(url, data);
  }
  addVisualization(data: DataTextWidget) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/dashboard/insert-visualization-widget`;
    return this.post(url, data);
  }

  updateDashboardItem(data: ILayout) {
    const url = `https://6071c80750aaea0017285222.mockapi.io/layouts/${data.id}`;
    return this.put(url, data);
  }

  removeDashboardItem(id: ILayout) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/text-widgets/${id}/remove-text-widget`;
    return this.delete(url, id);
  }
  removeVisualization(id: ILayout) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/visualization-widgets/${id}/remove-visualization-widget`;
    return this.delete(url, id);
  }

  /* End of Dashboard's detail page */

  /* Query page */

  getTables(params: TableParams) {
    const url =
      'https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/databases/tables';
    return this.get(url, { ...params });
  }

  getSchemaOfTable(params: SchemaParams) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/databases/${params.namespace}/${params.tableName}/schema`;
    return this.get(url);
  }

  getQuery(params: ListParams) {
    const url =
      'https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/queries/list-browse-queries';
    return this.get(url, { ...params });
  }

  getQueryById(params: DataQuery) {
    const url =
      'https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/queries/find-query';
    return this.get(url, params);
  }

  createNewQuery(query: QueryType) {
    const url =
      'https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/queries/create-query';
    return this.post(url, query);
  }

  executeQuery(queryId: string) {
    const url =
      'https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/query-executors/execute-query';
    return this.post(url, { queryId });
  }

  getQueryExecutionId(params: DataQuery) {
    const url =
      'https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/query-results/query-result';
    return this.get(url, params);
  }

  getQueryResult(params: QueryResult) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/query-executors/get-execution`;
    return this.get(url, params);
  }

  updateQuery(params: IUpdateQuery, queryId: string) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/queries/${queryId}/update-query`;
    return this.patch(url, params);
  }

  insertVisualization(data: IInsertVisualization) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/visualizations/insert-visual`;
    return this.post(url, data);
  }

  deleteVisualization(data: IDeleteVisualization) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/visualizations/${data.visualId}/delete-visual`;
    return this.delete(url);
  }

  editVisualization(data: IEditVisualization, visualId: string) {
    const url = `https://dev-blocksniper-api.sotatek.works/api/blocklens-query-executor/visualizations/${visualId}/edit-visual`;
    return this.patch(url, data);
  }

  /* End of Query page */
}
