import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState, useMemo } from 'react';
import { AppButton } from 'src/components';
import PlanItem from './PlanItem';
import ModalPayment from 'src/modals/ModalPayment';
import ModalCancelSubscription from 'src/modals/ModalCancelSubscription';
import rf from 'src/requests/RequestFactory';
import { toastError } from 'src/utils/utils-notify';
import { useDispatch } from 'react-redux';
import { getPaymentIntent } from 'src/store/billing-plan';
import { formatTimestamp } from 'src/utils/utils-helper';

export interface IBillingPlan {
  code: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  periodByDay: number;
  appLimitation: number;
  notificationLimitation: number;
  startTime: number;
  endTime: number;
}

const MyPlan = () => {
  const [isSelect, setIsSelect] = useState<string>('');
  const [billingPlans, setBillingPlans] = useState<IBillingPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<IBillingPlan | any>({});
  const [billingInfo, setBillingInfo] = useState<any>({});
  const [isOpenModalChangePaymentMethod, setIsOpenModalChangePaymentMethod] =
    useState<boolean>(false);
  const [isOpenModalCancelSubscription, setIsOpenModalCancelSubscription] =
    useState<boolean>(false);

  const dispatch = useDispatch<any>();

  const getBillingPlans = async () => {
    try {
      const res = await rf.getRequest('BillingRequest').getBillingPlans();
      setBillingPlans(res);
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  const getCurrentPlan = async () => {
    try {
      const res = await rf.getRequest('BillingRequest').getCurrentPlan();
      setCurrentPlan(res);
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  const getBillingInfo = async () => {
    try {
      const res = await rf.getRequest('BillingRequest').getBillingInfo();
      setBillingInfo(res || {});
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  useEffect(() => {
    getBillingPlans().then();
    getCurrentPlan().then();
    getBillingInfo().then();
    dispatch(getPaymentIntent());
  }, []);

  const isHasPaymentMethod = useMemo(() => {
    return !Object.keys(billingInfo?.paymentMethod || {}).length;
  }, [billingInfo]);

  const _renderPlans = () => {
    return (
      <Flex gap={'16px'} my={5}>
        {billingPlans.map((plan: IBillingPlan, index) => {
          return (
            <PlanItem
              plan={plan}
              key={index}
              isActive={plan.code === currentPlan.code}
              isSelect={isSelect}
              setIsSelect={setIsSelect}
              isChange={isHasPaymentMethod}
            />
          );
        })}
      </Flex>
    );
  };

  const _renderCardDetail = () => {
    return (
      <div className="stripe-wrap">
        <Box className="stripe-detail">
          <div className="stripe-title">Payment method</div>
          <div className="stripe-status">
            <span>
              •••• •••• •••• {billingInfo?.paymentMethod?.card?.last4}
            </span>
          </div>
          <div className="stripe-action">
            <AppButton
              size={'sm'}
              onClick={() => setIsOpenModalChangePaymentMethod(true)}
            >
              Change
            </AppButton>
          </div>
        </Box>

        <Box className="stripe-detail">
          <div className="stripe-title">Billing address</div>
          <div className="stripe-status">
            <Box>{billingInfo?.name}</Box>
            <Box>{billingInfo?.address}</Box>
          </div>
        </Box>

        <Box className="stripe-detail">
          <div className="stripe-title">Billing email</div>
          <div className="stripe-status">{billingInfo.email}</div>
        </Box>

        <Box className="stripe-detail">
          <div className="stripe-title">Subscription</div>
          <div className="stripe-price">
            <span>${currentPlan?.price}</span>
            <span>
              Billing period{' '}
              {formatTimestamp(currentPlan?.startTime * 1000, 'MMM DD, YYYY')} -{' '}
              {formatTimestamp(currentPlan?.endTime * 1000, 'MMM DD, YYYY')}
            </span>
          </div>
        </Box>

        <Flex mt={3} justifyContent={'flex-end'}>
          <AppButton
            variant="outline"
            onClick={() => setIsOpenModalCancelSubscription(true)}
          >
            Cancel Subscription
          </AppButton>
        </Flex>
      </div>
    );
  };

  return (
    <Box px={5} className="plans-wrap">
      <div className="stripe-wrap">
        <Box className="stripe-detail">
          <div className="stripe-title">Current Plan</div>
          <div className="stripe-status">{currentPlan.name}</div>
        </Box>
      </div>

      {_renderPlans()}

      {isHasPaymentMethod && _renderCardDetail()}

      <ModalPayment
        open={isOpenModalChangePaymentMethod}
        onClose={() => setIsOpenModalChangePaymentMethod(false)}
        isChangePaymentMethod
      />

      <ModalCancelSubscription
        onClose={() => setIsOpenModalCancelSubscription(false)}
        open={isOpenModalCancelSubscription}
      />
    </Box>
  );
};

export default MyPlan;
