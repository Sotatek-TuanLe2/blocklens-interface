export const enum STATUS {
  WAITING = 'WAITING',
  DONE = 'DONE',
  FAILED = 'FAILED',
}

export enum WEBHOOK_STATUS {
  DISABLED = 0,
  ENABLE = 1,
}

export const WEBHOOK_TYPES = {
  NFT_ACTIVITY: 'NFT_ACTIVITY',
  ADDRESS_ACTIVITY: 'ADDRESS_ACTIVITY',
  CONTRACT_ACTIVITY: 'CONTRACT_ACTIVITY',
};

export const optionsFilter = [
  {
    label: 'All status',
    value: '',
  },
  {
    label: 'Successful',
    value: STATUS.DONE,
  },
  {
    label: 'Failed',
    value: STATUS.FAILED,
  },
  {
    label: 'Retrying',
    value: STATUS.WAITING,
  },
];

export interface IWebhook {
  appId: string;
  userId: string;
  registrationId: string;
  network: string;
  webhook: string;
  status: WEBHOOK_STATUS;
  type: string;
  metadata: {
    addresses: string[];
    address: string;
    tokenIds: string[];
    abi: any[];
    abiFilter: any[];
  };
}

export interface IMessages {
  appId: string;
  registrationId: string;
  txHash: string;
  trackingAddress: string;
  notificationHash: string;
  output: any;
  input: any;
  startTime: number;
  endTime: number;
  createdAt: number;
  updatedAt: number;
  metadata: any;
}

export const getColorBrandStatus = (status: string) => {
  switch (status) {
    case STATUS.WAITING:
      return 'waiting';
    case STATUS.DONE:
      return 'active';
    case STATUS.FAILED:
      return 'inactive';
    default:
      return 'inactive';
  }
};