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
import { useDispatch } from 'react-redux';
import { getUserProfile } from 'src/store/user';
import { getErrorMessage } from '../../../utils/utils-helper';

interface ICheckoutForm {
  onClose?: () => void;
  onSuccess?: () => void;
  isEdit?: boolean;
}

const CheckoutForm: FC<ICheckoutForm> = ({ onClose, onSuccess, isEdit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<any>();

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
          onClose && onClose();
          onSuccess && (await onSuccess());
          dispatch(getUserProfile());
        } catch (e) {
          toastError({ message: getErrorMessage(e) });
        } finally {
          setIsLoading(false);
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

  if (isEdit) {
    return (
      <Box>
        <form onSubmit={handleSubmit as any} className={'stripe-form'}>
          <PaymentElement />
          <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={4}>
            <AppButton
              width={'49%'}
              size={'lg'}
              variant={'cancel'}
              onClick={onClose}
            >
              Cancel
            </AppButton>
            <AppButton
              width={'49%'}
              size={'lg'}
              isLoading={isLoading}
              type="submit"
            >
              Submit
            </AppButton>
          </Flex>
        </form>
      </Box>
    );
  }

  return (
    <Box>
      <form onSubmit={handleSubmit as any}>
        <AppCard>
          <PaymentElement />
        </AppCard>
        <Flex justifyContent={isMobile ? 'center' : 'flex-end'} mt={4}>
          <AppButton size={'lg'} isLoading={isLoading} type="submit">
            Continue
          </AppButton>
        </Flex>
      </form>
    </Box>
  );
};

interface IFormCard {
  isEdit?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

const FormCard: FC<IFormCard> = ({ isEdit, onClose, onSuccess }) => {
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
    <Box>
      {!!Object.keys(paymentIntent).length && (
        <Elements
          stripe={stripePromise}
          options={{
            locale: 'en',
            clientSecret: paymentIntent.client_secret,
            appearance: {
              rules: {
                '.Label': {
                  marginBottom: '5px',
                  fontSize: '16px',
                },
                '.Input': {
                  border: '1px solid #69758C',
                  boxShadow: 'none',
                  color: '#ffffff',
                },
                '.Input:focus': {
                  borderColor: '#226CFF',
                  boxShadow: 'none',
                },
                '.TermsText': {
                  display: 'none !important',
                },
              },
              theme: 'night',
              variables: {
                colorText: '#B4B7BD',
                fontSizeBase: '16px',
                colorTextPlaceholder: '#69758C',
                colorBackground: '#101530',
              },
            },
          }}
        >
          <CheckoutForm
            onClose={onClose}
            isEdit={isEdit}
            onSuccess={onSuccess}
          />
        </Elements>
      )}
    </Box>
  );
};

export default FormCard;
