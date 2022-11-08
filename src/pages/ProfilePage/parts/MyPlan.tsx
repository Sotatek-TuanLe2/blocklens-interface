import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState, useMemo } from 'react';
import { AppButton, AppInput } from 'src/components';
import PlanItem from './PlanItem';
import ModalPayment from 'src/modals/ModalPayment';
import ModalCancelSubscription from 'src/modals/ModalCancelSubscription';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { useDispatch } from 'react-redux';
import { getPaymentIntent } from 'src/store/billing-plan';
import { formatTimestamp } from 'src/utils/utils-helper';
import ModalBillingInfo from '../../../modals/ModalBillingInfo';
import { log } from 'util';
import ModalChangePlan from '../../../modals/ModalChangePlan';

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
  const [planSelected, setPlanSelected] = useState<IBillingPlan | any>({});
  const [billingPlans, setBillingPlans] = useState<IBillingPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<IBillingPlan | any>({});
  const [billingInfo, setBillingInfo] = useState<any>({});
  const [isOpenModalChangePaymentMethod, setIsOpenModalChangePaymentMethod] =
    useState<boolean>(false);
  const [isOpenModalCancelSubscription, setIsOpenModalCancelSubscription] =
    useState<boolean>(false);
  const [isOpenModalUpdateBillingInfo, setIsOpenModalUpdateBillingInfo] =
    useState<boolean>(false);
  const [isEditEmail, setIsEditEmail] = useState<boolean>(false);
  const [billingEmail, setBillingEmail] = useState<string>('');
  const [isOpenModalChangePlan, setIsOpenModalChangePlan] =
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

  const updateBillingInfo = async () => {
    try {
      await rf.getRequest('BillingRequest').updateBillingInfo({
        email: billingEmail,
      });
      toastSuccess({ message: 'Update Successfully!' });
      setIsEditEmail(false);
      await getBillingInfo().then();
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

  useEffect(() => {
    setBillingEmail(billingInfo.email);
  }, [billingInfo, isEditEmail]);

  useEffect(() => {
    setPlanSelected(currentPlan);
  }, [currentPlan]);

  const isHasPaymentMethod = useMemo(() => {
    return !!Object.keys(billingInfo?.paymentMethod || {}).length;
  }, [billingInfo]);

  const indexCurrentPlan = billingPlans.findIndex(
    (item) => item.code === currentPlan.code,
  );

  const indexPlanSelected = billingPlans.findIndex(
    (item) => item.code === planSelected.code,
  );

  const _renderPlans = () => {
    return (
      <Flex gap={'16px'} my={5}>
        {billingPlans.map((plan: IBillingPlan, index) => {
          return (
            <PlanItem
              plan={plan}
              key={index}
              openModalChangePaymentMethod={() =>
                setIsOpenModalChangePaymentMethod(true)
              }
              openModalChangePlan={() => setIsOpenModalChangePlan(true)}
              isActive={plan.code === currentPlan.code}
              planSelected={planSelected}
              setPlanSelected={setPlanSelected}
              isChangePaymentMethod={isHasPaymentMethod}
            />
          );
        })}
      </Flex>
    );
  };

  const _renderCardDetail = () => {
    return (
      <div className="stripe-wrap">
        <Box className="stripe-detail" alignItems={'center'}>
          <div className="stripe-title">Payment method</div>
          <div className="stripe-status">
            {billingInfo?.paymentMethod?.card && (
              <span>
                •••• •••• •••• {billingInfo?.paymentMethod?.card?.last4}
              </span>
            )}
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
            <Box>{billingInfo?.country}</Box>
          </div>
          <div className="stripe-action">
            <AppButton
              size={'sm'}
              onClick={() => setIsOpenModalUpdateBillingInfo(true)}
            >
              Change
            </AppButton>
          </div>
        </Box>

        <Box className="stripe-detail" alignItems={'center'}>
          <div className="stripe-title">Billing email</div>

          {isEditEmail ? (
            <AppInput
              w={'300px'}
              placeholder={'Billing address'}
              value={billingEmail}
              onChange={(e) => {
                setBillingEmail(e.target.value);
              }}
            />
          ) : (
            <div className="stripe-status">{billingInfo.email}</div>
          )}

          <div className="stripe-action">
            {isEditEmail ? (
              <Flex>
                <AppButton
                  mr={4}
                  variant={'outline'}
                  size={'sm'}
                  onClick={() => setIsEditEmail(false)}
                >
                  Cancel
                </AppButton>
                <AppButton size={'sm'} onClick={updateBillingInfo}>
                  Submit
                </AppButton>
              </Flex>
            ) : (
              <AppButton size={'sm'} onClick={() => setIsEditEmail(true)}>
                Change
              </AppButton>
            )}
          </div>
        </Box>

        {isHasPaymentMethod && (
          <>
            <Box className="stripe-detail">
              <div className="stripe-title">Subscription</div>
              <div className="stripe-price">
                <span>${currentPlan?.price}</span>
                <span>
                  Billing period{' '}
                  {formatTimestamp(
                    currentPlan?.startTime * 1000,
                    'MMM DD, YYYY',
                  )}{' '}
                  -{' '}
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
          </>
        )}
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

      {_renderCardDetail()}

      <ModalPayment
        open={isOpenModalChangePaymentMethod}
        onClose={() => setIsOpenModalChangePaymentMethod(false)}
      />

      <ModalBillingInfo
        onClose={() => setIsOpenModalUpdateBillingInfo(false)}
        open={isOpenModalUpdateBillingInfo}
        reloadData={getBillingInfo}
        billingInfo={billingInfo}
      />

      <ModalCancelSubscription
        onClose={() => setIsOpenModalCancelSubscription(false)}
        open={isOpenModalCancelSubscription}
      />

      <ModalChangePlan
        isUpgrade={indexPlanSelected > indexCurrentPlan}
        open={isOpenModalChangePlan}
        onClose={() => setIsOpenModalChangePlan(false)}
        plan={planSelected}
        reloadData={getCurrentPlan}
      />
    </Box>
  );
};

export default MyPlan;
