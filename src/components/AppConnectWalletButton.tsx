import { forwardRef } from 'react';
import useWallet from 'src/hooks/useWallet';
import ModalConnectWallet from 'src/modals/ModalConnectWallet';
import AppButton, { AppButtonProps } from './AppButton';

const AppConnectWalletButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (props, ref) => {
    const { wallet, isOpenModalConnectWallet, toggleModalConnectWallet } = useWallet();

    const onOpenModalConnectWallet = () => toggleModalConnectWallet(true);

    const onCloseModalConnectWallet = () => toggleModalConnectWallet(false); 

    const _renderUnconnectedWallet = () => (
      <AppButton
        ref={ref}
        size="lg"
        onClick={onOpenModalConnectWallet}
        {...props}
      >
        {props.children}
      </AppButton>
    );

    const _renderConnectedWallet = () => {
      return null;
    };

    return (
      <>
        {wallet ? _renderConnectedWallet() : _renderUnconnectedWallet()}
        <ModalConnectWallet
          open={isOpenModalConnectWallet}
          onClose={onCloseModalConnectWallet}
        />
      </>
    );
  }
);

export default AppConnectWalletButton;