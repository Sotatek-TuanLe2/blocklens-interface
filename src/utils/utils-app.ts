export enum APP_STATUS {
  DISABLED = 0,
  ENABLE = 1,
}

export interface IAppResponse {
  appId: number;
  userId: number;
  name?: string;
  description?: string;
  chain: string;
  network: string;
  key: string;
  totalUserNotification: number;
  totalAppNotification: number;
  totalAppNotificationLast24Hours: number;
  totalAppNotificationSuccessLast24Hours: number;
  status: APP_STATUS;
}
