import React, { useState } from 'react';
import 'src/styles/pages/AccountPage.scss';
import { Box, Flex } from '@chakra-ui/react';
import { AppButton, AppCard, AppLink } from 'src/components';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { formatTimestamp } from 'src/utils/utils-helper';
import { isMobile } from 'react-device-detect';
import ModalCancelSubscription from 'src/modals/ModalCancelSubscription';
import { CheckedIcon, ArrowRightIcon } from 'src/assets/icons';

const BillingInfos = () => {
  const [isOpenCancelSubscriptionModal, setIsOpenCancelSubscriptionModal] =
    useState<boolean>(false);

  const { myPlan: currentPlan } = useSelector(
    (state: RootState) => state.billing,
  );

  const _renderLinkDetail = () => {
    return (
      <AppLink to={'/billing'}>
        <Flex className={'link'} alignItems={'center'}>
          <Box className="link" mr={2}>
            Change Plan{' '}
          </Box>
          <ArrowRightIcon />
        </Flex>
      </AppLink>
    );
  };

  return (
    <AppCard className="box-info-account billing-info">
      <Box className="info-item">
        <Flex justifyContent={'space-between'}>
          <Box className="title">current plan</Box>
          {_renderLinkDetail()}
        </Flex>

        <Box className="name-plan">{currentPlan.name}</Box>
        <Box className="name-plan">
          {currentPlan.price === 0 ? `$0` : `$${currentPlan.price}/month`}
        </Box>
        <Box className="detail-plan">
          <Flex alignItems={'center'}>
            <CheckedIcon />{' '}
            <Box ml={3}>{currentPlan.appLimitation} active apps</Box>
          </Flex>
          <Flex alignItems={'center'}>
            <CheckedIcon />{' '}
            <Box ml={3}> {currentPlan.notificationLimitation} message/day</Box>
          </Flex>
          <Box>
            Period: {formatTimestamp(currentPlan?.from || 0, 'MMM DD, YYYY')} -{' '}
            {formatTimestamp(currentPlan?.to || 0, 'MMM DD, YYYY')} (UTC)
          </Box>
        </Box>
      </Box>

      <Flex justifyContent={isMobile ? 'center' : 'flex-end'}>
        <AppButton
          isDisabled={currentPlan.code === 'STARTER'}
          variant="cancel"
          size="sm"
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
    </AppCard>
  );
};

export default BillingInfos;
