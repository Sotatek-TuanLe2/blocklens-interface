import { FC, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { paymentMethods } from '..';
import useWallet from 'src/hooks/useWallet';
import { AppButton } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { getMyPlan } from 'src/store/billing';

interface IPartCheckout {
  planSelected: string;
  paymentMethodCode: string;
}

const PartCheckout: FC<IPartCheckout> = ({ planSelected, paymentMethodCode }) => {
  const { plans } = useSelector(
    (state: RootState) => state.billing,
  );
  const { wallet } = useWallet();
  const dispatch = useDispatch();

  const _renderPaymentMethod = () => {
    const paymentMethod = paymentMethods.find(item => item.code === paymentMethodCode);
    return (
      <Box>
        <p>{paymentMethod?.name}</p>
        <p>{wallet?.getAddress()}</p>
      </Box>
    );
  };

  const _renderOrder = () => {
    const newPlan = plans.find(item => item.code === planSelected);
    return (
      <Box>
        <p>{newPlan?.name}</p>
        <p>{`$${newPlan?.price}/month`}</p>
        <p>{newPlan?.appLimitation} active apps</p>
        <p>{newPlan?.notificationLimitation} messages/day</p>
      </Box>
    );
  };

  const onPay = async () => {
    try {
      await rf
        .getRequest('BillingRequest')
        .updateBillingPlan({ code: planSelected });
      toastSuccess({ message: 'Update Successfully!' });
      dispatch(getMyPlan());
      // TODO: go to Billing history
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  return (
    <Box className="form-card">
      Billing Checkout
      <Box>
        PAYMENT METHOD
        {_renderPaymentMethod()}
      </Box>
      <Box>
        ORDER
        {_renderOrder()}
      </Box>
      <AppButton
        size="md"
        mt={7}
        onClick={onPay}
      >
        Pay
      </AppButton>
    </Box>
  );
};

export default PartCheckout;