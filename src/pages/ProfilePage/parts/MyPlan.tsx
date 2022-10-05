import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { AppButton } from 'src/components';
import PlanItem from './PlanItem';
import ModalPayment from 'src/modals/ModalPayment';
import rf from 'src/requests/RequestFactory';
import { toastError } from 'src/utils/utils-notify';
import { useDispatch, useSelector } from 'react-redux';
import { getPaymentIntent } from 'src/store/billing-plan';
import { formatTimestamp } from 'src/utils/utils-helper';
import { RootState } from '../../../store';

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

export interface IPaymentMethod {
  id: string;
  card: {
    brand: string;
    country: string;
    exp_month: number;
    exp_year: number;
    funding: string;
    last4: string;
  };
  livemode: boolean;
}

const MyPlan = () => {
  const [isSelect, setIsSelect] = useState<string>('');
  const [isChangePlan, setIsChangePlan] = useState<boolean>(false);
  const [billingPlans, setBillingPlans] = useState<IBillingPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<IBillingPlan | any>({});
  const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod | any>({});
  const [isOpenModalChangePaymentMethod, setIsOpenModalChangePaymentMethod] =
    useState<boolean>(false);
  const { userInfo } = useSelector((state: RootState) => state.auth);

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

  const getPaymentMethod = async () => {
    try {
      const res = await rf.getRequest('BillingRequest').getPaymentMethod();
      setPaymentMethod(res);
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  useEffect(() => {
    getBillingPlans().then();
    getCurrentPlan().then();
    getPaymentMethod().then();
    dispatch(getPaymentIntent());
  }, []);

  const _renderPlans = (isChange?: boolean) => {
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
              isChange={isChange}
            />
          );
        })}
      </Flex>
    );
  };

  const _renderCardDetail = () => {
    return (
      <div className="stripe-wrap">
        <Text className="upgrade-plans">Card Details</Text>
        <Box className="stripe-detail">
          <div className="stripe-title">Plan</div>
          <div className="stripe-status">
            <span>{currentPlan.name}</span>{' '}
            <span className="badge-package">Monthly</span>
          </div>
          <div className="stripe-action">
            <AppButton
              variant={isChangePlan ? 'outline' : 'brand'}
              size={'sm'}
              onClick={() => setIsChangePlan(!isChangePlan)}
            >
              {isChangePlan ? 'Cancel' : 'Change'}
            </AppButton>
          </div>
        </Box>

        {isChangePlan && _renderPlans(true)}

        <Box className="stripe-detail">
          <div className="stripe-title">Subscription</div>
          <div className="stripe-price">
            <span>${currentPlan?.price}</span>
            <span>
              Billing at{' '}
              {formatTimestamp(currentPlan?.startTime*1000, 'MMM DD, YYYY')} -{' '}
              {formatTimestamp(currentPlan?.endTime*1000, 'MMM DD, YYYY')}
            </span>
          </div>
        </Box>
        <Box className="stripe-detail">
          <div className="stripe-title">Payment method</div>
          <div className="stripe-status">
            <span>•••• •••• •••• {paymentMethod?.card?.last4}</span>
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
          <div className="stripe-title">Billing email</div>
          <div className="stripe-status">{userInfo.email}</div>
        </Box>
      </div>
    );
  };

  return (
    <Box px={5} className="plans-wrap">
      {Object.keys(paymentMethod).length
        ? _renderPlans()
        : _renderCardDetail()}

      <ModalPayment
        open={isOpenModalChangePaymentMethod}
        onClose={() => setIsOpenModalChangePaymentMethod(false)}
        isChangePaymentMethod
      />
    </Box>
  );
};

export default MyPlan;
