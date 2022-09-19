const env = process.env.REACT_APP_ENV || 'prod';

const PREFERENCES = `blocklens-preferences-${env}`;

type StorageInterface = {
  accessToken?: string;
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

  static setAccessToken(accessToken: string) {
    const preferences = getStorage();
    preferences.accessToken = accessToken;
    setStorage(PREFERENCES, preferences);
  }

  static clearAccessToken() {
    const preferences = getStorage();
    delete preferences.accessToken;
    setStorage(PREFERENCES, preferences);
  }

  static logout() {
    Storage.clearAccessToken();
  }
}

export default Storage;
