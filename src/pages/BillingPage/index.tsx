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
import { AppButton, AppCard, AppLink } from 'src/components';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { IPlan } from 'src/store/billing';
import {
  CheckedIcon,
  RadioNoCheckedIcon,
  RadioChecked,
} from 'src/assets/icons';
import { isMobile } from 'react-device-detect';
import PartAddCard from './parts/PartAddCard';
import FormCrypto from './parts/FormCrypto';
import PartCheckout from './parts/PartCheckout';
import AppAlertWarning from 'src/components/AppAlertWarning';
import useUser from 'src/hooks/useUser';

export const PAYMENT_METHOD = {
  CARD: 'CARD',
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
    return '$0';
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
        className={`${isOpen ? 'open' : ''} ${isActivePlan ? 'active' : ''
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
            <Flex alignItems={'center'}>
              <CheckedIcon />
              <Box ml={3}> {plan.notificationLimitation} message/day </Box>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
};

const BillingPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHOD.CARD);
  const [planSelected, setPlanSelected] = useState<IPlan>({} as any);
  const [step, setStep] = useState<number>(STEPS.LIST);
  const { myPlan: currentPlan, plans: billingPlans } = useSelector(
    (state: RootState) => state.billing,
  );
  const { user } = useUser();

  useEffect(() => {
    setPlanSelected(currentPlan);
  }, [currentPlan]);

  const isSufficientBalance = useMemo(() => {
    if (!user) {
      return false;
    }
    return new BigNumber(user.getBalance()).isGreaterThanOrEqualTo(new BigNumber(planSelected.price));
  }, [user?.getBalance(), planSelected]);

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
                    <Box ml={3}> {plan.appLimitation} active apps </Box>
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

  const _renderStep1 = () => {
    return (
      <>
        <Box className="heading-title">Billing</Box>
        <AppCard className="list-table-wrap">
          <Box className={'text-title'}>Select Your Plan</Box>
          {isMobile ? _renderPlansMobile() : _renderPlansDesktop()}

          <Box
            textAlign={'center'}
            pt={isMobile ? 0 : 7}
            pb={isMobile ? 5 : 0}
            px={5}
          >
            For custom Enterprise plan with more Active Apps & messages/day, you
            can{' '}
            <AppLink to="/contact-us" className="link">
              Contact Us
            </AppLink>
          </Box>
        </AppCard>
        <AppCard className="box-payment-method" mt={7}>
          <Box className={'text-title'}>Payment Method</Box>
          {paymentMethods.map((item, index: number) => {
            return (
              <Flex
                className={'payment-method'}
                alignItems={'center'}
                key={index}
                onClick={() => setPaymentMethod(item.code)}
              >
                {paymentMethod === item.code ? (
                  <RadioChecked />
                ) : (
                  <RadioNoCheckedIcon />
                )}
                <Box ml={4}>{item.name}</Box>
              </Flex>
            );
          })}
        </AppCard>
      </>
    );
  };

  const onNextStep = () => setStep((prevState) => prevState + 1);

  const onBackStep = () => setStep((prevState) => prevState - 1);

  const _renderContent = () => {
    const isCardPaymentMethod = paymentMethod === PAYMENT_METHOD.CARD;
    switch (step) {
      case STEPS.LIST:
        return _renderStep1();
      case STEPS.FORM:
        if (isCardPaymentMethod) {
          return <PartAddCard onBack={onBackStep} onNext={onNextStep} />;
        }
        return (
          <FormCrypto
            planSelected={planSelected}
            onBack={onBackStep}
            onNext={onNextStep}
          />
        );
      case STEPS.CHECKOUT:
        return (
          <PartCheckout
            planSelected={planSelected}
            paymentMethodCode={paymentMethod}
            onBack={isCardPaymentMethod
              ? onBackStep
              : (
                isSufficientBalance
                  ? () => setStep(STEPS.LIST)
                  : onBackStep
              )}
          />
        );
      default:
        return null;
    }
  };

  const _renderWarning = () => {
    if (new BigNumber(planSelected.price).isEqualTo(new BigNumber(currentPlan.price))) {
      return null;
    }
    return (
      <AppAlertWarning>
        {
          new BigNumber(planSelected.price).isLessThan(new BigNumber(currentPlan.price))
            ? 'Your current plan would still be usable until the end of the current billing period. New plan will be applied with the next billing period. Some apps might become inactive to match limit of the Downgraded plan (changable later).'
            : 'Your current plan will be terminated. New plan will be applied with billing period starting today.'
        }
      </AppAlertWarning>
    )
  };

  const _renderButtonText = (): string => {
    if (new BigNumber(planSelected.price).isEqualTo(new BigNumber(currentPlan.price))) {
      return 'Continue';
    }
    if (new BigNumber(planSelected.price).isLessThan(new BigNumber(currentPlan.price))) {
      return 'Downgrade'
    }
    return 'Upgrade';
  };

  const onClickButton = () => {
    if (paymentMethod === PAYMENT_METHOD.CRYPTO) {
      setStep(isSufficientBalance ? STEPS.CHECKOUT : STEPS.FORM);
    } else {
      setStep(STEPS.FORM);
    }
  };

  const _renderButton = () => {
    if (step !== STEPS.LIST) {
      return null;
    }
    const isDisabled = planSelected.price === 0;
    return (
      <>
        {_renderWarning()}
        <Flex justifyContent={isMobile ? 'center' : 'flex-end'}>
          <AppButton
            width={isMobile ? '100%' : 'auto'}
            size="lg"
            mt={7}
            isDisabled={isDisabled}
            onClick={onClickButton}
          >
            {_renderButtonText()}
          </AppButton>
        </Flex>
      </>
    );
  };

  return (
    <BasePageContainer className="billing-page">
      <>
        {_renderContent()}
        {_renderButton()}
      </>
    </BasePageContainer>
  );
};

export default BillingPage;
