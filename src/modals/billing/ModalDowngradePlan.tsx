import { Box, Flex, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { CheckedIcon } from 'src/assets/icons';
import useMetadata from 'src/hooks/useMetadata';
import useUser from 'src/hooks/useUser';
import { MetadataPlan } from 'src/store/metadata';
import { getUserPlan } from 'src/store/user';
import { getErrorMessage, scrollIntoElementById } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import BaseModal from '../BaseModal';
import rf from 'src/requests/RequestFactory';
import moment from 'moment';
import { generatePlanDescriptions } from 'src/pages/BillingPage/parts/PartPlan';

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
      dispatch(getUserPlan());
      scrollIntoElementById('current-plan');
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
            {generatePlanDescriptions(item.plan).map((des, index) => (
              <Flex
                key={index}
                className="plan-descriptions"
                alignItems="center"
              >
                <Box w="14px">
                  <CheckedIcon stroke="#28c76f" />
                </Box>
                <span
                  className={`plan-descriptions__info ${
                    index === 0 ? 'plan-descriptions__info--cu' : ''
                  }`}
                >
                  {des}
                </span>
              </Flex>
            ))}
          </Box>
        ))}
      </Flex>
      <Text className="modal-downgrade-plan__period">
        <span className="period-title">{`${user
          ?.getPlan()
          .name.toUpperCase()} plan will remain until end of this period: `}</span>
        <span className="period-time">{`${moment(user?.getPlan().expireAt)
          .utc()
          .format('MMM DD, YYYY')} (UTC)`}</span>
      </Text>
      {!!billingPlans.length && downgradePlan.code !== billingPlans[0].code && (
        <Text className="modal-downgrade-plan__period">
          <span className="period-title">{`Payment for new plan ${downgradePlan.name.toUpperCase()} required from: `}</span>
          <span className="period-time">{`${moment(user?.getPlan().expireAt)
            .subtract(5, 'day')
            .utc()
            .format('MMM DD, YYYY')} (UTC)`}</span>
        </Text>
      )}
    </BaseModal>
  );
};

export default ModalDowngradePlan;
