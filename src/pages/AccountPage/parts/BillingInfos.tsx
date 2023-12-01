import 'src/styles/pages/AccountPage.scss';
import { Box, Flex } from '@chakra-ui/react';
import { AppCard, AppLink } from 'src/components';
import { CheckedIcon, ArrowRightIcon } from 'src/assets/icons';
import { ROUTES } from 'src/utils/common';
import { generatePlanDescriptions } from 'src/pages/BillingPage/parts/PartPlan';
import useBilling from 'src/hooks/useBilling';

const BillingInfos = () => {
  const {
    currentPlan,
    getCurrentPlanExpireDateTitle,
    getCurrentPlanExpireDate,
  } = useBilling();

  const _renderLinkDetail = () => {
    return (
      <AppLink to={ROUTES.BILLING}>
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
          {!!currentPlan &&
            generatePlanDescriptions(currentPlan).map((des, index) => (
              <Flex key={index} alignItems={'center'}>
                <CheckedIcon /> <Box ml={3}>{des}</Box>
              </Flex>
            ))}
          <Box>
            {getCurrentPlanExpireDateTitle()}: {getCurrentPlanExpireDate()}
          </Box>
        </Box>
      </Box>
    </AppCard>
  );
};

export default BillingInfos;
