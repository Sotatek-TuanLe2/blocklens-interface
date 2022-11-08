import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC, useMemo, useState } from 'react';
import { AppCard, AppLink } from 'src/components';
import { IBillingPlan } from './MyPlan';

interface IPlanItem {
  plan: IBillingPlan;
  isActive?: boolean;
  isChangePaymentMethod: boolean;
  planSelected: IBillingPlan;
  setPlanSelected: (value: IBillingPlan) => void;
  openModalChangePaymentMethod: (value: boolean) => void;
  openModalChangePlan: (value: boolean) => void;
}

const PlanItem: FC<IPlanItem> = ({
  openModalChangePaymentMethod,
  openModalChangePlan,
  isChangePaymentMethod,
  plan,
  isActive,
  planSelected,
  setPlanSelected,
}) => {
  const isSelected = useMemo(
    () => planSelected.name === plan.name,
    [planSelected],
  );

  const onChoosePlan = () => {
    if (isActive || plan.name.toUpperCase() === 'ENTERPRISE') return;
    setPlanSelected(plan);

    if (isChangePaymentMethod) {
      openModalChangePlan(true);
      return;
    }
    openModalChangePaymentMethod(true);
    return;
  };

  return (
    <>
      <AppCard
        className={`plan-item-container ${isActive ? 'active' : ''} ${
          isSelected ? 'selected' : ''
        } `}
        onClick={onChoosePlan}
      >
        <div className="status-plan">
          {isActive && (
            <>
              <div className="icon-done" />
              <Text className="active">Active </Text>
            </>
          )}

          {isSelected && !isActive && (
            <Text className="selected"> Choose New plan</Text>
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
    </>
  );
};

export default PlanItem;
