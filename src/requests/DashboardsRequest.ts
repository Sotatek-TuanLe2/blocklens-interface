import { Layout } from 'react-grid-layout';
import config from 'src/config';
import { QueryType } from '../utils/query.type';
import BaseRequest from './BaseRequest';

export interface DashboardsParams {
  search?: string;
  tags?: string;
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

export interface ListParams {
  search: string;
  limit: number;
  page: number;
}

export interface QueriesParams {
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

  getListBrowseDashboard(params: IGetBrowse) {
    const url = `/dashboard/list-browse-dashboards`;
    return this.get(url, params);
  }

  getListBrowseQueries(params: IGetBrowse) {
    const url = `/queries/list-browse-queries`;
    return this.get(url, params);
  }

  createNewDashboard(data: CreateDashboardParams) {
    const url = '/dashboard/create-dashboard';
    return this.post(url, data);
  }

  // getPopularDashboardTags() {
  //   const url = 'https://run.mocky.io/v3/fd2b3e65-6c5f-44f1-bc61-e7249645f1c3';
  //   return this.get(url);
  // }

  // getPopularQueryTags() {
  //   const url = 'https://run.mocky.io/v3/50864550-87f8-41ae-9985-a15289cf7f77';
  //   return this.get(url);
  // }

  /* End of Dashboards page */

  /* Dashboard's detail page */
  getDashboardById(id: string) {
    const url = `/dashboard/find-my-dashboard`;
    return this.get(url, id);
  }
  forkDashboard(data: ForkDashboard, id: ILayout) {
    const url = `/dashboard/fork-dashboard/${id}`;
    return this.post(url, data);
  }

  addDashboardItem(data: DataTextWidget) {
    const url = `/dashboard/insert-text-widget`;
    return this.post(url, data);
  }
  addVisualization(data: DataTextWidget) {
    const url = `/dashboard/insert-visualization-widget`;
    return this.post(url, data);
  }

  updateDashboardItem(data: ILayout, id: string) {
    const url = `/dashboard/${id}/update-dashboard`;
    return this.patch(url, data);
  }

  removeDashboardItem(id: ILayout) {
    const url = `/dashboard/text-widgets/${id}/remove-text-widget`;
    return this.delete(url, id);
  }
  removeVisualization(id: ILayout) {
    const url = `/dashboard/dashboard-visuals/${id}/remove-dashboard-visuals`;
    return this.delete(url, id);
  }

  /* End of Dashboard's detail page */

  /* Query page */

  getTables(params: TableParams) {
    const url = '/databases/tables';
    return this.get(url, { ...params });
  }

  getSchemaOfTable(params: SchemaParams) {
    const url = `/databases/${params.namespace}/${params.tableName}/schema`;
    return this.get(url);
  }

  getQueryById(params: DataQuery) {
    const url = '/queries/find-my-query';
    return this.get(url, params);
  }

  createNewQuery(query: QueryType) {
    const url = '/queries/create-query';
    return this.post(url, query);
  }

  executeQuery(queryId: string) {
    const url = '/query-executors/execute-query';
    return this.post(url, { queryId });
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

  /* End of Query page */
}
