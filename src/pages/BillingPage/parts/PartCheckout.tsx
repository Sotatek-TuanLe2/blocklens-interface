import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CheckedIcon } from 'src/assets/icons';
import { AppButton } from 'src/components';
import AppAlertWarning from 'src/components/AppAlertWarning';
import useUser from 'src/hooks/useUser';
import useWallet from 'src/hooks/useWallet';
import rf from 'src/requests/RequestFactory';
import { MetadataPlan } from 'src/store/metadata';
import { getUserPlan } from 'src/store/user';
import { formatShortText } from 'src/utils/utils-helper';
import { toastSuccess } from 'src/utils/utils-notify';
import { paymentMethods, PAYMENT_METHOD } from '..';

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
      console.error(e);
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
