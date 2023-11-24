import { Flex } from '@chakra-ui/react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { AppButton } from 'src/components';
import useBilling from 'src/hooks/useBilling';
import { MetadataPlan } from 'src/store/metadata';
import { YEARLY_SUBSCRIPTION_CODE } from 'src/utils/common';
import { formatCapitalize } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import rf from 'src/requests/RequestFactory';
import { useDispatch } from 'react-redux';
import { getUserPlan } from 'src/store/user';

const NOTIFICATION_TYPE = {
  WARNING_RENEWAL: 'WARNING_RENEWAL',
  SUCCEEDED_RENEWAL: 'SUCCEEDED_RENEWAL',
  WARNING_DOWNGRADE: 'WARNING_DOWNGRADE',
  SUCCEEDED_DOWNGRADE: 'SUCCEEDED_DOWNGRADE',
};

interface INotification {
  onCheckout: (plan: MetadataPlan, isYearly: boolean) => void;
}

const PartNotification: React.FC<INotification> = (props) => {
  const {
    currentPlan,
    nextPlan,
    isUpgrade,
    isRenew,
    isDowngrade,
    isBefore5Days,
    hasPurchased,
  } = useBilling();
  const dispatch = useDispatch();
  const { onCheckout } = props;

  const [variant, setVariant] =
    useState<typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE]>('');

  const calculateVariant = () => {
    if (!currentPlan || !nextPlan || isUpgrade) {
      return;
    }

    if (isDowngrade) {
      setVariant(
        hasPurchased
          ? NOTIFICATION_TYPE.SUCCEEDED_DOWNGRADE
          : NOTIFICATION_TYPE.WARNING_DOWNGRADE,
      );
    } else if (isRenew && isBefore5Days) {
      setVariant(
        !hasPurchased
          ? NOTIFICATION_TYPE.WARNING_RENEWAL
          : NOTIFICATION_TYPE.SUCCEEDED_RENEWAL,
      );
    } else {
      setVariant('');
    }
  };

  useEffect(() => {
    calculateVariant();
  }, [currentPlan, nextPlan, hasPurchased]);

  const onPay = () => {
    if (!nextPlan) {
      return;
    }
    onCheckout(
      nextPlan,
      nextPlan.subscribeOptionCode === YEARLY_SUBSCRIPTION_CODE,
    );
  };

  const onCancelDowngrade = async () => {
    try {
      await rf.getRequest('BillingRequest').cancelDowngrade();
      await dispatch(getUserPlan());
      toastSuccess({ message: 'Cancel downgrade successfully!' });
    } catch (error) {
      toastError({ message: 'Cancel downgrade failed! ' });
      console.error(error);
    }
  };

  const _renderContent = () => {
    if (!currentPlan || !nextPlan || isUpgrade || !variant) {
      return null;
    }

    switch (variant) {
      case NOTIFICATION_TYPE.WARNING_RENEWAL:
        return (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            className="plan-notification plan-notification--warning"
          >
            <Flex>
              <span>
                Renewal of <b>{formatCapitalize(nextPlan.name)}</b> plan is on
                hold due to lack of payment.
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
      case NOTIFICATION_TYPE.SUCCEEDED_RENEWAL:
        return (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            className="plan-notification plan-notification--notification"
          >
            <span>
              Current plan will be renewed to{' '}
              <b>{formatCapitalize(nextPlan.name)}</b> plan on{' '}
              {moment(currentPlan.expireAt)
                .add(1, 'day')
                .format('MMM DD, YYYY')}
            </span>
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
                    Downgrading to <b>{formatCapitalize(nextPlan.name)}</b> plan
                    is on hold due to lack of payment
                  </>
                ) : (
                  <>
                    Downgrade to <b>{formatCapitalize(nextPlan.name)}</b> plan
                    will start on{' '}
                    {moment(currentPlan.expireAt).format('MMM DD, YYYY')} (UTC)
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
                onClick={onCancelDowngrade}
              >
                Cancel downgrade
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
            <span>
              Current plan will be reduced to{' '}
              <b>{formatCapitalize(nextPlan.name)}</b> plan on{' '}
              {moment(currentPlan.expireAt)
                .add(1, 'day')
                .format('MMM DD, YYYY')}
            </span>
          </Flex>
        );
      default:
        return null;
    }
  };

  return _renderContent();
};

export default PartNotification;
