import { Layout } from 'react-grid-layout';
import BaseRequest from './BaseRequest';
import { QueryType } from '../utils/common';

export interface DashboardsParams {
  order?: string;
  time_range?: string;
  q?: string;
  tags?: string;
}

interface SchemasParams {
  category: string;
}

export interface QueriesParams {
  order?: string;
  time_range?: string;
  q?: string;
  tags?: string;
}

export interface WizardsParams {
  q?: string;
}

export interface TeamsParams {
  q?: string;
}

export interface ILayout extends Layout {
  id: number;
}

export default class DashboardsRequest extends BaseRequest {
  getUrlPrefix(): string {
    return '';
  }

  getDashboards(params: DashboardsParams) {
    const url = 'https://run.mocky.io/v3/3ac95d0b-00bb-4343-bb1d-4f3c2fc780fe';
    return this.get(url, { ...params });
  }

  getSchemas(params: SchemasParams) {
    const url = 'https://run.mocky.io/v3/0833bca4-9039-49f0-b8c5-98ce577cf2d0';
    return this.get(url, { ...params });
  }

  getQueries(params: QueriesParams) {
    const url = 'https://run.mocky.io/v3/dbfc2015-6b31-4cf3-953d-34fce07d3d64';
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
    const url = `https://642bcf7fd7081590f92a4f26.mockapi.io/blocklens/layouts`;
    return this.get(url);
  }
  addDashboardItem(data: ILayout) {
    const url = `https://642bcf7fd7081590f92a4f26.mockapi.io/blocklens/layouts`;
    return this.post(url, data);
  }
  updateDashboardItem(data: ILayout) {
    const url = `https://642bcf7fd7081590f92a4f26.mockapi.io/blocklens/layouts/${data.id}`;
    return this.put(url, data);
  }
  removeDashboardItem(id: ILayout) {
    const url = `https://642bcf7fd7081590f92a4f26.mockapi.io/blocklens/layouts/${id}`;
    return this.delete(url, id);
  }
}
