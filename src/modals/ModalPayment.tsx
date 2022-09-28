import React, { FC, useMemo, useState } from 'react';
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

interface IModalPayment {
  open: boolean;
  isChangePaymentMethod?: boolean;
  onClose: () => void;
}

const clientSecret =
  'seti_1LmuczF4Iczr6ngsBwFH2Tny_secret_MVwWeTsvxcPnzlaqZGpM2mFqlTepjv4';

interface ICheckoutForm {
  onClose: () => void;
}

const CheckoutForm: FC<ICheckoutForm> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize an instance of stripe.
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    setIsLoading(true);
    if (!stripe || !elements) return;
    e.preventDefault();

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.

    // Use card Element to tokenize payment details
    const result = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
    });

    if (result.error) {
      // do something
      return;
    }

    // Inspect the SetupIntent `status` to indicate the status of the payment
    // to your customer.
    //
    // Some payment methods will [immediately succeed or fail][0] upon
    // confirmation, while others will first enter a `processing` state.
    //
    // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
    switch (result.setupIntent.status) {
      case 'succeeded': {
        //handle success
        onClose();
        break;
      }

      case 'processing': {
        break;
      }

      case 'requires_payment_method': {
        // Redirect your user back to your payment page to attempt collecting
        // payment again

        break;
      }
      default:
        setIsLoading(false);
    }
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
  isChangePaymentMethod,
  open,
  onClose,
}) => {
  const stripePromise = useMemo(
    () => loadStripe(config.stripe.publishableKey),
    [],
  );
  return (
    <BaseModal
      size="2xl"
      title={`${isChangePaymentMethod ? 'Change Payment Method' : 'Payment'}`}
      isOpen={open}
      onClose={onClose}
    >
      <Box flexDirection={'column'} pt={'20px'}>
        <Box className="stripe-details">
          <Elements
            stripe={stripePromise}
            options={{
              locale: 'en',
              clientSecret: clientSecret,
            }}
          >
            <CheckoutForm onClose={onClose} />
          </Elements>
        </Box>
      </Box>
    </BaseModal>
  );
};

export default ModalPayment;
