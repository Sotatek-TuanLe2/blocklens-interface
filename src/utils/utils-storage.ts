import config from 'src/config';
import { WALLET_CONNECT } from 'src/connectors';
import { DEFAULT_QUERY_VISUALIZATION_HEIGHT } from './common';

const env = process.env.REACT_APP_ENV || 'prod';

const PREFERENCES = `blocklens-preferences-${env}`;

type StorageInterface = {
  accessToken?: string;
  refreshToken?: string;
  network: string;
  chainId?: string;
  connectorId?: string;
  account?: string;
  expireTime?: number;
  listTagHistory?: string[];
  queryVisualizationHeight: number;
};

const defaultPreferences: StorageInterface = {
  network: config.defaultNetwork,
  queryVisualizationHeight: DEFAULT_QUERY_VISUALIZATION_HEIGHT,
};

function getStorage(): StorageInterface {
  const preferencesString = localStorage.getItem(PREFERENCES);
  const preferences = JSON.parse(preferencesString || '{}');
  return {
    ...defaultPreferences,
    ...preferences,
  };
}

function setStorage(type: string, value: StorageInterface) {
  localStorage.setItem(type, JSON.stringify(value));
}

class Storage {
  static init() {
    const preferences = getStorage();
    setStorage(PREFERENCES, preferences);
  }

  static getAccessToken(): string | undefined {
    const { accessToken } = getStorage();
    return accessToken;
  }

  static getExpireTimeToken(): number | undefined {
    const { expireTime } = getStorage();
    return expireTime;
  }

  static getRefreshToken(): string | undefined {
    const { refreshToken } = getStorage();
    return refreshToken;
  }

  static getNetwork(): string {
    const { network } = getStorage();
    return network || '';
  }

  static getChainId(): string {
    const { chainId } = getStorage();
    return chainId || '';
  }

  static getConnectorId(): string | undefined {
    const { connectorId } = getStorage();
    return connectorId || '';
  }

  static getAccountAddress(): string | undefined {
    const { account } = getStorage();
    return account || '';
  }

  static getQueryVisualizationHeight(): number {
    const { queryVisualizationHeight } = getStorage();
    return queryVisualizationHeight;
  }

  static getSavedTagHistory(isDashboard: boolean): string[] {
    const storageKey = isDashboard
      ? 'recentlyDashboardTagSearch'
      : 'recentlyQueryTagSearch';
    const savedTagHistory = localStorage.getItem(storageKey);
    return savedTagHistory ? JSON.parse(savedTagHistory) : [];
  }

  static setAccessToken(accessToken: string, expireTime: number) {
    const preferences = getStorage();
    preferences.accessToken = accessToken;
    preferences.expireTime = expireTime;
    setStorage(PREFERENCES, preferences);
  }

  static setRefreshToken(refreshToken: string) {
    const preferences = getStorage();
    preferences.refreshToken = refreshToken;
    setStorage(PREFERENCES, preferences);
  }

  static setQueryVisualizationHeight(queryVisualizationHeight: number) {
    const preferences = getStorage();
    preferences.queryVisualizationHeight = queryVisualizationHeight;
    setStorage(PREFERENCES, preferences);
  }

  static setNetwork(network: string) {
    const preferences = getStorage();
    preferences.network = network;
    setStorage(PREFERENCES, preferences);
  }

  static setChainId(chainId: string | number) {
    const preferences = getStorage();
    preferences.chainId = `${chainId}`;
    setStorage(PREFERENCES, preferences);
  }

  static setConnectorId(connectorId: string) {
    const preferences = getStorage();
    preferences.connectorId = connectorId;
    setStorage(PREFERENCES, preferences);
  }

  static setAccountAddress(account: string) {
    const preferences = getStorage();
    preferences.account = account;
    setStorage(PREFERENCES, preferences);
  }

  static setSavedTagHistory(isDashboard: boolean, updatedTagHistory: string[]) {
    const storageKey = isDashboard
      ? 'recentlyDashboardTagSearch'
      : 'recentlyQueryTagSearch';
    localStorage.setItem(storageKey, JSON.stringify(updatedTagHistory));
  }
  static clearAccessToken() {
    const preferences = getStorage();
    delete preferences.accessToken;
    delete preferences.expireTime;
    setStorage(PREFERENCES, preferences);
  }

  static clearRefreshToken() {
    const preferences = getStorage();
    delete preferences.refreshToken;
    setStorage(PREFERENCES, preferences);
  }

  static clearConnectorId() {
    const preferences = getStorage();
    delete preferences.connectorId;
    setStorage(PREFERENCES, preferences);
  }

  static clearAccountAddress() {
    const preferences = getStorage();
    delete preferences.account;
    setStorage(PREFERENCES, preferences);
  }

  static clearWallet() {
    if (this.getConnectorId() === WALLET_CONNECT) {
      localStorage.removeItem('walletconnect');
    }
    Storage.clearConnectorId();
    Storage.clearAccountAddress();
  }

  static logout() {
    Storage.clearAccessToken();
    Storage.clearRefreshToken();
    Storage.clearWallet();
  }
}

export default Storage;
