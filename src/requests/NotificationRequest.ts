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
    const url = `/my/stats/app/${appId}/metric-today`;
    return this.get(url);
  }

  getWebhookStats(registrationId: string) {
    const url = `/my/stats/registration/${registrationId}/metric-today`;
    return this.get(url);
  }

  getUserStats() {
    const url = `/my/stats/metric-today`;
    return this.get(url);
  }

  getMessagesHistory(hash: string, params: any) {
    const url = `/message-histories/${hash}`;
    return this.get(url, params);
  }

  retryActivity(hash: string) {
    const url = `/activities/${hash}/retry`;
    return this.post(url);
  }
}
