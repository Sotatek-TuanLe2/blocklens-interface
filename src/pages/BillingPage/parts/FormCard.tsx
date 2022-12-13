import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useEffect, useMemo, useState } from 'react';
import 'src/styles/pages/AppDetail.scss';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import config from 'src/config';
import { AppButton, AppCard } from 'src/components';
import { isMobile } from 'react-device-detect';

const CheckoutForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize an instance of stripe.
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    setIsLoading(true);
    if (!stripe || !elements) return;
    e.preventDefault();

    const result = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
    });

    if (result.error) {
      toastError({
        message: result.error?.message || 'Oops. Something went wrong!',
      });
      setIsLoading(false);
      return;
    }

    switch (result.setupIntent.status) {
      case 'succeeded': {
        try {
          await rf.getRequest('BillingRequest').attachPaymentMethod({
            paymentMethodId: result.setupIntent.payment_method as string,
          });
          toastSuccess({ message: 'Successfully!' });
        } catch (e: any) {
          toastError({ message: e?.message || 'Oops. Something went wrong!' });
        } finally {
        }
        break;
      }

      case 'processing': {
        break;
      }

      case 'requires_payment_method': {
        break;
      }
      default:
        setIsLoading(false);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit as any}>
        <AppCard>
          <PaymentElement />
        </AppCard>
        <Flex
          justifyContent={isMobile ? 'center' : 'flex-end'}
          alignItems="center"
          mt={7}
        >
          <AppButton isLoading={isLoading} type="submit" size="md">
            Submit
          </AppButton>
        </Flex>
      </form>
    </Box>
  );
};

interface IFormAddCard {
  onBack: () => void;
}

const FormCard: FC<IFormAddCard> = ({ onBack }) => {
  const [paymentIntent, setPaymentIntent] = useState<any>({});

  const getPaymentIntent = async () => {
    try {
      const res = await rf.getRequest('BillingRequest').getPaymentIntent();
      setPaymentIntent(res);
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  useEffect(() => {
    getPaymentIntent().then();
  }, []);

  const stripePromise = useMemo(
    () => loadStripe(config.stripe.publishableKey),
    [],
  );

  return (
    <Box className="form-card">
      <Flex alignItems={'center'} mb={7}>
        <Box className="icon-arrow-left" mr={6} onClick={onBack} />
        <Box className={'sub-title'}>Card</Box>
      </Flex>

      {!!Object.keys(paymentIntent).length && (
        <Elements
          stripe={stripePromise}
          options={{
            locale: 'en',
            clientSecret: paymentIntent.client_secret,
          }}
        >
          <CheckoutForm />
        </Elements>
      )}
    </Box>
  );
};

export default FormCard;
