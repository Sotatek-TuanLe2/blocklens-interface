import React, { FC, useEffect, useMemo, useState } from 'react';
import BaseModal from './BaseModal';
import { Box, Flex } from '@chakra-ui/react';
import { loadStripe } from '@stripe/stripe-js';
import config from 'src/config';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { AppButton } from 'src/components';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import rf from 'src/requests/RequestFactory';

interface IModalPayment {
  open: boolean;
  onClose: () => void;
  reloadData: () => void;
  paymentIntent: any;
}

interface ICheckoutForm {
  onClose: () => void;
  reloadData: () => void;
}

const CheckoutForm: FC<ICheckoutForm> = ({ onClose, reloadData }) => {
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
          reloadData();
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
    onClose();
  };

  return (
    <Box>
      <form onSubmit={handleSubmit as any}>
        <PaymentElement />
        <Flex justifyContent={'flex-end'} alignItems="center" mt={2}>
          <AppButton onClick={onClose} variant="outline" mr={5}>
            Cancel
          </AppButton>
          <AppButton isLoading={isLoading} type="submit">
            Submit
          </AppButton>
        </Flex>
      </form>
    </Box>
  );
};

const ModalPayment: FC<IModalPayment> = ({
  open,
  onClose,
  reloadData,
  paymentIntent,
}) => {
  const stripePromise = useMemo(
    () => loadStripe(config.stripe.publishableKey),
    [],
  );

  return (
    <BaseModal
      size="2xl"
      title="Payment Method"
      isOpen={open}
      onClose={onClose}
    >
      <Box flexDirection={'column'} pt={'20px'}>
        <Box className="stripe-details">
          {!!Object.keys(paymentIntent).length && (
            <Elements
              stripe={stripePromise}
              options={{
                locale: 'en',
                clientSecret: paymentIntent.client_secret,
              }}
            >
              <CheckoutForm onClose={onClose} reloadData={reloadData} />
            </Elements>
          )}
        </Box>
      </Box>
    </BaseModal>
  );
};

export default ModalPayment;
