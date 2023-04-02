import BaseRequest from './BaseRequest';

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
}
