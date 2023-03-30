import BaseRequest from './BaseRequest';

interface DashboardsParams {
  order: string;
  time_range: string;
  q: string;
}

interface SchemasParams {
  category: string;
}

export default class DashboardsRequest extends BaseRequest {
  getUrlPrefix(): string {
    return "https://64240853d6152a4d4804ca2f.mockapi.io/blocklens-dashboards";
  }

  getDashboards(params: DashboardsParams) {
    const url = '/dashboards';
    return this.get(url, { ...params });
  }

  getSchemas(params: SchemasParams) {
    const url = '/schemas';
    return this.get(url, { ...params });
  }
}