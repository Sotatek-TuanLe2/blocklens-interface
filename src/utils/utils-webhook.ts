import { formatShortText } from './utils-helper';

export const enum STATUS {
  WAITING = 'WAITING',
  DONE = 'DONE',
  FAILED = 'FAILED',
  SUCCESSFUL = 'SUCCESSFUL',
  PROCESSING = 'PROCESSING',
}

export enum WEBHOOK_STATUS {
  DISABLED = 0,
  ENABLE = 1,
}

export const WEBHOOK_TYPES = {
  NFT_ACTIVITY: 'NFT_ACTIVITY',
  ADDRESS_ACTIVITY: 'ADDRESS_ACTIVITY',
  TOKEN_ACTIVITY: 'TOKEN_ACTIVITY',
  CONTRACT_ACTIVITY: 'CONTRACT_ACTIVITY',
  APTOS_COIN_ACTIVITY: 'APTOS_COIN_ACTIVITY',
  APTOS_TOKEN_ACTIVITY: 'APTOS_TOKEN_ACTIVITY',
  APTOS_MODULE_ACTIVITY: 'APTOS_MODULE_ACTIVITY',
};

export const WEBHOOK_TYPES_NAME = {
  NFT_ACTIVITY: 'NFT ACTIVITY',
  ADDRESS_ACTIVITY: 'ADDRESS ACTIVITY',
  TOKEN_ACTIVITY: 'TOKEN ACTIVITY',
  CONTRACT_ACTIVITY: 'CONTRACT ACTIVITY',
  APTOS_COIN_ACTIVITY: 'COIN ACTIVITY',
  APTOS_TOKEN_ACTIVITY: 'TOKEN ACTIVITY',
  APTOS_MODULE_ACTIVITY: 'MODULE ACTIVITY',
};

export const WEBHOOK_TYPES_EVM = [
  WEBHOOK_TYPES.ADDRESS_ACTIVITY,
  WEBHOOK_TYPES.CONTRACT_ACTIVITY,
  WEBHOOK_TYPES.NFT_ACTIVITY,
  WEBHOOK_TYPES.TOKEN_ACTIVITY,
];

export const WEBHOOK_TYPES_APTOS = [
  WEBHOOK_TYPES.ADDRESS_ACTIVITY,
  WEBHOOK_TYPES.APTOS_COIN_ACTIVITY,
  WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY,
  WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY,
];

export const getNameWebhook = (type: string) => {
  switch (type) {
    case WEBHOOK_TYPES.ADDRESS_ACTIVITY: {
      return 'Address Activity';
    }
    case WEBHOOK_TYPES.NFT_ACTIVITY: {
      return 'NFT Activity';
    }
    case WEBHOOK_TYPES.CONTRACT_ACTIVITY: {
      return 'Contract Activity';
    }
    case WEBHOOK_TYPES.TOKEN_ACTIVITY: {
      return 'Token Activity';
    }
    case WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY: {
      return 'Module Activity';
    }
    case WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY: {
      return 'Token Activity';
    }
    case WEBHOOK_TYPES.APTOS_COIN_ACTIVITY: {
      return 'Coin Activity';
    }
    default: {
      return 'Address Activity';
    }
  }
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
    label: 'Processing',
    value: STATUS.PROCESSING,
  },
];

export const optionsFilterMessage = [
  {
    label: 'All status',
    value: '',
  },
  {
    label: 'Successful',
    value: STATUS.SUCCESSFUL,
  },
  {
    label: 'Failed',
    value: STATUS.FAILED,
  },
];

export interface IWebhook {
  appId: string;
  userId: string;
  registrationId: string;
  network: string;
  chain: string;
  webhook: string;
  status: WEBHOOK_STATUS;
  type: string;
  metadata: {
    addresses: string[];
    address: string;
    tokenIds: string[];
    abi: any[];
    abiFilter: any[];
    coinType?: string;
    events?: string[];
    functions?: string[];
    creatorAddress?: string;
    collectionName?: string;
    name?: string;
  };
}

export interface IMessages {
  appId: string;
  registrationId: string;
  txHash: string;
  block: string;
  trackingAddress: string;
  notificationHash: string;
  output: any;
  input: any;
  tnxId: string;
  startTime: number;
  endTime: number;
  createdAt: number;
  updatedAt: number;
  metadata: any;
}

export interface IActivityResponse {
  hash: string;
  userId: number;
  registrationId: number;
  type: string;
  lastStatus: string;
  statusCode: number;
  webhook: string;
  metadata: any;
  errs: string[];
  tokenIds: string[];
  method: string;
  retryTime: number;
  createdAt: number;
  updatedAt: number;
  block: string;
  trackingAddress: string;
  transactionHash: string;
}

export const getColorBrandStatus = (status: string) => {
  switch (status) {
    case STATUS.DONE:
      return 'active';
    case STATUS.FAILED:
      return 'inactive';
    default:
      return 'inactive';
  }
};

export const CHAINS = {
  APTOS: 'APTOS',
  ETH: 'ETH',
  SUI: 'SUI',
};

export interface ExposedFunctionType {
  name: string;
  generic_type_params: any[];
  is_entry: boolean;
  is_view: boolean;
  params: string[];
  return: any[];
  visibility: string;
}

export interface StructType {
  name: string;
  abilities: string[];
  fields: {
    name: string;
    type: string;
  }[];
  generic_type_params: any[];
}

export interface ModuleType {
  name: string;
  abi: {
    address: string;
    exposed_functions: ExposedFunctionType[];
    friends: any[];
    name: string;
    structs: StructType[];
  };
}

export interface PackageType {
  name: string;
  modules: ModuleType[];
}

export const RESOLUTION_TIME = {
  DAY: 86400,
  HOUR: 3600,
};

export const optionsFilterByDuration = [
  {
    label: 'Last 24 hours',
    value: '24h',
  },
  {
    label: 'Last 7 days',
    value: '7d',
  },
  {
    label: 'Last 30 days',
    value: '30d',
  },
];

export const formatTokenData = (webhook: IWebhook) => {
  if (!webhook || !webhook?.metadata) return '--';

  const { name, creatorAddress, collectionName } = webhook?.metadata;

  return `${formatShortText(creatorAddress || '')}::${collectionName || ''} 
  ${name ? `::${formatShortText(name)}` : ''}`;
};
