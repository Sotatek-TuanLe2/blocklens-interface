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

  getAppStats(appId: string) {
    const url = `/my/notifications/app-${appId}/statistics`;
    return this.get(url);
  }

  getWebhookStats(registrationId: string) {
    const url = `/my/notifications/webhook-${registrationId}/statistics`;
    return this.get(url);
  }

  getUserStats() {
    const url = `/my/notifications/statistics`;
    return this.get(url);
  }
}
