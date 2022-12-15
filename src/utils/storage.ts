const env = process.env.REACT_APP_ENV || 'prod';

const PREFERENCES = `blocksniper-preferences-${env}`;

type StorageInterface = {
  accessToken?: string;
  refreshToken?: string;
};

function getStorage(): StorageInterface {
  const preferencesString = localStorage.getItem(PREFERENCES);
  const preferences = JSON.parse(preferencesString || '{}');
  return {
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

  static getRefreshToken(): string | undefined {
    const { refreshToken } = getStorage();
    return refreshToken;
  }

  static setAccessToken(accessToken: string) {
    const preferences = getStorage();
    preferences.accessToken = accessToken;
    setStorage(PREFERENCES, preferences);
  }

  static setRefreshToken(refreshToken: string) {
    const preferences = getStorage();
    preferences.refreshToken = refreshToken;
    setStorage(PREFERENCES, preferences);
  }

  static clearAccessToken() {
    const preferences = getStorage();
    delete preferences.accessToken;
    setStorage(PREFERENCES, preferences);
  }

  static clearRefreshToken() {
    const preferences = getStorage();
    delete preferences.refreshToken;
    setStorage(PREFERENCES, preferences);
  }

  static logout() {
    Storage.clearAccessToken();
    Storage.clearRefreshToken();
  }
}

export default Storage;
