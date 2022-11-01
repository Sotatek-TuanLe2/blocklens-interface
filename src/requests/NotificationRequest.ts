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

  getAppStatistics(appId: string) {
    const url = `/my/notifications/app-${appId}/statistics`;
    return this.get(url);
  }

  getWebhookStatistics(registrationId: string) {
    const url = `/my/notifications/webhook-${registrationId}/statistics`;
    return this.get(url);
  }
}
