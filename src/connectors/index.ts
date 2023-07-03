import config from 'src/config';
import MetamaskConnector from './MetamaskConnector';
import WalletConnectConnector from './WalletConnectConnector';

export const METAMASK_WALLET = 'metamask-connector';
export const WALLET_CONNECT = 'wallet-connect-connector';

const connectorList: {
  [key: string]: any;
} = {
  [METAMASK_WALLET]: MetamaskConnector,
  [WALLET_CONNECT]: WalletConnectConnector,
  // [WALLET_LINK]: WalletLinkConnector,
  // [TRUST_WALLET]: TrustWalletConnector,
  // [PHANTOM_WALLET]: PhantomConnector,
  // [SOLLET_WALLET]: SolletConnector,
  // [SOLFLARE_WALLET]: SolflareConnector,
};

export type ConnectorType = typeof connectorList[keyof typeof connectorList];

class ConnectorFactory {
  static instances: {
    [key: string]: any;
  } = {};

  static getConnector(connectorId: string, network: string): ConnectorType {
    const Connector = connectorList[connectorId];
    if (!Connector) {
      throw new Error(`Invalid connector class: ${Connector}`);
    }
    const options = config.connectors[connectorId].options[network];
    const connectorInstance = new Connector(options);
    this.instances[connectorId] = connectorInstance;
    return connectorInstance;
  }
}

export default ConnectorFactory;
