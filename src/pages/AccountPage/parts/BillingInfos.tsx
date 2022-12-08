import React, { useMemo } from 'react';
import 'src/styles/pages/AccountPage.scss';
import { Box, Flex } from '@chakra-ui/react';
import { AppCard, AppLink } from 'src/components';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { formatTimestamp } from 'src/utils/utils-helper';
import moment from 'moment';
import { isMobile } from 'react-device-detect';

const BillingInfos = () => {
  const { myPlan: currentPlan, plans } = useSelector(
    (state: RootState) => state.billing,
  );

  const indexCurrentPlan = plans.findIndex(
    (item) => item.code === currentPlan.code,
  );

  const nextPlan = useMemo(() => {
    if (indexCurrentPlan <= plans.length - 1) {
      return plans[indexCurrentPlan + 1];
    }
    return null;
  }, [indexCurrentPlan, plans]);

  const _renderLinkDetail = () => {
    return (
      <Flex>
        <AppLink to={`/billing-info`}>
          <Box className="link" mr={5}>
            Billing Info
          </Box>
        </AppLink>
        <Box className="link">Change Plan</Box>
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
        <Box className="detail-plan">
          <Box>{currentPlan.appLimitation} active apps</Box>
          <Box>{currentPlan.notificationLimitation} message/day</Box>
          <Box>
            Period: {formatTimestamp(currentPlan?.from || 0, 'MMM DD, YYYY')} -{' '}
            {formatTimestamp(currentPlan?.to || 0, 'MMM DD, YYYY')} (UTC)
          </Box>
        </Box>
      </Box>

      <Box className="info-item">
        <Box className="title">upcoming plan</Box>
        {nextPlan && (
          <Flex justifyContent={'space-between'}>
            <Box className="name-next-plan">
              {nextPlan?.name}: ${nextPlan?.price}
            </Box>
            <Box className="time">
              Starting: {formatTimestamp(+moment(), 'MMM DD, YYYY')}
            </Box>
          </Flex>
        )}

        {isMobile && <Box mt={4}>{_renderLinkDetail()}</Box>}
      </Box>
    </AppCard>
  );
};

export default BillingInfos;
