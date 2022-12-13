import { Box, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import { WalletConnectIcon, MetaMaskIcon } from 'src/assets/icons';

interface IModalConnectWallet {
  open: boolean;
  onClose: () => void;
}

const ModalConnectWallet: FC<IModalConnectWallet> = ({ open, onClose }) => {
  const onCloseModal = () => {
    onClose();
  };

  return (
    <BaseModal
      size="xl"
      title="Choose Wallet"
      isOpen={open}
      onClose={onCloseModal}
    >
      <Flex justifyContent={'center'}>
        <Box className={'box-wallet'}>
          <MetaMaskIcon />
          <Box className={'name-wallet'}>MetaMask</Box>
        </Box>
        <Box className={'box-wallet'}>
          <WalletConnectIcon />
          <Box className={'name-wallet'}>Wallet Connect</Box>
        </Box>
      </Flex>
    </BaseModal>
  );
};

export default ModalConnectWallet;
