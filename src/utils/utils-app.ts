import {ReactNode} from "react";

export enum APP_STATUS {
  DISABLED = 0,
  ENABLE = 1,
}

export interface IAppResponse {
  appId: string;
  userId: string;
  name?: string;
  description?: string;
  chain: string;
  network: string;
  key: string;
  status: APP_STATUS;
  createdAt: number;
  totalWebhook?: number;
  messageToday?: number;
}

export interface IDataMenu {
  value: string;
  icon?: ReactNode;
  label: ReactNode;
}