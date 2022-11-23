import { Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import { useHistory } from 'react-router';
import AppButton from 'src/components/AppButton';

interface ModalUpgradeCreateApp {
  open: boolean;
  onClose: () => void;
}

const ModalUpgradeCreateApp: FC<ModalUpgradeCreateApp> = ({
  open,
  onClose,
}) => {
  const history = useHistory();
  return (
    <BaseModal
      size="xl"
      icon="icon-add-app"
      title="Want To Create More Apps?"
      isOpen={open}
      description="You can only create 3 apps in your current plan, upgrade to growth to enjoy 15 apps in maximum."
      onClose={onClose}
    >
      <Flex flexWrap={'wrap'} justifyContent={'center'}>
        <AppButton size={'lg'} onClick={() => history.push('/setting/billing')}>
          Upgrade Now
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalUpgradeCreateApp;
