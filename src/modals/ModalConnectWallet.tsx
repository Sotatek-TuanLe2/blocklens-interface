import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import BaseModal from './BaseModal';
import useWallet from 'src/hooks/useWallet';
import config from 'src/config';
import { toastError } from 'src/utils/utils-notify';
import { METAMASK_WALLET } from 'src/connectors';
import { switchNetwork } from 'src/utils/utils-network';
import Storage from 'src/utils/utils-storage';
import { isMobile } from 'react-device-detect';

interface IModalConnectWallet {
  open: boolean;
  onClose: () => void;
}

const ModalConnectWallet: FC<IModalConnectWallet> = ({ open, onClose }) => {
  const { wallet, connectWallet } = useWallet();
  const defaultNetwork = wallet ? wallet.getNework() : Storage.getNetwork();

  const onClickWallet = async (walletId: string) => {
    try {
      if ([METAMASK_WALLET].includes(walletId)) {
        const provider = (window as any).ethereum;
        await switchNetwork(defaultNetwork, provider);
      }
      await connectWallet(walletId, defaultNetwork);
      onClose();
    } catch (error: any) {
      error && toastError({ message: error.message || error.toString() });
    }
  };

  const _renderWallets = () => {
    return Object.keys(config.connectors).map((connectorKey) => {
      const connectorInfo = config.connectors[connectorKey];
      const { id, icon, name } = connectorInfo;
      return (
        <Box
          key={id}
          className={'box-wallet'}
          onClick={() => onClickWallet(id)}
        >
          <img src={icon} alt={name} width={isMobile ? '20px' : 'auto'} />
          <Box className={'name-wallet'}>{name}</Box>
        </Box>
      );
    });
  };

  return (
    <BaseModal size="xl" title="Choose Wallet" isOpen={open} onClose={onClose}>
      <Flex justifyContent={'center'}>{_renderWallets()}</Flex>
    </BaseModal>
  );
};

export default ModalConnectWallet;
