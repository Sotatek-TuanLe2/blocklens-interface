export enum WEBHOOK_STATUS {
  DISABLED = 0,
  ENABLE = 1,
}

export const WEBHOOK_TYPES = {
  NFT_ACTIVITY: 'NFT_ACTIVITY',
  ADDRESS_ACTIVITY: 'ADDRESS_ACTIVITY',
  CONTRACT_ACTIVITY: 'CONTRACT_ACTIVITY',
};

interface IWebhook {
  appId: string
  userId: string;
  registrationId: string;
  network: string;
  webhook: string;
  status: WEBHOOK_STATUS;
}

export interface INFTWebhook extends IWebhook {
  metadata: {
    address: string;
    tokenIds: string[];
  }
}

export interface IContractWebhook extends IWebhook {
  metadata: {
    address: string;
  }
}

export interface IAddressWebhook extends IWebhook {
  metadata: {
    addresses: string[];
  }
}

export const getStatusWebhook = (status: WEBHOOK_STATUS) => {
  if (status === WEBHOOK_STATUS.ENABLE) return 'ACTIVE';
  return 'INACTIVE';
};

export const getActionWebhook = (status: WEBHOOK_STATUS) => {
  if (status === WEBHOOK_STATUS.ENABLE) return 'Deactivate';
  return 'Activate';
};
