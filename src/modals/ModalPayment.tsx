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
import { AppButton, AppField, AppInput, AppSelect } from 'src/components';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import rf from 'src/requests/RequestFactory';
import { COUNTRIES } from 'src/constants';
import _ from 'lodash';

interface IModalPayment {
  open: boolean;
  isChangePaymentMethod?: boolean;
  onClose: () => void;
}

interface ICheckoutForm {
  onClose: () => void;
}

interface IDataFormBillingInfo {
  name?: string;
  country?: string;
  address?: string;
  email?: string;
}

const listCountry = COUNTRIES.map((item: { name: string }) => {
  return {
    label: item.name,
    value: item.name,
  };
});

const CheckoutForm: FC<ICheckoutForm> = ({ onClose }) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const initData = {
    name: '',
    country: '',
    address: '',
    email: userInfo.email,
  };

  const [dataForm, setDataForm] = useState<IDataFormBillingInfo>(initData);

  // Initialize an instance of stripe.
  const stripe = useStripe();
  const elements = useElements();

  const updateMyBillingInfo = async () => {
    try {
      await rf.getRequest('BillingRequest').updateBillingInfo(dataForm);
      toastSuccess({ message: 'Successfully!' });
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    setIsLoading(true);
    if (!stripe || !elements) return;
    e.preventDefault();

    const result = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
    });

    if (result.error) {
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

    updateMyBillingInfo().then();
    onClose()
  };

  return (
    <Box>
      <form onSubmit={handleSubmit as any}>
        <Box mb={3}>Payment method</Box>
        <PaymentElement />

        <Box my={3}>Billing address</Box>

        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'NAME'} customWidth={'49%'} isRequired>
            <AppInput
              value={dataForm.name}
              onChange={(e) => {
                setDataForm({
                  ...dataForm,
                  name: e.target.value,
                });
              }}
            />
          </AppField>
          <AppField label={'COUNTRY'} customWidth={'49%'}>
            <AppSelect
              onChange={(e: any) => {
                setDataForm({
                  ...dataForm,
                  country: e.value,
                });
              }}
              options={listCountry}
              value={
                listCountry.find(
                  (item) => item.value === dataForm.country,
                ) as any
              }
            />
          </AppField>
          <AppField label={'ADDRESS'} customWidth={'100%'}>
            <AppInput
              value={dataForm.address}
              onChange={(e) => {
                setDataForm({
                  ...dataForm,
                  address: e.target.value,
                });
              }}
            />
          </AppField>

          <AppField label={'BILLING EMAIL'} customWidth={'100%'}>
            <AppInput
              value={dataForm.email}
              onChange={(e) => {
                setDataForm({
                  ...dataForm,
                  email: e.target.value,
                });
              }}
            />
          </AppField>
        </Flex>

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
  const { paymentIntent } = useSelector((state: RootState) => state.billing);
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
          {!!paymentIntent && (
            <Elements
              stripe={stripePromise}
              options={{
                locale: 'en',
                clientSecret: paymentIntent.client_secret,
              }}
            >
              <CheckoutForm onClose={onClose} />
            </Elements>
          )}
        </Box>
      </Box>
    </BaseModal>
  );
};

export default ModalPayment;
