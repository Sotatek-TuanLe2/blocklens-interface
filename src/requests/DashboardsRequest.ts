import { Layout } from 'react-grid-layout';
import { QueryType } from '../utils/query.type';
import BaseRequest from './BaseRequest';

export interface DashboardsParams {
  order?: string;
  timeRange?: string;
  search?: string;
  tags?: string;
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

  getDashboards(params: DashboardsParams) {
    const url = 'https://run.mocky.io/v3/8deb0b1a-289e-4f91-8669-679338169925';
    return this.get(url, { ...params });
  }

  getQueries(params: QueriesParams) {
    const url = 'https://run.mocky.io/v3/1fc26a41-6ebc-43fc-88a8-b2c36d9fe085';
    return this.get(url, { ...params });
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
  getDashboardById() {
    const url = 'http://172.16.199.30:8002/dashboard/find-dashboard';
    return this.get(url);
  }
  forkDashboard(data: ForkDashboard, id: ILayout) {
    const url = `http://172.16.199.30:8002/dashboard/fork-dashboard/${id}`;
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

  addDashboardItem(data: ILayout) {
    const url = `https://6071c80750aaea0017285222.mockapi.io/layouts`;
    return this.post(url, data);
  }

  updateDashboardItem(data: ILayout) {
    const url = `https://6071c80750aaea0017285222.mockapi.io/layouts/${data.id}`;
    return this.put(url, data);
  }

  removeDashboardItem(id: ILayout) {
    const url = `https://6071c80750aaea0017285222.mockapi.io/layouts/${id}`;
    return this.delete(url, id);
  }

  /* End of Dashboard's detail page */

  /* Query page */

  getTables(params: TableParams) {
    const url = 'http://172.16.199.24:8002/databases/tables';
    return this.get(url, { ...params });
  }

  getSchemaOfTable(params: SchemaParams) {
    const url = `http://172.16.199.24:8002/databases/${params.namespace}/${params.tableName}/schema`;
    return this.get(url);
  }

  getQuery(params: ListParams) {
    const url = 'http://172.16.199.30:8002/queries/list-browse-queries';
    return this.get(url, { ...params });
  }

  getQueryById(params: DataQuery) {
    const url = 'http://172.16.199.24:8002/queries/find-query';
    return this.get(url, params);
  }

  createNewQuery(query: QueryType) {
    const url = 'http://172.16.199.24:8002/queries/create-query';
    return this.post(url, query);
  }

  executeQuery(queryId: string) {
    const url = 'http://172.16.199.24:8002/query-executors/execute-query';
    return this.post(url, { queryId });
  }

  getQueryExecutionId(params: DataQuery) {
    const url = 'http://172.16.199.24:8002/query-results/query-result';
    return this.get(url, params);
  }

  getQueryResult(params: QueryResult) {
    const url = `http://172.16.199.24:8002/query-executors/get-execution`;
    return this.get(url, params);
  }

  updateQuery(params: IUpdateQuery, queryId: string) {
    const url = `http://172.16.199.24:8002/queries/${queryId}/update-query`;
    return this.patch(url, params);
  }

  insertVisualization(data: IInsertVisualization) {
    const url = `http://172.16.199.24:8002/visualizations/insert-visual`;
    return this.post(url, data);
  }

  deleteVisualization(data: IDeleteVisualization) {
    const url = `http://172.16.199.24:8002/visualizations/${data.visualId}/delete-visual`;
    return this.delete(url);
  }

  editVisualization(data: IEditVisualization, visualId: string) {
    const url = `http://172.16.199.24:8002/visualizations/${visualId}/edit-visual`;
    return this.patch(url, data);
  }

  getListBrowseDashboard(params: IGetBrowse) {
    const url = `http://172.16.199.24:8002/dashboard/list-browse-dashboards`;
    return this.get(url, params);
  }

  getListBrowseQueries(params: IGetBrowse) {
    const url = `http://172.16.199.24:8002/queries/list-browse-queries`;
    return this.get(url, params);
  }

  /* End of Query page */
}
