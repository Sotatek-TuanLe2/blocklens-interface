import React, { useState } from 'react';
import 'src/styles/pages/AccountPage.scss';
import { Box, Flex } from '@chakra-ui/react';
import { AppButton, AppCard } from 'src/components';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { formatTimestamp } from 'src/utils/utils-helper';
import { isMobile } from 'react-device-detect';
import ModalCancelSubscription from 'src/modals/ModalCancelSubscription';

const BillingInfos = () => {
  const [isOpenCancelSubscriptionModal, setIsOpenCancelSubscriptionModal] =
    useState<boolean>(false);

  const { myPlan: currentPlan, plans } = useSelector(
    (state: RootState) => state.billing,
  );

  const indexCurrentPlan = plans.findIndex(
    (item) => item.code === currentPlan.code,
  );

  const _renderLinkDetail = () => {
    return (
      <Flex>
        <Box className="link">Change Plan </Box>
        <Box ml={2} mt={1.5} className="icon-arrow-right" />
      </Flex>
    );
  };

  return (
    <AppCard className="box-info-account billing-info">
      <Box className="info-item">
        <Flex justifyContent={'space-between'}>
          <Box className="title">current plan</Box>
          {!isMobile && _renderLinkDetail()}
        </Flex>

        <Box className="name-plan">{currentPlan.name}</Box>
        <Box className="name-plan">
          {currentPlan.price === 0 ? `$0` : `$${currentPlan.price}/month`}
        </Box>
        <Box className="detail-plan">
          <Box>{currentPlan.appLimitation} active apps</Box>
          <Box>{currentPlan.notificationLimitation} message/day</Box>
          <Box>
            Period: {formatTimestamp(currentPlan?.from || 0, 'MMM DD, YYYY')} -{' '}
            {formatTimestamp(currentPlan?.to || 0, 'MMM DD, YYYY')} (UTC)
          </Box>
        </Box>
      </Box>

      {currentPlan.code !== 'FREE' && (
        <Flex justifyContent={isMobile ? 'center' : 'flex-end'}>
          <AppButton
            variant="cancel"
            size="sm"
            onClick={() => setIsOpenCancelSubscriptionModal(true)}
          >
            Cancel Subscription
          </AppButton>
        </Flex>
      )}

      {isOpenCancelSubscriptionModal && (
        <ModalCancelSubscription
          open={isOpenCancelSubscriptionModal}
          onClose={() => setIsOpenCancelSubscriptionModal(false)}
        />
      )}
    </AppCard>
  );
};

export default BillingInfos;
