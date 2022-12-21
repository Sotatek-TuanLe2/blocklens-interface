import config from 'src/config';
import BaseRequest from './BaseRequest';

export default class AppRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.baseUrlApi;
  }

  getListApp(params: any) {
    const url = '/my/apps';
    return this.get(url, { ...params });
  }

  getAppStatsOfUser() {
    const url = '/my/apps/stats';
    return this.get(url);
  }

  createApp(params: any) {
    const url = '/my/apps';
    return this.post(url, params);
  }

  updateApp(appId: string, params: any) {
    const url = `/my/apps/${appId}`;
    return this.patch(url, params);
  }

  deleteApp(appId: string) {
    const url = `/my/apps/${appId}`;
    return this.delete(url);
  }

  toggleApp(appId: string) {
    const url = `/my/apps/${appId}/toggle`;
    return this.patch(url);
  }

  getAppDetail(id: string) {
    const url = `/my/apps/${id}`;
    return this.get(url);
  }
}
