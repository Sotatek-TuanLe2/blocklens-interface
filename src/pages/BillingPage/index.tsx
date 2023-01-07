import {
  Flex,
  Box,
  Tbody,
  Tr,
  Td,
  Table,
  TableContainer,
} from '@chakra-ui/react';
import { FC, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import 'src/styles/pages/BillingPage.scss';
import { BasePageContainer } from 'src/layouts';
import { AppButton, AppCard, AppLink, AppHeading } from 'src/components';
import { useDispatch } from 'react-redux';
import {
  CheckedIcon,
  RadioNoCheckedIcon,
  RadioChecked,
  ArrowRightIcon,
  EditIcon,
  ListCardIcon,
  CircleCheckedIcon,
  CryptoIcon,
  ReloadIcon,
  WarningIcon,
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
import PartTopUp from './parts/PartTopUp';
import { getUserPlan, getUserProfile } from 'src/store/user';
import { MetadataPlan } from 'src/store/metadata';
import useMetadata from 'src/hooks/useMetadata';

export const PAYMENT_METHOD = {
  CARD: 'STRIPE',
  CRYPTO: 'CRYPTO',
};

enum STEPS {
  LIST,
  FORM,
  TOPUP,
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
  plan: MetadataPlan;
  planSelected: MetadataPlan;
  currentPlan: MetadataPlan;
  onSelect: (value: MetadataPlan) => void;
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
              <Box ml={3}> {plan.appLimitation} apps </Box>
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
  const [paymentMethod, setPaymentMethod] = useState<string | any>(null);
  const [isOpenCancelSubscriptionModal, setIsOpenCancelSubscriptionModal] =
    useState<boolean>(false);
  const [planSelected, setPlanSelected] = useState<MetadataPlan>({} as any);
  const [isOpenEditCardModal, setIsOpenEditCardModal] =
    useState<boolean>(false);
  const [isReloadingUserInfo, setIsReloadingUserInfo] =
    useState<boolean>(false);
  const [step, setStep] = useState<number>(STEPS.LIST);
  const { user } = useUser();
  const { billingPlans } = useMetadata();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setPaymentMethod(user?.getActivePaymentMethod());
  }, [user]);

  useEffect(() => {
    if (user) {
      setPlanSelected(user.getPlan());
    }
  }, [user?.getPlan()]);

  useEffect(() => {
    const RELOAD_BALANCE_DURATION = 30;
    let reloadBalanceInterval: any = null;
    if (user?.getActivePaymentMethod() === PAYMENT_METHOD.CRYPTO) {
      reloadBalanceInterval = setInterval(() => {
        dispatch(getUserProfile());
      }, RELOAD_BALANCE_DURATION * 1000);
    }
    return () => {
      clearInterval(reloadBalanceInterval);
    };
  }, [user?.getActivePaymentMethod()]);

  const isSufficientBalance = useMemo(() => {
    if (!user) {
      return false;
    }
    return new BigNumber(user.getBalance()).isGreaterThanOrEqualTo(
      new BigNumber(planSelected.price),
    );
  }, [user?.getBalance(), planSelected]);

  const isCurrentPlan = new BigNumber(planSelected.price).isEqualTo(
    new BigNumber(user?.getPlan().price || 0),
  );
  const isDownGrade = new BigNumber(planSelected.price).isLessThan(
    new BigNumber(user?.getPlan().price || 0),
  );

  const _renderPlansDesktop = () => {
    const _renderBody = () => {
      return (
        <Tbody>
          {billingPlans?.map((plan: MetadataPlan, index: number) => {
            const isCurrentPlan = plan.code === user?.getPlan().code;
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
    if (!user) {
      return null;
    }
    return (
      <Box className="list-card-mobile">
        {billingPlans?.map((plan: MetadataPlan, index: number) => {
          return (
            <PlanMobile
              plan={plan}
              key={index}
              currentPlan={user.getPlan()}
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
      dispatch(getUserPlan());
    } catch (error: any) {
      toastError({ message: error.message });
    }
  };

  const onChangePaymentMethod = async (method: string) => {
    try {
      await rf
        .getRequest('UserRequest')
        .editInfoUser({ activePaymentMethod: method });

      if (method === PAYMENT_METHOD.CARD && !user?.getStripePayment()) {
        setIsOpenEditCardModal(true);
      } else {
        toastSuccess({ message: 'Update Successfully!' });
      }
      await dispatch(getUserProfile());
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
    if (paymentMethod === PAYMENT_METHOD.CARD && !user?.getStripePayment()) {
      toastError({ message: 'Please add your credit card for payment!' });
      return;
    }

    if (paymentMethod === PAYMENT_METHOD.CRYPTO) {
      if (isSufficientBalance) {
        setStep(STEPS.CHECKOUT);
      } else {
        setStep(STEPS.TOPUP);
      }
    } else {
      setStep(STEPS.CHECKOUT);
    }
  };

  const onReloadUserInfo = async () => {
    setIsReloadingUserInfo(true);
    await dispatch(getUserProfile());
    setIsReloadingUserInfo(false);
    toastSuccess({ message: 'Reload balance successfully!' });
  };

  const _renderButtonUpdatePlan = () => {
    if (isCurrentPlan) return;
    const getTextButton = () => {
      if (isDownGrade) return 'Downgrade';
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
          <Box mb={7}>
            <AppHeading title="Billing" />
          </Box>

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
          <Flex className="box-title">
            <Box className={'text-title'}>Change Your Plan</Box>

            {user?.getPlan().price !== 0 && (
              <Box className="box-btn-cancel">
                <AppButton
                  variant="cancel"
                  size="sm"
                  onClick={() => setIsOpenCancelSubscriptionModal(true)}
                >
                  Cancel Subscription
                </AppButton>
              </Box>
            )}
          </Flex>

          {isMobile ? _renderPlansMobile() : _renderPlansDesktop()}

          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            mx={isMobile ? 5 : 10}
            mt={5}
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <Flex>
              <WarningIcon />
              <Box textAlign={'center'} ml={3}>
                If you need more apps or higher limits, please{' '}
                <AppLink to="/contact-us" className="link">
                  Contact Us
                </AppLink>
              </Box>
            </Flex>
            <Box mb={isMobile ? 4 : 0} width={isMobile ? '100%' : 'auto'}>
              {user?.isPaymentMethodIntegrated()
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
          <AppCard className={'box-change-plan'}>
            <Box className={'box-change-plan__title'}>
              Change Payment Method
            </Box>
            <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={5}>
              <Box
                className={`${
                  paymentMethod === PAYMENT_METHOD.CARD ? 'active' : ''
                } box-method`}
              >
                <Flex justifyContent={'space-between'}>
                  <Box className="icon-checked-active">
                    {paymentMethod === PAYMENT_METHOD.CARD ? (
                      <CircleCheckedIcon />
                    ) : (
                      <RadioNoCheckedIcon
                        onClick={() =>
                          onChangePaymentMethod(PAYMENT_METHOD.CARD)
                        }
                      />
                    )}
                  </Box>
                </Flex>

                <Flex flexDirection={'column'} alignItems={'center'}>
                  <Box className="box-method__name">Payment with card</Box>
                  <Flex alignItems={'flex-start'}>
                    <Box className="box-method__value">
                      (
                      {!user.getStripePayment()
                        ? '---'
                        : user.getStripePayment()?.card?.brand +
                          ' - ' +
                          user.getStripePayment().card?.last4}
                      )
                    </Box>
                    <Box
                      ml={4}
                      mt={1}
                      onClick={() => setIsOpenEditCardModal(true)}
                      className={'box-method__btn-edit'}
                    >
                      <EditIcon />
                    </Box>
                  </Flex>
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
                  display="flex"
                  justifyContent="space-between"
                >
                  {paymentMethod === PAYMENT_METHOD.CRYPTO ? (
                    <CircleCheckedIcon />
                  ) : (
                    <RadioNoCheckedIcon
                      onClick={() =>
                        onChangePaymentMethod(PAYMENT_METHOD.CRYPTO)
                      }
                    />
                  )}
                  <ReloadIcon
                    className={isReloadingUserInfo ? 'is-reloading' : ''}
                    onClick={onReloadUserInfo}
                  />
                </Box>
                <Flex flexDirection={'column'} alignItems={'center'}>
                  <Box className="box-method__name">Payment with crypto</Box>
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
          </AppCard>
        )}
      </>
    );
  };

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
            onNext={() => setStep(STEPS.CHECKOUT)}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        );
      case STEPS.TOPUP:
        return (
          <PartTopUp
            planSelected={planSelected}
            onBack={() => setStep(STEPS.LIST)}
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
                : () => setStep(STEPS.FORM)
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
