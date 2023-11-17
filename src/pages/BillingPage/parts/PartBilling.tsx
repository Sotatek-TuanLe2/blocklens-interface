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
import PartNotification from './PartNotification';
import PartPlan from './PartPlan';
import rf from 'src/requests/RequestFactory';
import ModalDowngradePlan from 'src/modals/billing/ModalDowngradePlan';
import commaNumber from 'comma-number';

interface IPartBillingProps {
  onCheckout: (plan: MetadataPlan, isYearly: boolean) => void;
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
  const { onCheckout } = props;

  const { user } = useUser();
  const { billingPlans } = useMetadata();

  const [billingHistory, setBillingHistory] = useState<any[] | null>(null);
  const [downgradePlan, setDowngradePlan] = useState<MetadataPlan | null>(null);
  const [openDowngradeModal, setOpenDowngradeModal] = useState<boolean>(false);

  const userPlan = useMemo(() => user?.getPlan(), [user?.getPlan()]);

  const fetchBillingHistory: any = useCallback(async (params: any) => {
    try {
      const res = await rf.getRequest('BillingRequest').getInvoiceList(params);
      const receiptIds =
        res.docs.map((item: any) => item?.receiptId || -1) || [];

      if (!!receiptIds.length) {
        const listReceipt = await rf
          .getRequest('BillingRequest')
          .getListReceipt(receiptIds.join(',').toString());

        const dataTable = res?.docs.map((invoice: any, index: number) => {
          return {
            ...invoice,
            activePaymentMethod:
              listReceipt[index]?.activePaymentMethod || null,
          };
        });
        setBillingHistory(dataTable);

        return {
          ...res,
          docs: dataTable,
        };
      }

      setBillingHistory(res.docs);
      return res;
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
        title: 'Expire',
        content: !!userPlan
          ? `${moment(userPlan.expireTime).utc().format('MMM D, YYYY')} (UTC)`
          : '',
      },
      {
        title: 'Compute Units',
        content: !!userPlan
          ? `${commaNumber(userPlan.capacity.cu)} CUs/mo`
          : '',
      },
      {
        title: 'Throughput',
        content: !!userPlan
          ? `${commaNumber(
              userPlan.rateLimit.find((item) => item.type === 'SECOND')
                ?.limit || 0,
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

    // TODO: hide Upgrade button if user confirms downgrade
    const isDowngrade = false;

    return (
      <AppCard
        className={`list-table-wrap current-plan ${
          isHighestPlan ? 'current-plan--highest-plan' : ''
        } ${isLowestPlan ? 'current-plan--lowest-plan' : ''}`}
      >
        <Box className="list-table-wrap__title">CURRENT PLAN</Box>
        <Flex className="list-table-wrap__content">
          <Box className="name-plan">{userPlan?.name.toLowerCase() || ''}</Box>
          {currentPlanDetails
            // remove Expire
            .filter((_item, index) => (isLowestPlan ? index !== 0 : true))
            .map((item, index) => (
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

  const onChangePlan = (plan: MetadataPlan, isYearly: boolean) => {
    if (!user) {
      return;
    }

    const isDownGrade = new BigNumber(plan.price).isLessThan(
      new BigNumber(userPlan?.price || 0),
    );

    if (isDownGrade) {
      setDowngradePlan(plan);
      setOpenDowngradeModal(true);
    } else {
      onCheckout(plan, isYearly);
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
        {billingPlans?.map((plan: MetadataPlan) => (
          <PartPlan key={plan.code} plan={plan} onChangePlan={onChangePlan} />
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
      </Flex>
      {_renderCurrentPlan()}
      <PartNotification onCheckout={onCheckout} />
      {_renderBillings()}
      {_renderAllPlans()}
      {openDowngradeModal && downgradePlan && (
        <ModalDowngradePlan
          downgradePlan={downgradePlan}
          onClose={onCloseDowngradeModal}
        />
      )}
    </>
  );
};

export default PartBilling;
