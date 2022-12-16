import { Web3Provider } from '@ethersproject/providers';
import Storage from 'src/utils/utils-storage';
import config from 'src/config';

const domain = {
  name: config.auth.domain,
  version: '2',
  chainId: '97',
};

const types = {
  message: [
    { name: 'address', type: 'address' },
    { name: 'message', type: 'string' },
  ],
};

class BaseConnector {
  public options: any;
  public connector: any;
  public provider: any;
  public account: any;
  public network: any;

  constructor(options: any = {}) {
    this.options = options;
  }

  async connect() {
    return;
  }

  async disconnect() {
    if (!this.provider) {
      return;
    }
    return this.provider.disconnect();
  }

  getId() {
    return '';
  }

  getName() {
    return '';
  }

  logout(): any {
    return true;
  }

  /**
   * check if provider exists
   * @returns boolean
   */
  isLoggedIn(): boolean {
    return !!this.provider;
  }

  /**
   * get account and network of the logged in wallet
   * @returns account
   */
  async getAccount(provider: any = this.provider): Promise<any> {
    try {
      const web3Provider = new Web3Provider(provider);
      const network = await web3Provider.getNetwork();
      const [account] = await web3Provider.listAccounts(); // listAccounts()[0]
      this.network = network;
      this.account = account;
      return account;
    } catch (error) {
      throw new Error('Wallet has not been connected yet!');
    }
  }

  /**
   * sign a signature and save token into localStorage
   */
  async signMessage(_payload?: any): Promise<any> {
    if (this.account && this.connector && this.provider) {
      try {
        const message = {
          address: this.account,
          message: config.auth.message,
        };
        const signer = new Web3Provider(this.provider).getSigner();

        // domain.chainId = Storage.getChainId() || '97';
        // const signature = await signer._signTypedData(domain, types, message);
        // return signature;
      } catch (error) {
        console.error(error);
        console.error('Signing message failed!');
        throw error;
      }
    }
  }
}

export default BaseConnector;
