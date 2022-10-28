export enum WEBHOOK_STATUS {
  DISABLED = 0,
  ENABLE = 1,
}

interface IWebhook {
  userId: number;
  registrationId: number;
  network: string;
  webhook: string;
  status: WEBHOOK_STATUS;
}

export interface INFTWebhook extends IWebhook {
  contractAddress: string;
  tokenIds: string[];
}

export interface IContractWebhook extends IWebhook {
  contractAddress: string;
  abi: string[];
}

export interface IAddressWebhook extends IWebhook {
  addresses: string[];
}

export const getStatusWebhook = (status: WEBHOOK_STATUS) => {
  if (status === WEBHOOK_STATUS.ENABLE) return 'ACTIVE';
  return 'INACTIVE';
};

export const getActionWebhook = (status: WEBHOOK_STATUS) => {
  if (status === WEBHOOK_STATUS.ENABLE) return 'Deactivate';
  return 'Activate';
};
