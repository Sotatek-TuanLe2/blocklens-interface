import { forwardRef, useState } from 'react';
import ModalConnectWallet from 'src/modals/ModalConnectWallet';
import AppButton, { AppButtonProps } from './AppButton';

const AppConnectWalletButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (props, ref) => {
    const [isOpenConnectWalletModal, setIsOpenConnectWalletModal] = useState<boolean>(false);

    const onToggleConnectWalletModal = () => {
      setIsOpenConnectWalletModal(prevState => !prevState);
    };

    const _renderUnconnectedWallet = () => (
      <AppButton
        size="lg"
        onClick={onToggleConnectWalletModal}
      >
        Connect wallet
      </AppButton>
    );

    const _renderConnectedWallet = () => {
      return null;
    };

    return (
      <>
        <ModalConnectWallet
          open={isOpenConnectWalletModal}
          onClose={onToggleConnectWalletModal}
        />
      </>
    );
  }
);