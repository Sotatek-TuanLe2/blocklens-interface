import React, { useState } from 'react';
import 'src/styles/pages/BillingPage.scss';
import { BasePage } from 'src/layouts';
import PartCheckout from './parts/PartCheckout';
import { MetadataPlan } from 'src/store/metadata';
import { YEARLY_SUBSCRIPTION_CODE } from 'src/utils/common';
import PartBilling from './parts/PartBilling';

export const PAYMENT_METHOD = {
  CARD: 'STRIPE',
  CRYPTO: 'BLOCKLENS',
};

enum STEPS {
  BILLING,
  FORM,
  TOPUP,
  CHECKOUT,
}

const BillingPage = () => {
  const [step, setStep] = useState<number>(STEPS.BILLING);
  const [selectedPlan, setSelectedPlan] = useState<MetadataPlan>({} as any);
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<string>('');

  const onCheckout = (plan: MetadataPlan, isYearly: boolean) => {
    setSelectedPlan(plan);
    setSubscriptionPeriod(isYearly ? YEARLY_SUBSCRIPTION_CODE : '');
    setStep(STEPS.CHECKOUT);
  };

  const _renderContent = () => {
    switch (step) {
      case STEPS.BILLING:
        return <PartBilling onCheckout={onCheckout} />;
      case STEPS.CHECKOUT:
        return (
          <PartCheckout
            selectedPlan={selectedPlan}
            subscriptionPeriod={subscriptionPeriod}
            onBack={() => setStep(STEPS.BILLING)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <BasePage className="billing-page">
      <>{_renderContent()}</>
    </BasePage>
  );
};

export default BillingPage;
