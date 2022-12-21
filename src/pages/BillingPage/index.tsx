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
import 'src/styles/pages/BillingPage.scss';
import { BasePageContainer } from 'src/layouts';
import { AppButton, AppCard, AppLink } from 'src/components';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { IPlan, IMyPlan } from 'src/store/billing';
import {
  CheckedIcon,
  RadioNoCheckedIcon,
  RadioChecked,
} from 'src/assets/icons';
import { isMobile } from 'react-device-detect';
import PartAddCard from './parts/PartAddCard';
import FormCrypto from './parts/FormCrypto';
import PartCheckout from './parts/PartCheckout';

export const planEnterprise = {
  code: 'ENTERPRISE',
  name: 'ENTERPRISE',
  appLimitation: 'Custom',
  notificationLimitation: 'Custom',
  price: null,
};

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
  planSelected: string;
  currentPlan: IMyPlan;
  onSelect: (value: string) => void;
}

const _renderPrice = (price: number | null) => {
  if (price === null)
    return (
      <>
        <AppLink className="link" to={'#'}>
          Contact us
        </AppLink>
      </>
    );

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
  const isActivePlan = planSelected === plan.code;
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
            onClick={() => onSelect(plan.code)}
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
  const [paymentMethod, setPaymentMethod] = useState<string>(
    PAYMENT_METHOD.CARD,
  );
  const [planSelected, setPlanSelected] = useState<any>('');
  const [step, setStep] = useState<number>(STEPS.LIST);
  const { myPlan: currentPlan, plans } = useSelector(
    (state: RootState) => state.billing,
  );

  useEffect(() => {
    setPlanSelected(currentPlan.code);
  }, [currentPlan]);

  const billingPlans = useMemo(() => [...plans, planEnterprise], [plans]);

  const _renderPlansDesktop = () => {
    const _renderBody = () => {
      return (
        <Tbody>
          {billingPlans?.map((plan: IPlan, index: number) => {
            const isCurrentPlan = plan.code === currentPlan.code;
            const isActivePlan = planSelected === plan.code;
            return (
              <Tr
                key={index}
                className={`${isActivePlan ? 'active' : ''} tr-list`}
                onClick={() => setPlanSelected(plan.code)}
              >
                <Td>
                  <Flex alignItems={'center'}>
                    {isActivePlan ? <RadioChecked /> : <RadioNoCheckedIcon />}
                    <Box ml={3}>{plan.name}</Box>

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
        <Table colorScheme="gray">{_renderBody()}</Table>
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
    switch (step) {
      case STEPS.LIST:
        return _renderStep1();
      case STEPS.FORM:
        if (paymentMethod === PAYMENT_METHOD.CARD) {
          return (
            <PartAddCard
              onBack={onBackStep}
              onNext={onNextStep}
            />
          );
        }
        return (
          <FormCrypto
            onBack={onBackStep}
            onNext={onNextStep}
          />
        );
      case STEPS.CHECKOUT:
        return (
          <PartCheckout
            planSelected={planSelected}
            paymentMethodCode={paymentMethod}
          />
        );
      default:
        return null;
    }
  };

  const _renderButton = () => (
    step === STEPS.LIST && (
      <Flex justifyContent={isMobile ? 'center' : 'flex-end'}>
        {planSelected === planEnterprise.code ? (
          <AppButton size="md" mt={7}>
            Contact Us
          </AppButton>
        ) : (
          <AppButton
            size="md"
            mt={7}
            isDisabled={planSelected === 'FREE'}
            onClick={() => setStep(STEPS.FORM)}
          >
            Continue
          </AppButton>
        )}
      </Flex>
    )
  );

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
