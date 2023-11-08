import { Box, Flex, Tbody, Td, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { ArrowRightIcon } from 'src/assets/icons';
import {
  AppButtonLarge,
  AppCard,
  AppDataTable,
  AppHeading,
  AppLoadingTable,
} from 'src/components';
import useMetadata from 'src/hooks/useMetadata';
import useUser from 'src/hooks/useUser';
import { MetadataPlan } from 'src/store/metadata';
import {
  formatCapitalize,
  formatTimestamp,
  scrollIntoElementById,
} from 'src/utils/utils-helper';
import { PAYMENT_METHOD } from '..';
import PartNotification, { NOTIFICATION_TYPE } from './PartNotification';
import PartPlan from './PartPlan';
import rf from 'src/requests/RequestFactory';
import { useDispatch } from 'react-redux';
import ModalDowngradePlan from 'src/modals/billing/ModalDowngradePlan';

interface IPartBillingProps {
  onUpgradePlan: (plan: MetadataPlan) => void;
}

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

const INVOICE_TYPES = {
  UPGRADE_PLAN: 'UPGRADE_PLAN',
  DOWNGRADE_PLAN: 'DOWNGRADE_PLAN',
  RECURRING_CHARGE: 'RECURRING_CHARGE',
  EXTEND_PLAN: 'EXTEND_PLAN',
};

const BILLING_STATUS = {
  SUCCESS: 'SUCCESS',
};

const PartBilling: React.FC<IPartBillingProps> = (props) => {
  const { onUpgradePlan } = props;

  const { user } = useUser();
  const { billingPlans } = useMetadata();
  const dispatch = useDispatch();

  const [billingHistory, setBillingHistory] = useState<any[] | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MetadataPlan | null>(null);
  const [openDowngradeModal, setOpenDowngradeModal] = useState<boolean>(false);

  const userPlan = useMemo(() => user?.getPlan(), [user?.getPlan()]);

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

  const currentPlanDetails: {
    title: ReactNode;
    content: string;
  }[] = useMemo(
    () => [
      {
        title: 'Renews on',
        content: !!userPlan
          ? `${moment(userPlan.expireTime).utc().format('MMM D, YYYY')} (UTC)`
          : '',
      },
      {
        title: 'Compute Units',
        content: !!userPlan
          ? `${Math.ceil(userPlan.capacity.cu / 30)} CUs/day`
          : '',
      },
      {
        title: 'Throughput',
        content: !!userPlan
          ? `${Math.ceil(
              userPlan.capacity.cu / (30 * 24 * 60 * 60),
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
    ],
    [userPlan],
  );

  const _renderCurrentPlan = () => {
    const isLowestPlan =
      !!billingPlans.length && userPlan?.code === billingPlans[0].code;
    const isHighestPlan =
      !!billingPlans.length &&
      userPlan?.code === billingPlans[billingPlans.length - 1].code;

    if (isLowestPlan) {
      // remove Renews on
      currentPlanDetails.shift();
    }

    return (
      <AppCard
        className={`list-table-wrap current-plan ${
          isHighestPlan ? 'current-plan--highest-plan' : ''
        } ${isLowestPlan ? 'current-plan--lowest-plan' : ''}`}
      >
        <Box className="list-table-wrap__title">CURRENT PLAN</Box>
        <Flex className="list-table-wrap__content">
          <Box className="name-plan">{userPlan?.name.toLowerCase() || ''}</Box>
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

  const generateBillingMethod = (billing: IBilling) => {
    if (billing?.activePaymentMethod === PAYMENT_METHOD.CRYPTO) {
      return 'Crypto transfer';
    }

    if (billing?.activePaymentMethod === PAYMENT_METHOD.CARD) {
      return 'Credit card';
    }
    return '--';
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

  const onChangePlan = (plan: MetadataPlan) => {
    if (!user) {
      return;
    }

    const isDownGrade = new BigNumber(plan.price).isLessThan(
      new BigNumber(userPlan?.price || 0),
    );

    if (isDownGrade) {
      setSelectedPlan(plan);
      setOpenDowngradeModal(true);
    } else {
      onUpgradePlan(plan);
    }
  };

  const onCloseDowngradeModal = () => setOpenDowngradeModal(false);

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
      <Flex className="list-table-wrap__content" justifyContent="space-between">
        {billingPlans?.map((plan: MetadataPlan, index: number) => {
          const hasYearlyPlan = index === billingPlans.length - 1;
          return (
            <PartPlan
              plan={plan}
              hasYearlyPlan={hasYearlyPlan}
              onChangePlan={onChangePlan}
            />
          );
        })}
      </Flex>
    </AppCard>
  );

  return (
    <>
      <Flex justifyContent={'space-between'}>
        <Box mb={7}>
          <AppHeading title="Plan &amp; billing" />
        </Box>
      </Flex>
      {_renderCurrentPlan()}
      <PartNotification variant={NOTIFICATION_TYPE.WARNING_DOWNGRADE} />
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
      {openDowngradeModal && selectedPlan && (
        <ModalDowngradePlan
          downgradePlan={selectedPlan}
          onClose={onCloseDowngradeModal}
        />
      )}
    </>
  );
};

export default PartBilling;
