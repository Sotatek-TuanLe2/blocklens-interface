import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { UserPlanType } from 'src/store/user';
import useUser from './useUser';
import rf from 'src/requests/RequestFactory';
import moment from 'moment';
import useMetadata from './useMetadata';
import { MetadataPlan } from 'src/store/metadata';

interface ReturnType {
  currentPlan?: UserPlanType;
  nextPlan?: UserPlanType;
  isLowestPlan: boolean;
  isHighestPlan: boolean;
  isDowngrade: boolean;
  isRenew: boolean;
  isUpgrade: boolean;
  isBefore5Days: boolean;
  hasPurchased: boolean;
  comparePlan: (
    planA: UserPlanType | MetadataPlan,
    planB: UserPlanType | MetadataPlan,
  ) => number;
}

const useBilling = (): ReturnType => {
  const { user } = useUser();
  const { billingPlans } = useMetadata();

  const [hasPurchased, setHasPurchased] = useState<boolean>(false);

  const currentPlan = useMemo(() => user?.getPlan(), [user?.getPlan()]);
  const nextPlan = useMemo(() => user?.getNextPlan(), [user?.getNextPlan()]);

  const isLowestPlan = useMemo(
    () => !!billingPlans.length && currentPlan?.code === billingPlans[0].code,
    [billingPlans, currentPlan],
  );
  const isHighestPlan = useMemo(
    () =>
      !!billingPlans.length &&
      currentPlan?.code === billingPlans[billingPlans.length - 1].code,
    [billingPlans, currentPlan],
  );

  const isDowngrade = useMemo(
    () =>
      currentPlan && nextPlan
        ? new BigNumber(nextPlan.price).isLessThan(
            new BigNumber(currentPlan.price),
          )
        : false,
    [currentPlan, nextPlan],
  );
  const isRenew = useMemo(
    () =>
      currentPlan && nextPlan
        ? new BigNumber(currentPlan.price).isEqualTo(
            new BigNumber(nextPlan.price),
          )
        : false,
    [currentPlan, nextPlan],
  );
  const isUpgrade = useMemo(
    () =>
      currentPlan && nextPlan
        ? new BigNumber(nextPlan.price).isGreaterThan(
            new BigNumber(currentPlan.price),
          )
        : false,
    [currentPlan, nextPlan],
  );

  const isBefore5Days = useMemo(() => {
    if (!currentPlan || !currentPlan.expireAt) {
      return false;
    }
    const expireAt = currentPlan.expireAt;
    const duration = moment(expireAt).diff(moment(), 'days');

    return duration > 0 && duration <= 5;
  }, [currentPlan]);

  const checkHasPurchased = async () => {
    if (!isBefore5Days) {
      setHasPurchased(false);
      return;
    }
    /**
     * if isBefore5Days
     * call API getPurchasedSubscription to check if user has purchased the next plan
     */
    try {
      const res = await rf
        .getRequest('BillingRequest')
        .getPurchasedSubscription();
      setHasPurchased(!!res);
    } catch (error) {
      setHasPurchased(false);
    }
  };

  useEffect(() => {
    checkHasPurchased();
  }, [isBefore5Days]);

  const comparePlan = (
    planA: UserPlanType | MetadataPlan,
    planB: UserPlanType | MetadataPlan,
  ) => {
    if (new BigNumber(planA.price).isEqualTo(new BigNumber(planB.price))) {
      return 0;
    }

    return new BigNumber(planA.price).isLessThan(new BigNumber(planB.price))
      ? -1
      : 1;
  };

  return {
    currentPlan,
    nextPlan,
    isLowestPlan,
    isHighestPlan,
    isDowngrade,
    isRenew,
    isUpgrade,
    isBefore5Days,
    hasPurchased,
    comparePlan,
  };
};

export default useBilling;
