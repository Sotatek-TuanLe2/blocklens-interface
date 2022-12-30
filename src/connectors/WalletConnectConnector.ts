import { Web3Provider } from '@ethersproject/providers';
import { WalletConnectConnector as WalletConnectProvider } from '@web3-react/walletconnect-connector';
import config from 'src/config';
import Storage from 'src/utils/utils-storage';
import { WALLET_CONNECT } from '.';
import BaseConnector from './BaseConnector';

class WalletConnectConnector extends BaseConnector {
  getName(): string {
    return 'WalletConnect';
  }

  getId(): string {
    return WALLET_CONNECT;
  }

  /**
   * connect wallet
   * @returns provider
   */
  async connect() {
    const connector = new WalletConnectProvider(this.options);
    await connector.activate();
    const provider = await connector.getProvider();
    this.connector = connector;
    this.provider = provider;
    return provider;
  }

  async signMessage(): Promise<any> {
    if (this.account && this.connector && this.provider) {
      try {
        const signer = new Web3Provider(this.provider).getSigner();
        const domain = {
          name: config.auth.domain,
          version: '2',
          chainId: Storage.getChainId() || config.defaultChainId,
        };
        const types = {
          message: [
            { name: 'address', type: 'address' },
            { name: 'message', type: 'string' },
          ],
        };
        const message = {
          address: this.account,
          message: config.auth.message,
        };
        const signature = await signer._signTypedData(domain, types, message);
        return signature;
      } catch (error) {
        console.error(error);
        console.error('Signing message failed!');
        throw error;
      }
    }
  }
}

export default WalletConnectConnector;
