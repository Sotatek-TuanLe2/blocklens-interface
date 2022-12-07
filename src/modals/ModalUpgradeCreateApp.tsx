import { Box, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import { useHistory } from 'react-router';
import AppButton from 'src/components/AppButton';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { IPlan } from 'src/store/billing';
import { isMobile } from 'react-device-detect';

interface ModalUpgradeCreateApp {
  open: boolean;
  onClose: () => void;
}

const ModalUpgradeCreateApp: FC<ModalUpgradeCreateApp> = ({
  open,
  onClose,
}) => {
  const history = useHistory();
  const { myPlan, plans } = useSelector((state: RootState) => state.billing);
  const indexMyPlan = plans.findIndex(
    (item: IPlan) => item.code === myPlan?.code,
  );
  const nextPlan = plans[indexMyPlan + 1];

  return (
    <BaseModal
      size="xl"
      icon="icon-add-app"
      title="Want To Create More Apps?"
      isOpen={open}
      isFullScreen={isMobile}
      onClose={onClose}
    >
      <Box className={'modal__description'}>
        You can only create {myPlan?.appLimitation} apps in your current plan,
        upgrade to{' '}
        <Box as={'span'} textTransform="lowercase">
          {nextPlan?.name}
        </Box>{' '}
        to enjoy {nextPlan?.appLimitation} apps in maximum.
      </Box>
      <Flex flexWrap={'wrap'} justifyContent={'center'}>
        <AppButton size={'lg'} onClick={() => history.push('/setting/billing')}>
          Upgrade Now
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalUpgradeCreateApp;
