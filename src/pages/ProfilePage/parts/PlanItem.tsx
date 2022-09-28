import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC, useMemo, useState } from 'react';
import { AppCard, AppLink } from 'src/components';
import { IPlan } from './MyPlan';
import ModalPayment from 'src/modals/ModalPayment';
import ModalChangePaymentMethod from '../../../modals/ModalChangePaymentMethod';

interface IPlanItem {
  plan: IPlan;
  isActive?: boolean;
  isChange?: boolean;
  isSelect: string;
  setIsSelect: (value: string) => void;
}

const PlanItem: FC<IPlanItem> = ({ isChange,  plan, isActive, isSelect, setIsSelect }) => {
  const isSelected = useMemo(() => isSelect === plan.name, [isSelect]);
  const [isOpenModalPayment, setIsOpenModalPayment] = useState<boolean>(false);
  const [isOpenModalChangePaymentMethod, setIsOpenModalChangePaymentMethod] = useState<boolean>(false);

  return (
    <>
      <AppCard
        className={`plan-item-container ${isActive ? 'active' : ''} ${
          isSelected ? 'selected' : ''
        } `}
        onClick={() => {
          setIsSelect(plan.name);
          if(isChange) {
            setIsOpenModalChangePaymentMethod(true);
            return;
          }
          if (plan.name === 'Starter' || plan.name === 'Growth') {
            setIsOpenModalPayment(true);
          }
        }}
      >
        <div className="status-plan">
          {isActive && (
            <>
              <div className="icon-done"></div>
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
            {plan.price ? (
              <>
                <Flex className="price-plan">
                  <Text className="currency">$</Text>
                  {plan.price}
                  {+plan.price > 0 && <Text className="currency">/mo</Text>}
                </Flex>
              </>
            ) : (
              <AppLink to={'/#'} className="link-contact">
                Contact us
              </AppLink>
            )}
          </Box>
          <div>
            <span className="allow-title">Features:</span>
            <br />
            <Text pl={'20px'} className="allow-list">
              {plan.features.app} Apps
            </Text>
            <Text pl={'20px'} className="allow-list">
              {plan.features.message} messages
            </Text>
          </div>
        </Box>
      </AppCard>

      <ModalPayment
        open={isOpenModalPayment}
        onClose={() => setIsOpenModalPayment(false)}
      />

      <ModalChangePaymentMethod
        open={isOpenModalChangePaymentMethod}
        onClose={() => setIsOpenModalChangePaymentMethod(false)}
      />
    </>
  );
};

export default PlanItem;
