import { initializeConnector, Web3ReactHooks } from '@web3-react/core';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import config from 'src/config';
import { WALLET_CONNECT } from '.';
import BaseConnector from './BaseConnector';

class WalletConnectConnector2 extends BaseConnector {
  getName(): string {
    return 'WalletConnect';
  }

  getId(): string {
    return WALLET_CONNECT;
  }

  initiate(): {
    connector: WalletConnectV2;
    hooks: Web3ReactHooks;
  } | null {
    const projectId = config.connectors[this.getId()].projectId;
    if (!projectId) {
      return null;
    }

    const chains = Object.keys(config.networks).map(
      (network) => config.networks[network].chainId,
    );

    const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
      (actions) =>
        new WalletConnectV2({
          actions,
          options: {
            projectId,
            chains,
            showQrModal: true,
          },
        }),
    );

    return { connector: walletConnectV2, hooks };
  }

  /**
   * connect wallet
   * @returns provider
   */
  async connect(chainId = config.networks[config.defaultNetwork].chainId) {
    const initialWallet = this.initiate();
    if (!initialWallet) {
      return;
    }

    const { connector } = initialWallet;
    await connector.activate(chainId);
    this.connector = connector;
    this.provider = connector.provider;
    return this.provider;
  }

  async getAccount() {
    const [account] = this.provider.accounts;
    if (!account) {
      throw new Error('Wallet has not been connected yet!');
    }

    this.network = this.provider.chainId;
    this.account = account;
    return this.account;
  }

  async getAccounts() {
    return this.provider.accounts;
  }
}

export default WalletConnectConnector2;
