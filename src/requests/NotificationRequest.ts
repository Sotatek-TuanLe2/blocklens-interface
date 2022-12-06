import config from 'src/config';
import BaseRequest from './BaseRequest';

export default class NotificationRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.notificationsApi;
  }

  getActivities(registrationId: string, params: any) {
    const url = `/activities/${registrationId}`;
    return this.get(url, { ...params });
  }

  getAppStats(appId: string) {
    const url = `/activities/app-${appId}/statistics`;
    return this.get(url);
  }

  getWebhookStats(registrationId: string) {
    const url = `/activities/webhook-${registrationId}/statistics`;
    return this.get(url);
  }

  getUserStats() {
    const url = `/activities/statistics`;
    return this.get(url);
  }

  getMessagesHistory(hash: string) {
    const url = `/message-histories/${hash}`;
    return this.get(url);
  }

  retryActivity(hash: string) {
    const url = `/activities/${hash}/retry`;
    return this.post(url);
  }
}
