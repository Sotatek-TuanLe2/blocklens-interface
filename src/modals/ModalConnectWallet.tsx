import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import config from 'src/config';
import { METAMASK_WALLET } from 'src/connectors';
import useWallet from 'src/hooks/useWallet';
import { setOpenModalSignatureRequired } from 'src/store/wallet';
import { getErrorMessage } from 'src/utils/utils-helper';
import { switchNetwork } from 'src/utils/utils-network';
import { toastError } from 'src/utils/utils-notify';
import Storage from 'src/utils/utils-storage';
import BaseModal from './BaseModal';

interface IModalConnectWallet {
  open: boolean;
  onClose: () => void;
}

const ModalConnectWallet: FC<IModalConnectWallet> = ({ open, onClose }) => {
  const { wallet, connectWallet, isUserLinked } = useWallet();
  const defaultNetwork = wallet ? wallet.getNework() : Storage.getNetwork();
  const dispatch = useDispatch();

  const onClickWallet = async (walletId: string) => {
    try {
      if ([METAMASK_WALLET].includes(walletId)) {
        const provider = (window as any).ethereum;
        await switchNetwork(defaultNetwork, provider);
      }
      await connectWallet(walletId, defaultNetwork);
      if (!isUserLinked) {
        dispatch(setOpenModalSignatureRequired(true));
      }
      onClose();
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
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
    <BaseModal size="md" title="Choose Wallet" isOpen={open} onClose={onClose}>
      <Flex justifyContent={'center'}>{_renderWallets()}</Flex>
    </BaseModal>
  );
};

export default ModalConnectWallet;
