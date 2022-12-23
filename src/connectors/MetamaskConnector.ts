import { InjectedConnector } from '@web3-react/injected-connector';
import { METAMASK_WALLET } from '.';
import BaseConnector from './BaseConnector';

declare global {
  interface Window {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ethereum: any;
  }
}

const isInstalled = () => {
  return !!window.ethereum;
};

class MetamaskConnector extends BaseConnector {
  getName() {
    return 'MetaMask';
  }

  getId(): string {
    return METAMASK_WALLET;
  }

  /**
   * connect wallet
   * @returns provider
   */
  async connect() {
    if (!isInstalled()) {
      return null;
    }
    const connector = new InjectedConnector(this.options);
    await connector.activate();

    const provider = await connector.getProvider();
    this.connector = connector;
    this.provider = provider;
    return provider;
  }
}

export default MetamaskConnector;
