import config from 'src/config';
import BaseRequest from './BaseRequest';

interface IStatParams {
  from: number;
  to: number;
  resolution: number;
}

export default class NotificationRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.notificationsApi;
  }

  getActivities(registrationId: string, params: any) {
    const url = `/webhook-${registrationId}/activities`;
    return this.get(url, { ...params });
  }

  getAppStats(projectId: string, params: IStatParams) {
    const url = `/project-${projectId}/metrics`;
    return this.get(url, params);
  }

  getAppStats24h(projectIds: string[]) {
    const url = '/projects/metrics-24h';
    return this.get(url, { projectIds });
  }

  getWebhookStats(registrationId: string, params: IStatParams) {
    const url = `/webhook-${registrationId}/metrics`;
    return this.get(url, params);
  }

  getWebhookStats24h(webhookIds: string[]) {
    const url = '/webhooks/metrics-24h';
    return this.get(url, { webhookIds });
  }

  getUserStats(params: IStatParams) {
    const url = `/users/metrics`;
    return this.get(url, params);
  }

  getUserStats24h() {
    const url = `/users/metrics-24h`;
    return this.get(url);
  }

  getAppStatsToday(projectId: string) {
    const url = `/project-${projectId}/statistics`;
    return this.get(url, { projectId });
  }

  getAppMetricToday(params: any) {
    const url = `/project/metrics-today`;
    return this.get(url, params);
  }

  getWebhookMetricToday(params: any) {
    const url = `/registration/metrics-24h`;
    return this.get(url, params);
  }

  getWebhookStatsToday(registrationId: string) {
    const url = `/webhook-${registrationId}/statistics`;
    return this.get(url);
  }

  getUserStatsToday() {
    const url = `/stats/metric-today`;
    return this.get(url);
  }

  getMessagesHistory(activityHash: string, params: any) {
    const url = `/activities/${activityHash}/message-histories`;
    return this.get(url, params);
  }

  retryActivity(hash: string) {
    const url = `/activities/${hash}/retry`;
    return this.post(url);
  }
}
