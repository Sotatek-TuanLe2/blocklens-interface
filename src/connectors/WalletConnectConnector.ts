import { WalletConnectConnector as WalletConnectProvider } from '@web3-react/walletconnect-connector';
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
}

export default WalletConnectConnector;
