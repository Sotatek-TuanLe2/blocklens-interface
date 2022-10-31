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
  status: APP_STATUS;
}
