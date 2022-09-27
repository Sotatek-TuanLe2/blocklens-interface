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

  createApp(params: any) {
    const url = '/my/apps';
    return this.post(url, params);
  }

  getAppDetail(id: number) {
    const url = `/my/apps/${id}`;
    return this.get(url);
  }
}
