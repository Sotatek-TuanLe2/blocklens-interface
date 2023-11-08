import { AddIcon } from '@chakra-ui/icons';
import { Box, Divider, Flex, RadioGroup, Stack, Text } from '@chakra-ui/react';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AppButton, AppRadio } from 'src/components';
import AppAlertWarning from 'src/components/AppAlertWarning';
import config from 'src/config';
import useUser from 'src/hooks/useUser';
import useWallet from 'src/hooks/useWallet';
import ModalConnectWallet from 'src/modals/ModalConnectWallet';
import rf from 'src/requests/RequestFactory';
import { MetadataPlan } from 'src/store/metadata';
import { getUserPlan } from 'src/store/user';
import { ROUTES } from 'src/utils/common';
import { formatShortAddress } from 'src/utils/utils-format';
import { formatCapitalize, formatShortText } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import Storage from 'src/utils/utils-storage';
import { PAYMENT_METHOD } from '..';

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
  const { wallet, connectWallet } = useWallet();
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useUser();

  const [paymentMethod, setPaymentMethod] = useState<
    typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD]
  >(PAYMENT_METHOD.CRYPTO);
  const [openConnectWalletModal, setOpenConnectWalletModal] =
    useState<boolean>(false);

  useEffect(() => {
    const connectorId = Storage.getConnectorId();
    const network = Storage.getNetwork();
    if (!connectorId) return;
    (async () => {
      await connectWallet(connectorId, network);
    })();
  }, [wallet?.getNework()]);

  const generatePlanAction = () => {
    if (!user) {
      return '';
    }

    const userPlan = user.getPlan();

    if (planSelected.price > userPlan.price) {
      return `Upgrade to ${formatCapitalize(planSelected.name)} plan`;
    } else if (planSelected.price === userPlan.price) {
      return `Renewal of ${formatCapitalize(planSelected.name)} plan`;
    } else {
      return `Downgrade to ${formatCapitalize(planSelected.name)} plan`;
    }
  };

  const _renderOrder = () => {
    return (
      <Box className="billing-checkout__order">
        <Box className="title">Order</Box>
        <Flex className="name-plan" alignItems="flex-end" px={10}>
          <Text textTransform="capitalize" mr={2}>
            {planSelected.name.toLowerCase()} plan
          </Text>
          <Text className="period">
            {`period ${moment().format('YYYY/MM/DD')}-${moment()
              .add(30, 'day')
              .format('YYYY/MM/DD')}`}
          </Text>
        </Flex>
        <Flex
          alignItems="flex-end"
          justifyContent="space-between"
          mb="15px"
          px={10}
        >
          <Text className="plan-action">{generatePlanAction()}</Text>
          <Text>{planSelected.price}$</Text>
        </Flex>
        <Flex alignItems="flex-end" justifyContent="space-between" px={10}>
          <Text>
            <b>Total amount</b>
          </Text>
          <Text>
            <b>{planSelected.price}$</b>
          </Text>
        </Flex>
        <Divider w="330px" my="25px" mx="auto" borderStyle="dashed" />
      </Box>
    );
  };

  const _renderPaymentMethod = () => {
    return (
      <Box className="billing-checkout__payment">
        <Box className="title">Payment method</Box>
        <RadioGroup
          className="billing-checkout__payment__methods"
          value={paymentMethod}
        >
          <Stack direction="column">
            <AppRadio
              value={PAYMENT_METHOD.CRYPTO}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Flex justifyContent="space-between" alignItems="center" w="100%">
                <Text>Crypto</Text>
                {!!wallet && user?.isUserLinked() ? (
                  <Flex className="connect-wallet-btn">
                    <img
                      src={config.connectors[wallet.getConnectorId()].icon}
                      alt="wallet-icon"
                      width="16px"
                    />
                    <Text ml={2}>
                      {formatShortAddress(user.getLinkedAddresses()[0])}
                    </Text>
                  </Flex>
                ) : (
                  <AppButton
                    variant="no-effects"
                    size="md"
                    className="connect-wallet-btn"
                    onClick={() => setOpenConnectWalletModal(true)}
                  >
                    <AddIcon mr={2} /> Connect wallet
                  </AppButton>
                )}
              </Flex>
            </AppRadio>
            <AppRadio value={PAYMENT_METHOD.CARD} isDisabled>
              Credit Card <i>(Coming soon)</i>
            </AppRadio>
          </Stack>
        </RadioGroup>
      </Box>
    );
  };

  const onPay = async () => {
    try {
      await rf
        .getRequest('UserRequest')
        .editInfoUser({ activePaymentMethod: paymentMethod });
      await rf
        .getRequest('BillingRequest')
        .updateBillingPlan({ code: planSelected.code });
      toastSuccess({ message: 'Update Successfully!' });
      dispatch(getUserPlan());
      history.push(ROUTES.BILLING_HISTORY);
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  // const _renderInfoPayment = () => {
  //   if (paymentMethod?.code === PAYMENT_METHOD.CARD) {
  //     return (
  //       user?.getStripePayment()?.card?.brand +
  //       ' - ' +
  //       user?.getStripePayment()?.card?.last4
  //     );
  //   }

  //   return formatShortText(
  //     wallet?.getAddress() || user?.getLinkedAddresses()[0] || '',
  //   );
  // };

  return (
    <Box className="form-card">
      <Flex alignItems={'center'} mb={7}>
        <Box className="icon-arrow-left" mr={3.5} onClick={onBack} />
        <Box className={'sub-title'}>Billing Checkout</Box>
      </Flex>
      <Box className="billing-checkout__bill">
        <Box className="billing-checkout__bill-info">
          {/* <Box className="billing-checkout__payment-method">
            <Box className="title">Payment method</Box>
            <Flex justifyContent={'space-between'}>
              <Box className="type">{paymentMethod?.name}</Box>
              <Box className="address">{_renderInfoPayment()}</Box>
            </Flex>
          </Box> */}
          {_renderOrder()}
          {_renderPaymentMethod()}
        </Box>
        <AppAlertWarning>
          By clicking the Pay button, you agree to authorize Blocklens to charge
          you the monthly fee. Your subscription renews at 1st day of every
          month until you cancel.
        </AppAlertWarning>
        <AppButton
          size="lg"
          showSubmitting
          onClick={onPay}
          width={'100%'}
          mt={3}
        >
          Pay
        </AppButton>
      </Box>
      <ModalConnectWallet
        open={openConnectWalletModal}
        onClose={() => setOpenConnectWalletModal(false)}
      />
    </Box>
  );
};

export default PartCheckout;
