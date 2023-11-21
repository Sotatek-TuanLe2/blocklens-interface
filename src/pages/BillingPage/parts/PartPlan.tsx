import { Box, Flex, Text, Switch } from '@chakra-ui/react';
import { useState } from 'react';
import { CheckedIcon } from 'src/assets/icons';
import { AppButtonLarge } from 'src/components';
import useUser from 'src/hooks/useUser';
import { MetadataPlan } from 'src/store/metadata';
import { YEARLY_SUBSCRIPTION_CODE } from 'src/utils/common';
import { formatCapitalize } from 'src/utils/utils-helper';

interface IPlanProps {
  plan: MetadataPlan;
  onChangePlan: (plan: MetadataPlan, isYearly: boolean) => void;
}

export const generatePlanDescriptions = (plan: MetadataPlan): string[] => {
  return plan.description.split('\n').map((description) => description.trim());
};

const PartPlan: React.FC<IPlanProps> = (props) => {
  const { plan, onChangePlan } = props;

  const yearlyOptions = plan.subscribeOptions.find(
    (item) => item.code === YEARLY_SUBSCRIPTION_CODE,
  );

  const [isYearly, setIsYearly] = useState<boolean>(!!yearlyOptions);

  const { user } = useUser();

  const _renderPrice = (plan: MetadataPlan) => {
    if (plan.price === 0) {
      return 'Free';
    }

    return (
      <>
        $
        {isYearly
          ? plan.price -
            (yearlyOptions?.discount || 0) / (yearlyOptions?.numOfMonths || 1)
          : plan.price}
        <span className="month-text">/mo</span>
      </>
    );
  };

  const _renderButton = () => {
    if (!user) {
      return null;
    }
    if (user?.getPlan().code === plan.code) {
      return (
        <Text className="all-plans__plan__current-plan">Your current plan</Text>
      );
    }
    if (user?.getNextPlan().code === plan.code) {
      return (
        <Text className="all-plans__plan__current-plan">Your next plan</Text>
      );
    }
    return (
      <AppButtonLarge
        className="all-plans__plan__button"
        onClick={() => onChangePlan(plan, isYearly)}
      >
        {`Switch to ${formatCapitalize(plan.name)}`}
      </AppButtonLarge>
    );
  };

  return (
    <Box className="all-plans__plan-container">
      {!!yearlyOptions && (
        <Flex className="all-plans__yearly-select" alignItems="center">
          <Switch
            size="sm"
            isChecked={isYearly}
            onChange={(e) => setIsYearly(e.target.checked)}
          />
          <Text ml={2} textDecoration={!isYearly ? 'line-through' : ''}>
            Pay yearly, save up <b>{yearlyOptions.discount}$</b>
          </Text>
        </Flex>
      )}
      <Flex
        className={`all-plans__plan ${
          !!yearlyOptions ? 'all-plans__plan--yearly' : ''
        }`}
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
            {_renderPrice(plan)}
          </span>
        </Flex>
        {generatePlanDescriptions(plan).map((des, index) => (
          <Flex
            key={index}
            className="all-plans__plan__descriptions"
            alignItems="center"
          >
            <Box w="14px">
              <CheckedIcon stroke="#28c76f" />
            </Box>
            <span
              className={`all-plans__plan__descriptions__info ${
                index === 0 ? 'all-plans__plan__descriptions__info--cu' : ''
              }`}
            >
              {des}
            </span>
          </Flex>
        ))}
        {_renderButton()}
      </Flex>
    </Box>
  );
};

export default PartPlan;
