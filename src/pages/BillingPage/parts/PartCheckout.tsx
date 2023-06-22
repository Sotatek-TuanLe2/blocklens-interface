import { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { PAYMENT_METHOD, paymentMethods } from '..';
import useWallet from 'src/hooks/useWallet';
import { AppButton } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import AppAlertWarning from 'src/components/AppAlertWarning';
import { formatShortText } from 'src/utils/utils-helper';
import { CheckedIcon } from 'src/assets/icons';
import { useHistory } from 'react-router-dom';
import useUser from 'src/hooks/useUser';
import { MetadataPlan } from 'src/store/metadata';
import { getUserPlan } from 'src/store/user';

interface IPartCheckout {
  planSelected: MetadataPlan;
  paymentMethodCode: any;
  onBack: () => void;
}

const PartCheckout: FC<IPartCheckout> = ({
  planSelected,
  paymentMethodCode,
  onBack,
}) => {
  const { wallet } = useWallet();
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useUser();

  const paymentMethod = paymentMethods.find(
    (item) => item.code === paymentMethodCode,
  );

  const _renderOrder = () => {
    return (
      <Box className="billing-checkout__order">
        <Box className="title">Order</Box>
        <Flex className="name-plan">
          <Box textTransform="capitalize" mr={1}>
            {planSelected.name.toLowerCase()}
          </Box>{' '}
          monthly plan
        </Flex>
        <Box className="name-plan">{`$${planSelected.price}/month`}</Box>
        <Flex className="info">
          <CheckedIcon /> {planSelected.appLimitation} apps
        </Flex>
        <Flex className="info">
          <CheckedIcon /> {planSelected.notificationLimitation} messages/day
        </Flex>
      </Box>
    );
  };

  const onPay = async () => {
    try {
      await rf
        .getRequest('UserRequest')
        .editInfoUser({ activePaymentMethod: paymentMethod?.code });
      await rf
        .getRequest('BillingRequest')
        .updateBillingPlan({ code: planSelected.code });
      toastSuccess({ message: 'Update Successfully!' });
      dispatch(getUserPlan());
      history.push('/billing-history');
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  const _renderInfoPayment = () => {
    if (paymentMethod?.code === PAYMENT_METHOD.CARD) {
      return (
        user?.getStripePayment()?.card?.brand +
        ' - ' +
        user?.getStripePayment()?.card?.last4
      );
    }

    return formatShortText(
      wallet?.getAddress() || user?.getLinkedAddress() || '',
    );
  };

  return (
    <Box className="form-card">
      <Flex alignItems={'center'} mb={7}>
        <Box className="icon-arrow-left" mr={3.5} onClick={onBack} />
        <Box className={'sub-title'}>Billing Checkout</Box>
      </Flex>

      <Box className="billing-checkout__bill">
        <Box className="billing-checkout__bill-info">
          <Box className="billing-checkout__payment-method">
            <Box className="title">Payment method</Box>
            <Flex justifyContent={'space-between'}>
              <Box className="type">{paymentMethod?.name}</Box>
              <Box className="address">{_renderInfoPayment()}</Box>
            </Flex>
          </Box>

          {_renderOrder()}
        </Box>

        <AppAlertWarning>
          By clicking the Pay button, you agree to authorize Blocklens to charge
          you the monthly fee. Your subscription renews at 1st day of every
          month until you cancel.
        </AppAlertWarning>

        <AppButton size="lg" onClick={onPay} width={'100%'} mt={3}>
          Pay
        </AppButton>
      </Box>
    </Box>
  );
};

export default PartCheckout;
