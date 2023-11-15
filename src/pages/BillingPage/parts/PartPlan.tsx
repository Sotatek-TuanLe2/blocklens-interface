import { Box, Flex, Text, Switch } from '@chakra-ui/react';
import commaNumber from 'comma-number';
import { useMemo, useState } from 'react';
import { CheckedIcon } from 'src/assets/icons';
import { AppButtonLarge } from 'src/components';
import useUser from 'src/hooks/useUser';
import { MetadataPlan } from 'src/store/metadata';
import { formatCapitalize } from 'src/utils/utils-helper';

interface IPlanProps {
  plan: MetadataPlan;
  onChangePlan: (plan: MetadataPlan) => void;
}

const PartPlan: React.FC<IPlanProps> = (props) => {
  const { plan, onChangePlan } = props;

  const yearlyOptions = plan.subscribeOptions.find(
    (item) => item.code === 'YEARLY_SUBSCRIPTION',
  );

  const [isYearly, setIsYearly] = useState<boolean>(!!yearlyOptions);

  const { user } = useUser();

  const getCUsPerSecond = () => {
    const rateLimitPerSecond = plan.rateLimit.find(
      (item) => item.duration === 1,
    );
    if (!rateLimitPerSecond) {
      return 0;
    }

    return rateLimitPerSecond.limit;
  };

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
        onClick={() => onChangePlan(plan)}
      >
        {`Switch to ${formatCapitalize(plan.name)}`}
      </AppButtonLarge>
    );
  };

  const descriptions: string[] = useMemo(() => {
    const result = [
      `${commaNumber(Math.ceil(plan.capacity.cu))} CUs/mo`,
      `Throughput ${commaNumber(getCUsPerSecond())} CUs/sec`,
      'All supported chains',
      `${
        plan.capacity.project
          ? `${plan.capacity.project} projects`
          : 'Unlimited projects'
      }`,
      '24/7 Discord support',
    ];
    if (plan.price > 0) {
      result.push('Extra CUs in demand');
    }

    return result;
  }, [plan]);

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
            {_renderPrice(plan.price)}
          </span>
        </Flex>
        {descriptions.map((des, index) => (
          <Flex
            key={index}
            className="all-plans__plan__descriptions"
            alignItems="center"
          >
            <CheckedIcon stroke="#28c76f" />
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
