import {
  Flex,
  Box,
  Tbody,
  Tr,
  Td,
  Table,
  TableContainer,
  Tooltip,
  Text,
  Thead,
  Th,
} from '@chakra-ui/react';
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import BigNumber from 'bignumber.js';
import 'src/styles/pages/BillingPage.scss';
import { BasePage } from 'src/layouts';
import {
  AppButton,
  AppCard,
  AppHeading,
  AppButtonLarge,
  AppDataTable,
  AppLoadingTable,
} from 'src/components';
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
  ChevronRightIcon,
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
import ModalChangePaymentMethod from 'src/modals/ModalChangePaymentMethod';
import {
  formatCapitalize,
  formatTimestamp,
  getErrorMessage,
  scrollIntoElementById,
} from '../../utils/utils-helper';
import { ROUTES } from 'src/utils/common';
import { Link } from 'react-router-dom';
import moment from 'moment';

interface ILineItems {
  amount: number;
  description: string;
  price: number;
  title: string;
  unit: number;
}

interface IBilling {
  createdAt: number;
  id: string;
  lineItems: ILineItems[];
  receiptId: string;
  status: string;
  totalAmount: number;
  type: string;
  userId: string;
  activePaymentMethod?: string;
  // stripePaymentMethod?: any;
}

export const PAYMENT_METHOD = {
  CARD: 'STRIPE',
  CRYPTO: 'BLOCKLENS',
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

const BILLING_STATUS = {
  SUCCESS: 'SUCCESS',
};

const INVOICE_TYPES = {
  UPGRADE_PLAN: 'UPGRADE_PLAN',
  DOWNGRADE_PLAN: 'DOWNGRADE_PLAN',
  RECURRING_CHARGE: 'RECURRING_CHARGE',
  EXTEND_PLAN: 'EXTEND_PLAN',
};

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

  return (
    <>
      ${price}
      <span className="month-text">/mo</span>
    </>
  );
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
              <Box ml={3}> {plan.capacity.project} apps </Box>
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
  const { user } = useUser();
  const { billingPlans } = useMetadata();
  const dispatch = useDispatch();
  const history = useHistory();

  const [paymentMethodSelected, setPaymentMethodSelected] = useState<
    string | any
  >(null);
  const [isOpenCancelSubscriptionModal, setIsOpenCancelSubscriptionModal] =
    useState<boolean>(false);
  const [planSelected, setPlanSelected] = useState<MetadataPlan>({} as any);
  const [isOpenEditCardModal, setIsOpenEditCardModal] =
    useState<boolean>(false);
  const [isOpenChangePayMethodModal, setIsOpenChangePayMethodModal] =
    useState<boolean>(false);
  const [isReloadingUserInfo, setIsReloadingUserInfo] =
    useState<boolean>(false);
  const [step, setStep] = useState<number>(STEPS.LIST);
  const [billingHistory, setBillingHistory] = useState<any[] | null>(null);

  useEffect(() => {
    setPaymentMethodSelected(user?.getActivePaymentMethod());
  }, []);

  const paymentMethod = useMemo(
    () => user?.getActivePaymentMethod(),
    [user?.getActivePaymentMethod()],
  );

  useEffect(() => {
    if (user) {
      setPlanSelected(user.getPlan());
    }
  }, [user?.getPlan()]);

  useEffect(() => {
    const RELOAD_BALANCE_DURATION = 30;
    let reloadBalanceInterval: any = null;
    if (paymentMethod === PAYMENT_METHOD.CRYPTO) {
      reloadBalanceInterval = setInterval(() => {
        dispatch(getUserProfile());
      }, RELOAD_BALANCE_DURATION * 1000);
    }
    return () => {
      clearInterval(reloadBalanceInterval);
    };
  }, [paymentMethod]);

  const isSufficientBalance = useMemo(() => {
    if (!user || !planSelected) {
      return false;
    }
    return new BigNumber(user.getBalance()).isGreaterThanOrEqualTo(
      new BigNumber(planSelected.price),
    );
  }, [user?.getBalance(), planSelected]);

  const fetchBillingHistory: any = useCallback(async (params: any) => {
    try {
      const res = await rf.getRequest('BillingRequest').getInvoiceList(params);
      const receiptIds =
        res.docs.map((item: any) => item?.receiptId || -1) || [];
      const listReceipt = await rf
        .getRequest('BillingRequest')
        .getListReceipt(receiptIds.join(',').toString());

      const dataTable = res?.docs.map((invoice: any, index: number) => {
        return {
          ...invoice,
          activePaymentMethod: listReceipt[index]?.activePaymentMethod || null,
          // stripePaymentMethod:
          //   listReceipt[index]?.resReference.stripePaymentMethod || null,
        };
      });
      setBillingHistory(dataTable);

      return {
        ...res,
        docs: dataTable,
      };
    } catch (error) {
      console.error(error);
    }
  }, []);

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
                    <Box ml={3}> {plan.capacity.project} apps </Box>
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

  const onUpdatePlan = async (plan: MetadataPlan) => {
    try {
      await rf
        .getRequest('BillingRequest')
        .updateBillingPlan({ code: plan.code });
      toastSuccess({ message: 'Downgrade Plan Successfully!' });
      dispatch(getUserPlan());
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const onChangePlan = async (plan: MetadataPlan) => {
    // if (isCurrentPlan || isDownGrade) {
    //   await onUpdatePlan();
    //   return;
    // }
    // // isUpgrade
    // if (paymentMethod === PAYMENT_METHOD.CARD && !user?.getStripePayment()) {
    //   toastError({ message: 'Please add your credit card for payment!' });
    //   return;
    // }

    // if (paymentMethod === PAYMENT_METHOD.CRYPTO) {
    //   if (isSufficientBalance) {
    //     setStep(STEPS.CHECKOUT);
    //   } else {
    //     setStep(STEPS.TOPUP);
    //   }
    // } else {
    //   setStep(STEPS.CHECKOUT);
    // }

    if (!user) {
      return;
    }

    const isCurrentPlan = new BigNumber(plan.price).isEqualTo(
      new BigNumber(user.getPlan().price || 0),
    );

    const isDownGrade = new BigNumber(plan.price).isLessThan(
      new BigNumber(user.getPlan().price || 0),
    );

    if (isCurrentPlan || isDownGrade) {
      return onUpdatePlan(plan);
    }

    setPlanSelected(plan);
    setStep(STEPS.CHECKOUT);
  };

  const onReloadUserInfo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReloadingUserInfo(true);
    await dispatch(getUserProfile());
    setIsReloadingUserInfo(false);
    toastSuccess({ message: 'Reload balance successfully!' });
  };

  // const _renderButtonUpdatePlan = () => {
  //   if (isCurrentPlan) return;
  //   const getTextButton = () => {
  //     if (isDownGrade) return 'Downgrade';
  //     return 'Upgrade';
  //   };

  //   return (
  //     <>
  //       <Flex
  //         justifyContent={isMobile ? 'center' : 'flex-end'}
  //         width={isMobile ? '100%' : 'auto'}
  //       >
  //         <AppButton
  //           width={isMobile ? '100%' : 'auto'}
  //           size="lg"
  //           mt={3}
  //           isDisabled={isCurrentPlan}
  //           onClick={onChangePlan}
  //         >
  //           {getTextButton()}
  //         </AppButton>
  //       </Flex>
  //     </>
  //   );
  // };

  // const _renderButton = () => {
  //   const isDisabled = planSelected.price === 0;
  //   return (
  //     <>
  //       <Flex justifyContent={isMobile ? 'center' : 'flex-end'}>
  //         <AppButton
  //           width={isMobile ? '100%' : 'auto'}
  //           size="lg"
  //           mt={isMobile ? 3 : 0}
  //           isDisabled={isDisabled}
  //           onClick={() => setStep(STEPS.FORM)}
  //         >
  //           Continue
  //         </AppButton>
  //       </Flex>
  //     </>
  //   );
  // };

  const _renderPlanBilling = () => {
    const onChangePaymentMethod = (
      method: typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD],
    ) => {
      if (paymentMethod === method) {
        return;
      }

      setIsOpenChangePayMethodModal(true);
      setPaymentMethodSelected(method);
    };

    const currentPlanDetails: {
      title: ReactNode;
      content: string;
    }[] = [
      {
        title: 'Renews on',
        content:
          !!user && user.getPlan()
            ? `${moment(user.getPlan().expireTime)
                .utc()
                .format('MMM D, YYYY')} (UTC)`
            : '',
      },
      {
        title: 'Compute Units',
        content: !!user
          ? `${Math.ceil(user.getPlan().capacity.cu / 30)} CUs/day`
          : '',
      },
      {
        title: 'Throughput',
        content: !!user
          ? `${Math.ceil(
              user.getPlan().capacity.cu / (30 * 24 * 60 * 60),
            )} CUs/second`
          : '',
      },
      {
        title: (
          <Flex>
            <span>Extra CUs</span>
            <Tooltip
              placement={'top'}
              hasArrow
              p={2}
              className="tooltip-app"
              label="When running out of CU, extra CU will be automatically added"
            >
              <Box className="icon-info" ml={2} cursor={'pointer'} />
            </Tooltip>
          </Flex>
        ),
        content: '1$/100K CUs',
      },
    ];

    const _renderCurrentPlan = () => {
      const isHighestPlan =
        !!billingPlans.length &&
        user?.getPlan().code === billingPlans[billingPlans.length - 1].code;

      return (
        <AppCard
          className={`list-table-wrap current-plan ${
            isHighestPlan ? 'current-plan--highest-plan' : ''
          }`}
        >
          <Box className="list-table-wrap__title">CURRENT PLAN</Box>
          <Flex className="list-table-wrap__content">
            <Box className="name-plan">
              {!!user ? user.getPlan().name.toLowerCase() : ''}
            </Box>
            {currentPlanDetails.map((item, index) => (
              <Box key={index} className="detail">
                <Box className="detail__title">{item.title}</Box>
                <Box className="detail__content">{item.content}</Box>
              </Box>
            ))}
            {!isHighestPlan && (
              <Box className="current-plan__button">
                <AppButtonLarge
                  onClick={() => scrollIntoElementById('all-plans')}
                >
                  <Box mr={2}>Upgrade</Box>
                  <ArrowRightIcon />
                </AppButtonLarge>
              </Box>
            )}
          </Flex>
        </AppCard>
      );
    };

    const _renderWarning = () => (
      <Flex
        justifyContent="space-between"
        alignItems="center"
        className="plan-warning"
      >
        <Flex>
          <span>
            Renewal of <b>Scale</b> plan is on hold due to lack of payment.
          </span>
          &nbsp;
          <Link to={'/'}>
            <Flex alignItems="center">
              <Text mr="6px" color="#1979FF">
                Retry payment
              </Text>
              <ChevronRightIcon width={14} height={14} stroke="#1979FF" />
            </Flex>
          </Link>
        </Flex>
        <AppButton variant="no-effects" className="dismiss-button">
          Dismiss
        </AppButton>
      </Flex>
    );

    const generateBillingMethod = (billing: IBilling) => {
      if (billing?.activePaymentMethod === PAYMENT_METHOD.CRYPTO) {
        return 'Crypto transfer';
      }

      if (billing?.activePaymentMethod === PAYMENT_METHOD.CARD) {
        return 'Credit card';
      }
      return '---';
    };

    const generateBillingPlan = (billing: IBilling) => {
      switch (billing.type) {
        case INVOICE_TYPES.DOWNGRADE_PLAN:
        case INVOICE_TYPES.UPGRADE_PLAN:
        case INVOICE_TYPES.EXTEND_PLAN:
          const plan = billingPlans.find(
            (item) => item.price === billing.totalAmount,
          );
          return plan ? `${formatCapitalize(plan.name)} plan` : billing.type;
        default:
          return '';
      }
    };

    const _renderBillings = () => (
      <AppCard className="list-table-wrap billings">
        <Box className="list-table-wrap__title">BILLINGS</Box>
        <AppDataTable
          wrapperClassName="billings__table"
          limit={5}
          fetchData={fetchBillingHistory}
          renderNoData={() => (
            <div
              style={{ marginTop: '25px', width: '100%', textAlign: 'center' }}
            >
              No billing history
            </div>
          )}
          renderBody={(billingsData) => (
            <Tbody>
              {billingsData.map((billing, index) => (
                <Tr key={index} className="tr-list">
                  <Td>{billing.id}</Td>
                  <Td>
                    {formatTimestamp(billing?.createdAt, 'HH:mm MM-DD-YYYY')}
                  </Td>
                  <Td>{generateBillingPlan(billing)}</Td>
                  <Td>${billing.totalAmount}</Td>
                  <Td>{generateBillingMethod(billing)}</Td>
                  <Td>
                    <Box
                      className={`billing-status billing-status--${
                        billing.status === BILLING_STATUS.SUCCESS
                          ? 'active'
                          : 'inactive'
                      }`}
                      textTransform="capitalize"
                    >
                      {billing.status.toLowerCase()}
                    </Box>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
          renderLoading={() => (
            <AppLoadingTable
              widthColumns={[1, 2, 3, 4, 5, 6].map(() => 100 / 6)}
            />
          )}
          renderHeader={() => {
            if (!billingHistory || billingHistory.length === 0) {
              return null;
            }

            return (
              <Thead className="header-list">
                <Tr>
                  {[
                    'Billing ID',
                    'Issue time (UTC)',
                    'Billing detail',
                    'Amount',
                    'Payment method',
                    'Status',
                  ].map((header) => (
                    <Th key={header}>{header}</Th>
                  ))}
                </Tr>
              </Thead>
            );
          }}
        />
      </AppCard>
    );

    const _renderAllPlans = () => (
      <AppCard id="all-plans" className="list-table-wrap all-plans">
        <Box className="list-table-wrap__title">ALL PLANS</Box>
        <Flex
          className="list-table-wrap__content"
          justifyContent="space-between"
        >
          {billingPlans?.map((plan: MetadataPlan) => (
            <Flex
              className="all-plans__plan"
              key={plan.code}
              flexDirection="column"
            >
              <Flex
                className="all-plans__plan__title"
                justifyContent="space-between"
                alignItems="center"
              >
                <span>{plan.name}</span>
                <span className="all-plans__plan__title__price">
                  {_renderPrice(plan.price)}
                </span>
              </Flex>
              <Flex
                className="all-plans__plan__descriptions"
                alignItems="center"
              >
                <CheckedIcon stroke="#28c76f" />
                <span className="all-plans__plan__descriptions__info all-plans__plan__descriptions__info--cu">
                  {Math.ceil(plan.capacity.cu / 30)} CUs/day
                </span>
              </Flex>
              <Flex
                className="all-plans__plan__descriptions"
                alignItems="center"
              >
                <CheckedIcon stroke="#28c76f" />
                <span className="all-plans__plan__descriptions__info">
                  Throughput {Math.ceil(plan.capacity.cu / (30 * 24 * 60 * 60))}{' '}
                  CUs/sec
                </span>
              </Flex>
              <Flex
                className="all-plans__plan__descriptions"
                alignItems="center"
              >
                <CheckedIcon stroke="#28c76f" />
                <span className="all-plans__plan__descriptions__info">
                  All APIs
                </span>
              </Flex>
              <Flex
                className="all-plans__plan__descriptions"
                alignItems="center"
              >
                <CheckedIcon stroke="#28c76f" />
                <span className="all-plans__plan__descriptions__info">
                  All supported chains
                </span>
              </Flex>
              <Flex
                className="all-plans__plan__descriptions"
                alignItems="center"
              >
                <CheckedIcon stroke="#28c76f" />
                <span className="all-plans__plan__descriptions__info">
                  {plan.capacity.project} projects
                </span>
              </Flex>
              <Flex
                className="all-plans__plan__descriptions"
                alignItems="center"
              >
                <CheckedIcon stroke="#28c76f" />
                <span className="all-plans__plan__descriptions__info">
                  24/7 Discord support
                </span>
              </Flex>
              {user?.getPlan().code === plan.code ? (
                <Text className="all-plans__plan__current-plan">
                  Your current plan
                </Text>
              ) : (
                <AppButtonLarge
                  className="all-plans__plan__button"
                  onClick={() => onChangePlan(plan)}
                >
                  {`Switch to ${formatCapitalize(plan.name)}`}
                </AppButtonLarge>
              )}
            </Flex>
          ))}
        </Flex>
      </AppCard>
    );

    return (
      <>
        <Flex justifyContent={'space-between'}>
          <Box mb={7}>
            <AppHeading title="Plan &amp; billing" />
          </Box>
          {user?.isPaymentMethodIntegrated() &&
            !!user?.getActivePaymentMethod() && (
              <Flex
                className="link"
                alignItems="center"
                mb={5}
                onClick={() => history.push(ROUTES.BILLING_HISTORY)}
              >
                <Box mr={2}>Billing History</Box>
                <ArrowRightIcon />
              </Flex>
            )}
        </Flex>
        {_renderCurrentPlan()}
        {_renderWarning()}
        {_renderBillings()}
        {_renderAllPlans()}
        {/* <AppCard className="list-table-wrap">
          <Flex className="box-title">
            <Box className={'text-title'}>Select Your Plan</Box>

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
            <Flex alignItems={'center'}>
              <Box textAlign={'center'} ml={2}>
                If you need more apps or higher limits, please{' '}
                <AppLink to={ROUTES.CONTACT_US} className="link">
                  Contact Us
                </AppLink>
              </Box>
            </Flex>
            <Box mb={isMobile ? 4 : 0} width={isMobile ? '100%' : 'auto'}>
              {user?.isPaymentMethodIntegrated() &&
                !!user?.getActivePaymentMethod()
                ? _renderButtonUpdatePlan()
                : _renderButton()}
            </Box>
          </Flex>

          {!isCurrentPlan && user?.isPaymentMethodIntegrated() && (
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

        {user?.isPaymentMethodIntegrated() && !!user?.getActivePaymentMethod() && (
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
                      <RadioNoCheckedIcon />
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpenEditCardModal(true);
                      }}
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
                onClick={() => onChangePaymentMethod(PAYMENT_METHOD.CRYPTO)}
              >
                <Box
                  className="icon-checked-active"
                  display="flex"
                  justifyContent="space-between"
                >
                  {paymentMethod === PAYMENT_METHOD.CRYPTO ? (
                    <CircleCheckedIcon />
                  ) : (
                    <RadioNoCheckedIcon />
                  )}
                </Box>
                <Flex flexDirection={'column'} alignItems={'center'}>
                  <Box className="box-method__name">Payment with crypto</Box>
                  <Flex>
                    <Box className="box-method__value" mr={3}>
                      (Total: ${user?.getBalance()})
                    </Box>
                    <Box mt={1}>
                      <ReloadIcon
                        className={isReloadingUserInfo ? 'is-reloading' : ''}
                        onClick={onReloadUserInfo}
                      />
                    </Box>
                  </Flex>
                  <CryptoIcon />
                </Flex>
              </Box>
              {isOpenEditCardModal && (
                <ModalEditCreditCard
                  open={isOpenEditCardModal}
                  onClose={() => setIsOpenEditCardModal(false)}
                />
              )}

              {isOpenChangePayMethodModal && (
                <ModalChangePaymentMethod
                  paymentMethodSelected={paymentMethodSelected}
                  open={isOpenChangePayMethodModal}
                  onClose={() => {
                    setIsOpenChangePayMethodModal(false);
                  }}
                />
              )}
            </Flex>
          </AppCard>
        )} */}
      </>
    );
  };

  const onBackStep = () => setStep((prevState) => prevState - 1);

  const _renderContent = () => {
    switch (step) {
      case STEPS.LIST:
        return _renderPlanBilling();
      case STEPS.FORM:
        return (
          <PartPaymentInfo
            planSelected={planSelected}
            onBack={onBackStep}
            onNext={() => setStep(STEPS.CHECKOUT)}
            paymentMethod={paymentMethodSelected}
            setPaymentMethod={setPaymentMethodSelected}
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
              user?.isPaymentMethodIntegrated()
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
    if (isCurrentPlan || !user?.isPaymentMethodIntegrated()) {
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
    <BasePage className="billing-page">
      <>{_renderContent()}</>
    </BasePage>
  );
};

export default BillingPage;
