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

  getAppStats(appId: string, params: any) {
    const url = `/stats/app/${appId}`;
    return this.get(url, params);
  }

  getWebhookStats(registrationId: string, params: any) {
    const url = `/stats/registration/${registrationId}`;
    return this.get(url, params);
  }

  getUserStats(params: any) {
    const url = `/stats`;
    return this.get(url, params);
  }

  getAppStatsToday(appId: string) {
    const url = `/stats/app/${appId}/metric-today`;
    return this.get(url);
  }

  getAppMetricToday(params: any) {
    const url = `/stats/app/metric-today`;
    return this.get(url, params);
  }

  getWebhookStatsToday(registrationId: string) {
    const url = `/stats/registration/${registrationId}/metric-today`;
    return this.get(url);
  }

  getUserStatsToday() {
    const url = `/stats/metric-today`;
    return this.get(url);
  }

  getMessagesHistory(hash: string, params: any) {
    const url = `/notifications/message-histories/${hash}`;
    return this.get(url, params);
  }

  retryActivity(hash: string) {
    const url = `/activities/${hash}/retry`;
    return this.post(url);
  }
}
