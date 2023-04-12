import { Layout } from 'react-grid-layout';
import BaseRequest from './BaseRequest';
import { QueryType } from '../utils/visualization.type';

export interface DashboardsParams {
  order?: string;
  timeRange?: string;
  search?: string;
  tags?: string;
}

interface SchemasParams {
  category: string;
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
  id: number;
}

export default class DashboardsRequest extends BaseRequest {
  getUrlPrefix(): string {
    return '';
  }

  getDashboards(params: DashboardsParams) {
    const url = 'https://run.mocky.io/v3/8deb0b1a-289e-4f91-8669-679338169925';
    return this.get(url, { ...params });
  }

  getSchemas(params: SchemasParams) {
    const url = 'https://run.mocky.io/v3/0833bca4-9039-49f0-b8c5-98ce577cf2d0';
    return this.get(url, { ...params });
  }

  getQueries(params: QueriesParams) {
    const url = 'https://run.mocky.io/v3/1fc26a41-6ebc-43fc-88a8-b2c36d9fe085';
    return this.get(url, { ...params });
  }

  getQueriesValues() {
    const url = 'https://run.mocky.io/v3/c2d9b9cf-afd4-4aad-ac74-7c770669525f';
    return this.get(url);
  }

  createNewQuery(query: QueryType) {
    const url = 'https://642cf0d966a20ec9ce915e71.mockapi.io/queries/queries';
    return this.post(url, query);
  }

  getQuery(queryId: string) {
    const url = `https://642cf0d966a20ec9ce915e71.mockapi.io/queries/queries/${queryId}`;
    return this.get(url);
  }

  updateQuery(queryId: string, query: Partial<QueryType>) {
    const url = `https://642cf0d966a20ec9ce915e71.mockapi.io/queries/queries/${queryId}`;
    return this.put(url, query);
  }

  getPopularDashboardTags() {
    const url = 'https://run.mocky.io/v3/fd2b3e65-6c5f-44f1-bc61-e7249645f1c3';
    return this.get(url);
  }

  getPopularQueryTags() {
    const url = 'https://run.mocky.io/v3/50864550-87f8-41ae-9985-a15289cf7f77';
    return this.get(url);
  }

  getWizards(params: WizardsParams) {
    const url = 'https://run.mocky.io/v3/2e1577c1-7a87-412e-8a49-e161462168db';
    return this.get(url, params);
  }

  getTeams(params: TeamsParams) {
    const url = 'https://run.mocky.io/v3/0f280d1a-e11c-4cf7-bce9-6a530d2303e4';
    return this.get(url, params);
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
}
