import React from 'react';
import 'src/styles/pages/AccountPage.scss';
import { Box, Flex } from '@chakra-ui/react';
import { AppCard, AppLink } from 'src/components';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { formatTimestamp } from 'src/utils/utils-helper';
import { CheckedIcon, ArrowRightIcon } from 'src/assets/icons';

const BillingInfos = () => {
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
          {currentPlan.price === 0 ? `Free` : `$${currentPlan.price}/month`}
        </Box>
        <Box className="detail-plan">
          <Flex alignItems={'center'}>
            <CheckedIcon /> <Box ml={3}>{currentPlan.appLimitation} apps</Box>
          </Flex>
          <Flex alignItems={'center'}>
            <CheckedIcon />{' '}
            <Box ml={3}> {currentPlan.notificationLimitation} message/day</Box>
          </Flex>
          <Flex alignItems={'center'}>
            <CheckedIcon /> <Box ml={3}> All supported chains</Box>
          </Flex>
          <Box>
            Period: {formatTimestamp(currentPlan?.from || 0, 'MMM DD, YYYY')} -{' '}
            {formatTimestamp(currentPlan?.to || 0, 'MMM DD, YYYY')} (UTC)
          </Box>
        </Box>
      </Box>
    </AppCard>
  );
};

export default BillingInfos;
