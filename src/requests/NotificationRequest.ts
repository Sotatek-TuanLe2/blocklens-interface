import config from 'src/config';
import BaseRequest from './BaseRequest';

export default class NotificationRequest extends BaseRequest {
  getUrlPrefix(): string {
    return config.api.notificationsApi;
  }

  getActivities(registrationId: string, params: any) {
    const url = `/webhook-${registrationId}/activities`;
    return this.get(url, { ...params });
  }

  getAppStats(projectId: string, params: any) {
    const url = `/metrics/project/${projectId}/metrics`;
    return this.get(url, params);
  }

  getWebhookStats(registrationId: string, params: any) {
    const url = `/metrics/registration/${registrationId}/metrics`;
    return this.get(url, { ...params, registrationId });
  }

  getUserStats(params: any) {
    const url = `/metrics/user-metrics`;
    return this.get(url, params);
  }

  getAppStatsToday(projectId: string) {
    const url = `/project-${projectId}/statistics`;
    return this.get(url, { projectId });
  }

  getAppMetricToday(params: any) {
    const url = `/metrics/project/metrics-today`;
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

  getMessagesHistory(notificationHash: string, params: any) {
    const url = `/activities/${notificationHash}/message-histories`;
    return this.get(url, params);
  }

  retryActivity(hash: string) {
    const url = `/activities/${hash}/retry`;
    return this.post(url);
  }
}
