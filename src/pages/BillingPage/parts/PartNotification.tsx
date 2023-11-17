import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { AppButton } from 'src/components';
import useUser from 'src/hooks/useUser';
import { MetadataPlan } from 'src/store/metadata';
import { formatCapitalize } from 'src/utils/utils-helper';

const NOTIFICATION_TYPE = {
  RENEWAL: 'RENEWAL',
  WARNING_DOWNGRADE: 'WARNING_DOWNGRADE',
  SUCCEEDED_DOWNGRADE: 'SUCCEEDED_DOWNGRADE',
};

interface INotification {
  onCheckout: (plan: MetadataPlan, isYearly: boolean) => void;
}

const PartNotification: React.FC<INotification> = (props) => {
  const { user } = useUser();
  const { onCheckout } = props;

  const [variant, setVariant] =
    useState<typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE]>('');

  const userCurrentPlan = useMemo(() => user?.getPlan(), [user?.getPlan()]);
  const userNextPlan = useMemo(
    () => user?.getNextPlan(),
    [user?.getNextPlan()],
  );
  /**
   * TODO
   * get expireTime of current plan
   */
  const isBefore5Days = useMemo(() => true, [userCurrentPlan]);

  const isDownGrade = useMemo(
    () =>
      userCurrentPlan && userNextPlan
        ? new BigNumber(userCurrentPlan.price).isLessThan(
            new BigNumber(userNextPlan.price),
          )
        : false,
    [userCurrentPlan, userNextPlan],
  );
  const isRenewal = useMemo(
    () =>
      userCurrentPlan && userNextPlan
        ? new BigNumber(userCurrentPlan.price).isEqualTo(
            new BigNumber(userNextPlan.price),
          )
        : false,
    [userCurrentPlan, userNextPlan],
  );
  const isUpgrade = useMemo(
    () =>
      userCurrentPlan && userNextPlan
        ? new BigNumber(userCurrentPlan.price).isGreaterThan(
            new BigNumber(userNextPlan.price),
          )
        : false,
    [userCurrentPlan, userNextPlan],
  );

  const calculateVariant = () => {
    if (!userCurrentPlan || !userNextPlan || isUpgrade) {
      return;
    }

    switch (true) {
      case isDownGrade:
        if (isBefore5Days) {
          /**
           * TODO
           * if isBefore5Days
           * call API getPurchasedSubscription to check if user has purchased the next plan
           */
        } else {
          setVariant(NOTIFICATION_TYPE.WARNING_DOWNGRADE);
        }
        break;
      case isRenewal:
        if (isBefore5Days) {
          setVariant(NOTIFICATION_TYPE.RENEWAL);
        }
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    calculateVariant();
  }, [userCurrentPlan, userNextPlan]);

  const onPay = () => {
    if (!userNextPlan) {
      return;
    }

    /**
     * TODO
     * need to examine the next plan is yearly or not
     */

    onCheckout(userNextPlan, false);
  };

  const _renderContent = () => {
    if (!userCurrentPlan || !userNextPlan || isUpgrade || !variant) {
      return null;
    }

    switch (variant) {
      case NOTIFICATION_TYPE.RENEWAL:
        return (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            className="plan-notification plan-notification--warning"
          >
            <Flex>
              <span>
                Renewal of <b>{formatCapitalize(userNextPlan.name)}</b> plan is
                on hold due to lack of payment.
              </span>
            </Flex>
            <AppButton
              variant="no-effects"
              className="plan-notification__button plan-notification__button--notification"
              onClick={onPay}
            >
              Pay now
            </AppButton>
          </Flex>
        );
      case NOTIFICATION_TYPE.WARNING_DOWNGRADE:
        return (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            className="plan-notification plan-notification--warning"
          >
            <Flex>
              <span>
                {isBefore5Days ? (
                  <>
                    Downgrading to <b>{formatCapitalize(userNextPlan.name)}</b>{' '}
                    plan is on hold due to lack of payment
                  </>
                ) : (
                  <>
                    Downgrade to <b>{formatCapitalize(userNextPlan.name)}</b>{' '}
                    plan will start on {''} (UTC)
                  </>
                )}
              </span>
            </Flex>
            <Flex>
              {isBefore5Days && (
                <AppButton
                  variant="no-effects"
                  className="plan-notification__button plan-notification__button--notification"
                  onClick={onPay}
                >
                  Pay now
                </AppButton>
              )}
              <AppButton
                variant="no-effects"
                className="plan-notification__button plan-notification__button--warning"
              >
                Dismiss
              </AppButton>
            </Flex>
          </Flex>
        );
      case NOTIFICATION_TYPE.SUCCEEDED_DOWNGRADE:
        return (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            className="plan-notification plan-notification--notification"
          >
            Current plan will be reduced to{' '}
            <b>{formatCapitalize(userNextPlan.name)}</b> plan on {''}
          </Flex>
        );
      default:
        return null;
    }
  };

  return _renderContent();
};

export default PartNotification;
