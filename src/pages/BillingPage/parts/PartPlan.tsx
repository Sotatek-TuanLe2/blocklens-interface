import { Box, Flex, Text, Switch } from '@chakra-ui/react';
import { useState } from 'react';
import { CheckedIcon } from 'src/assets/icons';
import { AppButtonLarge } from 'src/components';
import useUser from 'src/hooks/useUser';
import { MetadataPlan } from 'src/store/metadata';
import { formatCapitalize } from 'src/utils/utils-helper';

interface IPlanProps {
  plan: MetadataPlan;
  hasYearlyPlan?: boolean;
  onChangePlan: (plan: MetadataPlan) => void;
}

const PartPlan: React.FC<IPlanProps> = (props) => {
  const { plan, hasYearlyPlan = false, onChangePlan } = props;
  const [isYearly, setIsYearly] = useState<boolean>(hasYearlyPlan);

  const { user } = useUser();

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

  const showYearlySelect = hasYearlyPlan && user?.getPlan().code !== plan.code;

  return (
    <Box className="all-plans__plan-container">
      {showYearlySelect && (
        <Flex className="all-plans__yearly-select" alignItems="center">
          <Switch
            size="sm"
            isChecked={isYearly}
            onChange={(e) => setIsYearly(e.target.checked)}
          />
          <Text ml={2} textDecoration={!isYearly ? 'line-through' : ''}>
            Pay yearly, save up <b>240$</b>
          </Text>
        </Flex>
      )}
      <Flex
        className={`all-plans__plan ${
          hasYearlyPlan ? 'all-plans__plan--yearly' : ''
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
        <Flex className="all-plans__plan__descriptions" alignItems="center">
          <CheckedIcon stroke="#28c76f" />
          <span className="all-plans__plan__descriptions__info all-plans__plan__descriptions__info--cu">
            {Math.ceil(plan.capacity.cu / 30)} CUs/day
          </span>
        </Flex>
        <Flex className="all-plans__plan__descriptions" alignItems="center">
          <CheckedIcon stroke="#28c76f" />
          <span className="all-plans__plan__descriptions__info">
            Throughput {Math.ceil(plan.capacity.cu / (30 * 24 * 60 * 60))}{' '}
            CUs/sec
          </span>
        </Flex>
        <Flex className="all-plans__plan__descriptions" alignItems="center">
          <CheckedIcon stroke="#28c76f" />
          <span className="all-plans__plan__descriptions__info">All APIs</span>
        </Flex>
        <Flex className="all-plans__plan__descriptions" alignItems="center">
          <CheckedIcon stroke="#28c76f" />
          <span className="all-plans__plan__descriptions__info">
            All supported chains
          </span>
        </Flex>
        <Flex className="all-plans__plan__descriptions" alignItems="center">
          <CheckedIcon stroke="#28c76f" />
          <span className="all-plans__plan__descriptions__info">
            {plan.capacity.project} projects
          </span>
        </Flex>
        <Flex className="all-plans__plan__descriptions" alignItems="center">
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
    </Box>
  );
};

export default PartPlan;
