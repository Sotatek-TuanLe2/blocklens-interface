import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { AppButton } from 'src/components';
import useUser from 'src/hooks/useUser';
import { PAYMENT_METHOD } from 'src/pages/BillingPage';
import rf from 'src/requests/RequestFactory';
import { getUserProfile } from 'src/store/user';
import { formatShortText, getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import FormCard from '../pages/BillingPage/parts/FormCard';
import BaseModal from './BaseModal';

interface IModalChangePaymentMethod {
  open: boolean;
  onClose: () => void;
  paymentMethodSelected: any;
}

const ModalChangePaymentMethod: FC<IModalChangePaymentMethod> = ({
  open,
  onClose,
  paymentMethodSelected,
}) => {
  const { user } = useUser();
  const dispatch = useDispatch();

  const onChange = async () => {
    try {
      await rf
        .getRequest('UserRequest')
        .editInfoUser({ activePaymentMethod: paymentMethodSelected });
      toastSuccess({ message: 'Update Successfully!' });
      await dispatch(getUserProfile());
      onClose();
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const getDescription = () => {
    if (paymentMethodSelected === PAYMENT_METHOD.CRYPTO) {
      return 'Change payment method to crypto?';
    }

    if (!user?.getStripePayment()) {
      return (
        'Change payment method to card?' + '\n' + 'Please enter your card info'
      );
    }

    return 'Change payment method to card?';
  };

  const _renderContent = () => {
    if (paymentMethodSelected === PAYMENT_METHOD.CRYPTO) {
      return (
        <>
          <Flex className="info-payment">
            <Box className="label">Total</Box>
            <Box className="value">${user?.getBalance()}</Box>
          </Flex>
          <Flex className="info-payment">
            <Box className="label">Linked Address</Box>
            <Box className="value">
              {formatShortText(user?.getLinkedAddresses()[0] || '')}
            </Box>
          </Flex>
        </>
      );
    }

    if (!user?.getStripePayment()) {
      return <FormCard isEdit onClose={onClose} onSuccess={onChange} />;
    }

    return (
      <Flex className="info-payment">
        <Box className="label">{user?.getStripePayment()?.card?.brand}</Box>
        <Box className="value">-{user?.getStripePayment()?.card?.last4}</Box>
      </Flex>
    );
  };

  return (
    <BaseModal
      size="xl"
      title={'Change Payment Method'}
      description={getDescription()}
      isOpen={open}
      onClose={onClose}
    >
      <Box>{_renderContent()}</Box>

      {(paymentMethodSelected === PAYMENT_METHOD.CRYPTO ||
        user?.getStripePayment()) && (
        <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={4}>
          <AppButton
            width={'49%'}
            size={'lg'}
            variant={'cancel'}
            onClick={onClose}
          >
            Cancel
          </AppButton>
          <AppButton width={'49%'} size={'lg'} onClick={onChange}>
            Confirm
          </AppButton>
        </Flex>
      )}
    </BaseModal>
  );
};

export default ModalChangePaymentMethod;
