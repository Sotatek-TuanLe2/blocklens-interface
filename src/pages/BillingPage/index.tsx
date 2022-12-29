import {
  Flex,
  Box,
  Tbody,
  Tr,
  Td,
  Table,
  TableContainer,
} from '@chakra-ui/react';
import React, { FC, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import 'src/styles/pages/BillingPage.scss';
import { BasePageContainer } from 'src/layouts';
import { AppButton, AppCard, AppLink } from 'src/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { getMyPlan, IPlan } from 'src/store/billing';
import {
  CheckedIcon,
  RadioNoCheckedIcon,
  RadioChecked,
  ArrowRightIcon,
  EditIcon,
  ListCardIcon,
  CircleCheckedIcon,
  CryptoIcon,
} from 'src/assets/icons';
import { isMobile } from 'react-device-detect';
import PartCheckout from './parts/PartCheckout';
import AppAlertWarning from 'src/components/AppAlertWarning';
import useUser from 'src/hooks/useUser';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { useHistory } from 'react-router';
import PartPaymentInfo from './parts/PartPaymentInfo';
import ModalEditCreditCard from 'src/modals/ModalEditCreditCard';
import ModalCancelSubscription from 'src/modals/ModalCancelSubscription';
import { getInfoUser } from 'src/store/auth';

export const PAYMENT_METHOD = {
  CARD: 'STRIPE',
  CRYPTO: 'CRYPTO',
};

enum STEPS {
  LIST,
  FORM,
  CHECKOUT,
}

export const paymentMethods = [
  {
    name: 'Credit Card',
    code: PAYMENT_METHOD.CARD,
  },
  {
    name: 'Crypto',
    code: PAYMENT_METHOD.CRYPTO,
  },
];

interface IPlanMobile {
  plan: IPlan;
  planSelected: IPlan;
  currentPlan: IPlan;
  onSelect: (value: IPlan) => void;
}

const _renderPrice = (price: number | null) => {
  if (price === 0) {
    return 'Free';
  }

  return `$${price}/month`;
};

const PlanMobile: FC<IPlanMobile> = ({
  plan,
  currentPlan,
  planSelected,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isCurrentPlan = plan.code === currentPlan.code;
  const isActivePlan = planSelected.code === plan.code;
  return (
    <>
      <Box
        className={`${isOpen ? 'open' : ''} ${
          isActivePlan ? 'active' : ''
        } card-mobile plan-card`}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Flex
            className="name-mobile"
            alignItems={'center'}
            onClick={() => onSelect(plan)}
          >
            {isActivePlan ? <RadioChecked /> : <RadioNoCheckedIcon />}
            <Box ml={3}>{plan.code}</Box>

            {isCurrentPlan && (
              <Box ml={3} className={'box-current'}>
                Current Plan
              </Box>
            )}
          </Flex>
          <Box
            className={isOpen ? 'icon-minus' : 'icon-plus'}
            onClick={() => setIsOpen(!isOpen)}
          />
        </Flex>
        <Box className={'plan-detail price'}>{_renderPrice(plan.price)}</Box>

        {isOpen && (
          <Box className="plan-detail">
            <Flex alignItems={'center'} my={2}>
              <CheckedIcon />
              <Box ml={3}> {plan.appLimitation} active apps </Box>
            </Flex>
            <Flex alignItems={'center'} my={2}>
              <CheckedIcon />
              <Box ml={3}> {plan.notificationLimitation} message/day </Box>
            </Flex>
            <Flex alignItems={'center'}>
              <CheckedIcon />
              <Box ml={3}> All supported chains</Box>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
};

const BillingPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>(
    PAYMENT_METHOD.CARD,
  );
  const [isOpenCancelSubscriptionModal, setIsOpenCancelSubscriptionModal] =
    useState<boolean>(false);
  const [planSelected, setPlanSelected] = useState<IPlan>({} as any);
  const [isOpenEditCardModal, setIsOpenEditCardModal] =
    useState<boolean>(false);
  const [step, setStep] = useState<number>(STEPS.LIST);
  const { myPlan: currentPlan, plans: billingPlans } = useSelector(
    (state: RootState) => state.billing,
  );
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const { user } = useUser();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setPaymentMethod(userInfo.activePaymentMethod || PAYMENT_METHOD.CARD);
  }, [userInfo]);

  useEffect(() => {
    setPlanSelected(currentPlan);
  }, [currentPlan]);

  const isSufficientBalance = useMemo(() => {
    if (!user) {
      return false;
    }
    return new BigNumber(user.getBalance()).isGreaterThanOrEqualTo(
      new BigNumber(planSelected.price),
    );
  }, [user?.getBalance(), planSelected]);

  const isCurrentPlan = new BigNumber(planSelected.price).isEqualTo(
    new BigNumber(currentPlan.price),
  );
  const isDownGrade = new BigNumber(planSelected.price).isLessThan(
    new BigNumber(currentPlan.price),
  );

  const _renderPlansDesktop = () => {
    const _renderBody = () => {
      return (
        <Tbody>
          {billingPlans?.map((plan: IPlan, index: number) => {
            const isCurrentPlan = plan.code === currentPlan.code;
            const isActivePlan = planSelected.code === plan.code;
            return (
              <Tr
                key={index}
                className={`${isActivePlan ? 'active' : ''} tr-list`}
                onClick={() => setPlanSelected(plan)}
              >
                <Td>
                  <Flex alignItems={'center'}>
                    {isActivePlan ? <RadioChecked /> : <RadioNoCheckedIcon />}
                    <Box ml={3} className="name-plan">
                      {plan.name.toLowerCase()}
                    </Box>

                    {isCurrentPlan && (
                      <Box ml={3} className={'box-current'}>
                        Current Plan
                      </Box>
                    )}
                  </Flex>
                </Td>
                <Td>
                  <Flex alignItems={'center'}>
                    <CheckedIcon />
                    <Box ml={3}> {plan.appLimitation} apps </Box>
                  </Flex>
                </Td>
                <Td>
                  <Flex alignItems={'center'}>
                    <CheckedIcon />
                    <Box ml={3}>
                      {' '}
                      {plan.notificationLimitation} messages/day{' '}
                    </Box>
                  </Flex>
                </Td>
                <Td>
                  <Flex alignItems={'center'}>
                    <CheckedIcon />
                    <Box ml={3}>All supported chains</Box>
                  </Flex>
                </Td>
                <Td>{_renderPrice(plan.price)}</Td>
              </Tr>
            );
          })}
        </Tbody>
      );
    };

    return (
      <TableContainer>
        <Table colorScheme="gray" className={'table-plan'}>
          {_renderBody()}
        </Table>
      </TableContainer>
    );
  };

  const _renderPlansMobile = () => {
    return (
      <Box className="list-card-mobile">
        {billingPlans?.map((plan: IPlan, index: number) => {
          return (
            <PlanMobile
              plan={plan}
              key={index}
              currentPlan={currentPlan}
              planSelected={planSelected}
              onSelect={setPlanSelected}
            />
          );
        })}
      </Box>
    );
  };

  const onUpdatePlan = async () => {
    try {
      await rf
        .getRequest('BillingRequest')
        .updateBillingPlan({ code: planSelected.code });
      toastSuccess({ message: 'Downgrade Plan Successfully!' });
      dispatch(getMyPlan());
    } catch (error: any) {
      toastError({ message: error.message });
    }
  };

  const onChangePaymentMethod = async (method: string) => {
    try {
      await rf
        .getRequest('UserRequest')
        .editInfoUser({ activePaymentMethod: method });
      toastSuccess({ message: 'Update Successfully!' });
      dispatch(getInfoUser());
    } catch (error: any) {
      toastError({ message: error.message });
    }
  };

  const onClickButton = async () => {
    if (isCurrentPlan || isDownGrade) {
      await onUpdatePlan();
      return;
    }
    // isUpgrade
    if (paymentMethod === PAYMENT_METHOD.CRYPTO) {
      if (isSufficientBalance) {
        setStep(STEPS.CHECKOUT);
      } else {
        history.push('/top-up');
      }
    } else {
      setStep(STEPS.CHECKOUT);
    }
  };

  const _renderButtonUpdatePlan = () => {
    if (isCurrentPlan) return;
    const getTextButton = () => {
      if (isDownGrade) return 'Downgrade';
      if (paymentMethod === PAYMENT_METHOD.CRYPTO && !isSufficientBalance)
        return 'Top Up';
      return 'Upgrade';
    };

    return (
      <>
        <Flex
          justifyContent={isMobile ? 'center' : 'flex-end'}
          width={isMobile ? '100%' : 'auto'}
        >
          <AppButton
            width={isMobile ? '100%' : 'auto'}
            size="lg"
            mt={3}
            isDisabled={isCurrentPlan}
            onClick={onClickButton}
          >
            {getTextButton()}
          </AppButton>
        </Flex>
      </>
    );
  };

  const _renderButton = () => {
    const isDisabled = planSelected.price === 0;
    return (
      <>
        <Flex justifyContent={isMobile ? 'center' : 'flex-end'}>
          <AppButton
            width={isMobile ? '100%' : 'auto'}
            size="lg"
            mt={isMobile ? 3 : 0}
            isDisabled={isDisabled}
            onClick={() => setStep(STEPS.FORM)}
          >
            Continue
          </AppButton>
        </Flex>
      </>
    );
  };

  const _renderStep1 = () => {
    return (
      <>
        <Flex justifyContent={'space-between'}>
          <Box className="heading-title">Billing</Box>
          {user?.isPaymentMethodIntegrated && (
            <Flex
              className="link"
              alignItems="center"
              mb={5}
              onClick={() => history.push('/billing-history')}
            >
              <Box mr={2}>Billing History</Box>
              <ArrowRightIcon />
            </Flex>
          )}
        </Flex>

        <AppCard className="list-table-wrap">
          <Flex
            justifyContent={'space-between'}
            alignItems={isMobile ? 'flex-start' : 'center'}
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <Box className={'text-title'}>Select Your Plan</Box>
            <AppButton
              mr={10}
              ml={isMobile ? 5 : 0}
              mb={isMobile ? 5 : 0}
              isDisabled={currentPlan.price === 0}
              variant="cancel"
              size="sm"
              onClick={() => setIsOpenCancelSubscriptionModal(true)}
            >
              Cancel Subscription
            </AppButton>
          </Flex>
          {isMobile ? _renderPlansMobile() : _renderPlansDesktop()}

          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            mx={isMobile ? 5 : 10}
            mt={5}
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <Box textAlign={'center'}>
              If you need more apps or higher limits, please{' '}
              <AppLink to="/contact-us" className="link">
                Contact Us
              </AppLink>
            </Box>
            <Box mb={isMobile ? 4 : 0} width={isMobile ? '100%' : 'auto'}>
              {userInfo?.isPaymentMethodIntegrated
                ? _renderButtonUpdatePlan()
                : _renderButton()}
            </Box>
          </Flex>

          {!isCurrentPlan && user?.isPaymentMethodIntegrated && (
            <Box
              px={isMobile ? 5 : 10}
              mb={isMobile ? 3 : 0}
              mt={isMobile ? 0 : 3}
            >
              {_renderWarning()}
            </Box>
          )}
          {isOpenCancelSubscriptionModal && (
            <ModalCancelSubscription
              open={isOpenCancelSubscriptionModal}
              onClose={() => setIsOpenCancelSubscriptionModal(false)}
            />
          )}
        </AppCard>

        {user?.isPaymentMethodIntegrated && (
          <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={5}>
            <Box
              className={`${
                paymentMethod === PAYMENT_METHOD.CARD ? 'active' : ''
              } box-method`}
            >
              <Flex justifyContent={'space-between'}>
                <Box
                  className="icon-checked-active"
                  onClick={() => onChangePaymentMethod(PAYMENT_METHOD.CARD)}
                >
                  {paymentMethod === PAYMENT_METHOD.CARD ? (
                    <CircleCheckedIcon />
                  ) : (
                    <RadioNoCheckedIcon />
                  )}
                </Box>
                <Box
                  onClick={() => setIsOpenEditCardModal(true)}
                  className={'box-method__btn-edit'}
                >
                  <EditIcon />
                </Box>
              </Flex>

              <Flex flexDirection={'column'} alignItems={'center'}>
                <Box className="box-method__name">Card</Box>
                <Box className="box-method__value">
                  (
                  {!userInfo?.stripePaymentMethod
                    ? '---'
                    : userInfo?.stripePaymentMethod?.card?.brand +
                      ' - ' +
                      userInfo?.stripePaymentMethod?.card?.last4}
                  )
                </Box>
                <ListCardIcon />
              </Flex>
            </Box>

            <Box
              className={`${
                paymentMethod === PAYMENT_METHOD.CRYPTO ? 'active' : ''
              } box-method`}
            >
              <Box
                className="icon-checked-active"
                onClick={() => onChangePaymentMethod(PAYMENT_METHOD.CRYPTO)}
              >
                {paymentMethod === PAYMENT_METHOD.CRYPTO ? (
                  <CircleCheckedIcon />
                ) : (
                  <RadioNoCheckedIcon />
                )}
              </Box>
              <Flex flexDirection={'column'} alignItems={'center'}>
                <Box className="box-method__name">Crypto</Box>
                <Box className="box-method__value">
                  (Total: ${user?.getBalance()})
                </Box>
                <CryptoIcon />
              </Flex>
            </Box>
            {isOpenEditCardModal && (
              <ModalEditCreditCard
                open={isOpenEditCardModal}
                onClose={() => setIsOpenEditCardModal(false)}
              />
            )}
          </Flex>
        )}
      </>
    );
  };

  const onNextStep = () => setStep((prevState) => prevState + 1);

  const onBackStep = () => setStep((prevState) => prevState - 1);

  const _renderContent = () => {
    switch (step) {
      case STEPS.LIST:
        return _renderStep1();
      case STEPS.FORM:
        return (
          <PartPaymentInfo
            planSelected={planSelected}
            onBack={onBackStep}
            onNext={onNextStep}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        );
      case STEPS.CHECKOUT:
        return (
          <PartCheckout
            planSelected={planSelected}
            paymentMethodCode={paymentMethod}
            onBack={
              user?.isPaymentMethodIntegrated
                ? () => setStep(STEPS.LIST)
                : onBackStep
            }
          />
        );
      default:
        return null;
    }
  };

  const _renderWarning = () => {
    if (isCurrentPlan || !user?.isPaymentMethodIntegrated) {
      return null;
    }
    return (
      <AppAlertWarning>
        {isDownGrade
          ? 'Your current plan would still be usable until the end of the current billing period. New plan will be applied with the next billing period. Some apps might become inactive to match limit of the Downgraded plan (changable later).'
          : 'Your current plan will be terminated. New plan will be applied with billing period starting today.'}
      </AppAlertWarning>
    );
  };

  return (
    <BasePageContainer className="billing-page">
      <>{_renderContent()}</>
    </BasePageContainer>
  );
};

export default BillingPage;
