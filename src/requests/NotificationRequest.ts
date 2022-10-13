import config from 'src/config';
import BaseRequest from './BaseRequest';

export default class NotificationRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.notificationsApi;
  }

  getNotifications(params: any) {
    const url = '/my/notifications';
    return this.get(url, { ...params });
  }
}
