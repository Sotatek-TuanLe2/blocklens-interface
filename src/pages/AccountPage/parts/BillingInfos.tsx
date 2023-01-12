import 'src/styles/pages/AccountPage.scss';
import { Box, Flex } from '@chakra-ui/react';
import { AppCard, AppLink } from 'src/components';
import { formatTimestamp } from 'src/utils/utils-helper';
import { CheckedIcon, ArrowRightIcon } from 'src/assets/icons';
import useUser from 'src/hooks/useUser';

const BillingInfos = () => {
  const { user } = useUser();
  const currentPlan = user?.getPlan();

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

        <Box className="name-plan">{currentPlan?.name}</Box>
        <Box className="name-plan price">
          {currentPlan?.price === 0 ? (
            `Free`
          ) : (
            <Box>
              ${currentPlan?.price}
              <Box as={'span'} className="month">
                /month
              </Box>
            </Box>
          )}
        </Box>
        <Box className="detail-plan">
          <Flex alignItems={'center'}>
            <CheckedIcon /> <Box ml={3}>{currentPlan?.appLimitation} apps</Box>
          </Flex>
          <Flex alignItems={'center'}>
            <CheckedIcon />{' '}
            <Box ml={3}> {currentPlan?.notificationLimitation} message/day</Box>
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
