import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import config from 'src/config';

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
  async signMessage(): Promise<any> {
    if (this.account && this.connector && this.provider) {
      try {
        const provider = new Web3Provider(this.provider);
        const signature = await provider.send('personal_sign', [
          ethers.utils.hexlify(ethers.utils.toUtf8Bytes(config.auth.message)),
          this.account.toLowerCase(),
        ]);
        return signature;
      } catch (error) {
        console.error(error);
        console.error('Signing message failed!');
        throw error;
      }
    }
  }
}

export default BaseConnector;
