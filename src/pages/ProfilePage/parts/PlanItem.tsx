import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC, useMemo, useState } from 'react';
import { AppCard, AppLink } from 'src/components';
import { IBillingPlan } from './MyPlan';
import ModalPayment from 'src/modals/ModalPayment';
import ModalChangePlan from 'src/modals/ModalChangePlan';

interface IPlanItem {
  plan: IBillingPlan;
  isActive?: boolean;
  isChange?: boolean;
  isSelect: string;
  setIsSelect?: (value: string) => void;
}

const PlanItem: FC<IPlanItem> = ({
  isChange,
  plan,
  isActive,
  isSelect,
  setIsSelect,
}) => {
  const isSelected = useMemo(() => isSelect === plan.name, [isSelect]);
  const [isOpenModalPayment, setIsOpenModalPayment] = useState<boolean>(false);
  useState<boolean>(false);
  const [isOpenModalChangePlan, setIsOpenModalChangePlan] =
    useState<boolean>(false);
  useState<boolean>(false);

  return (
    <>
      <AppCard
        className={`plan-item-container ${isActive ? 'active' : ''} ${
          isSelected ? 'selected' : ''
        } `}
        onClick={() => {
          setIsSelect && setIsSelect(plan.name);
          if (
            plan.name.toUpperCase() === 'STARTER' ||
            plan.name.toUpperCase() === 'GROWTH'
          ) {
            if (isChange) {
              setIsOpenModalChangePlan(true);
              return;
            }

            setIsOpenModalPayment(true);
            return;
          }
        }}
      >
        <div className="status-plan">
          {isActive && (
            <>
              <div className="icon-done" />
              <Text className="active">Active </Text>
            </>
          )}

          {isSelected && !isActive && (
            <Text className="selected"> Selecting</Text>
          )}
        </div>

        <Box className="plan-item">
          <Box className="plan-item-desc">
            <Text textTransform="uppercase">{plan.name}</Text>
            {plan.price !== null ? (
              <>
                <Flex className="price-plan">
                  <Text className="currency">$</Text>
                  {plan.price}
                  {+plan.price > 0 && <Text className="time">/mo</Text>}
                </Flex>
              </>
            ) : (
              <AppLink to={'/#'} className="link-contact">
                Contact us
              </AppLink>
            )}
          </Box>
          <div>
            <Box className="allow-title">{plan.description}</Box>
          </div>
        </Box>
      </AppCard>

      <ModalPayment
        open={isOpenModalPayment}
        onClose={() => setIsOpenModalPayment(false)}
      />

      <ModalChangePlan
        isUpgrade
        open={isOpenModalChangePlan}
        onClose={() => setIsOpenModalChangePlan(false)}
        plan={plan}
      />
    </>
  );
};

export default PlanItem;
