import { Box, Flex, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { CheckedIcon } from 'src/assets/icons';
import useMetadata from 'src/hooks/useMetadata';
import useUser from 'src/hooks/useUser';
import { MetadataPlan } from 'src/store/metadata';
import { getUserPlan } from 'src/store/user';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import BaseModal from '../BaseModal';
import rf from 'src/requests/RequestFactory';
import moment from 'moment';

interface IModalDowngradePlanProps {
  downgradePlan: MetadataPlan;
  onClose: () => void;
}

const ModalDowngradePlan: React.FC<IModalDowngradePlanProps> = (props) => {
  const { downgradePlan, onClose } = props;
  const { billingPlans } = useMetadata();
  const { user } = useUser();
  const dispatch = useDispatch();

  const comparision: {
    title: string;
    plan: MetadataPlan;
  }[] = useMemo(() => {
    if (!user?.getPlan()) {
      return [];
    }

    return [
      { title: 'From plan', plan: user.getPlan() },
      { title: 'To plan', plan: downgradePlan },
    ];
  }, [user?.getPlan(), downgradePlan]);

  const onDowngradePlan = async () => {
    try {
      await rf
        .getRequest('BillingRequest')
        .downgradeSubscription(downgradePlan.code);
      toastSuccess({ message: 'Downgrade Plan Successfully!' });
      dispatch(getUserPlan());
      onClose();
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  return (
    <BaseModal
      isOpen
      size="2xl"
      title="Downgrade"
      className="modal-downgrade-plan"
      onClose={onClose}
      onActionLeft={onDowngradePlan}
      textActionLeft="Confirm"
      onActionRight={onClose}
      textActionRight="Cancel"
    >
      <Flex
        className="modal-downgrade-plan__comparision"
        justifyContent="space-between"
      >
        {comparision.map((item) => (
          <Box
            key={item.title}
            className="modal-downgrade-plan__comparision__plan"
          >
            <Text className="plan-title">{item.title}</Text>
            <Text className="plan-name">{item.plan.name}</Text>
            <Flex className="plan-descriptions" alignItems="center">
              <CheckedIcon stroke="#28c76f" />
              <span className="plan-descriptions__info plan-descriptions__info--cu">
                {Math.ceil(item.plan.capacity.cu / 30)} CUs/day
              </span>
            </Flex>
            <Flex className="plan-descriptions" alignItems="center">
              <CheckedIcon stroke="#28c76f" />
              <span className="plan-descriptions__info">
                Throughput{' '}
                {Math.ceil(item.plan.capacity.cu / (30 * 24 * 60 * 60))} CUs/sec
              </span>
            </Flex>
            <Flex className="plan-descriptions" alignItems="center">
              <CheckedIcon stroke="#28c76f" />
              <span className="plan-descriptions__info">All APIs</span>
            </Flex>
            <Flex className="plan-descriptions" alignItems="center">
              <CheckedIcon stroke="#28c76f" />
              <span className="plan-descriptions__info">
                All supported chains
              </span>
            </Flex>
            <Flex className="plan-descriptions" alignItems="center">
              <CheckedIcon stroke="#28c76f" />
              <span className="plan-descriptions__info">
                {item.plan.capacity.project} projects
              </span>
            </Flex>
            <Flex className="plan-descriptions" alignItems="center">
              <CheckedIcon stroke="#28c76f" />
              <span className="plan-descriptions__info">
                24/7 Discord support
              </span>
            </Flex>
          </Box>
        ))}
      </Flex>
      <Text className="modal-downgrade-plan__period">
        <span className="period-title">{`${user
          ?.getPlan()
          .name.toUpperCase()} plan will remain until end of this period: `}</span>
        <span className="period-time">{`${moment(user?.getPlan().expireTime)
          .utc()
          .format('MMM DD, YYYY')} (UTC)`}</span>
      </Text>
      {!!billingPlans.length && downgradePlan.code !== billingPlans[0].code && (
        <Text className="modal-downgrade-plan__period">
          <span className="period-title">{`Payment for new plan ${downgradePlan.name.toUpperCase()} required from: `}</span>
          <span className="period-time">{`${moment(user?.getPlan().expireTime)
            .subtract(5, 'day')
            .utc()
            .format('MMM DD, YYYY')} (UTC)`}</span>
        </Text>
      )}
    </BaseModal>
  );
};

export default ModalDowngradePlan;
