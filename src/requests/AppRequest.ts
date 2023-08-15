import config from 'src/config';
import BaseRequest from './BaseRequest';

export default class AppRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.baseUrlApi;
  }

  getListApp(params: any) {
    const url = '/my/projects';
    return this.get(url, { ...params });
  }

  getAppStatsOfUser() {
    const url = '/my/projects/stats';
    return this.get(url);
  }

  getTotalWebhookEachApp(params: any) {
    const url = '/my/projects/webhook/count';
    return this.get(url, params);
  }

  createApp(params: any) {
    const url = '/my/projects';
    return this.post(url, params);
  }

  updateApp(projectId: string, params: any) {
    const url = `/my/projects/${projectId}`;
    return this.patch(url, params);
  }

  deleteApp(projectId: string) {
    const url = `/my/projects/${projectId}`;
    return this.delete(url);
  }

  getAppDetail(projectId: string) {
    const url = `/my/projects/${projectId}`;
    return this.get(url);
  }
}
