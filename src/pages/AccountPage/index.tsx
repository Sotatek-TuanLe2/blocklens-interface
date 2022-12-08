import React, { useState } from 'react';
import { BasePageContainer } from 'src/layouts';
import { Box, Flex } from '@chakra-ui/react';
import BasicDetail from './parts/BasicDetail';
import BillingInfos from './parts/BillingInfos';
import 'src/styles/pages/AccountPage.scss';
import { isMobile } from 'react-device-detect';
import PaymentMethod from './parts/PaymentMethod';
import { AppButton } from 'src/components';
import ModalCancelSubscription from 'src/modals/ModalCancelSubscription';

const AccountPage = () => {
  const [isOpenCancelSubscriptionModal, setIsOpenCancelSubscriptionModal] =
    useState<boolean>(false);

  return (
    <BasePageContainer className="account">
      <>
        <Box className="title-heading">Account</Box>
        <Flex
          flexWrap={'wrap'}
          justifyContent={'space-between'}
          flexDirection={isMobile ? 'column' : 'row'}
        >
          <Box className={'box-account'}>
            <BasicDetail />
          </Box>
          <Box className={'box-account'}>
            <BillingInfos />
          </Box>
        </Flex>

        <PaymentMethod />

        <Flex justifyContent={'flex-end'} mt={5}>
          <AppButton
            variant="cancel"
            size="lg"
            onClick={() => setIsOpenCancelSubscriptionModal(true)}
          >
            Cancel Subscription
          </AppButton>
        </Flex>
        {isOpenCancelSubscriptionModal && (
          <ModalCancelSubscription
            open={isOpenCancelSubscriptionModal}
            onClose={() => setIsOpenCancelSubscriptionModal(false)}
          />
        )}
      </>
    </BasePageContainer>
  );
};

export default AccountPage;
