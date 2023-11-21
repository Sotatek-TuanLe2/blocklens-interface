import { AddIcon } from '@chakra-ui/icons';
import { MaxUint256 } from '@ethersproject/constants';
import { Box, Divider, Flex, RadioGroup, Stack, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import retry from 'async-retry';
import abi from 'src/abi';
import { AppButton, AppRadio, AppSelect2 } from 'src/components';
import AppAlertWarning from 'src/components/AppAlertWarning';
import config from 'src/config';
import useUser from 'src/hooks/useUser';
import useWallet from 'src/hooks/useWallet';
import BaseModal from 'src/modals/BaseModal';
import ModalConnectWallet from 'src/modals/ModalConnectWallet';
import rf from 'src/requests/RequestFactory';
import { MetadataPlan } from 'src/store/metadata';
import {
  executeTransaction,
  toggleFinishTransactionModal,
} from 'src/store/transaction';
import { getUserPlan } from 'src/store/user';
import { setOpenModalSignatureRequired } from 'src/store/wallet';
import { convertDecToWei, formatShortAddress } from 'src/utils/utils-format';
import { formatCapitalize } from 'src/utils/utils-helper';
import {
  getSupportChainsTopUp,
  getTopUpCurrencyOptions,
  getTopUpCurrenciesByChainId,
  getTopUpConfigByNetworkId,
  getChainConfig,
} from 'src/utils/utils-network';
import { toastError, toastSuccess, toastWarning } from 'src/utils/utils-notify';
import Storage from 'src/utils/utils-storage';
import { PAYMENT_METHOD } from '..';
import { YEARLY_SUBSCRIPTION_CODE } from 'src/utils/common';
import { isTokenApproved } from 'src/utils/utils-token';

interface IPartCheckout {
  selectedPlan: MetadataPlan;
  subscriptionPeriod: string;
  onBack: () => void;
}

const PartCheckout: FC<IPartCheckout> = ({
  selectedPlan,
  subscriptionPeriod,
  onBack,
}) => {
  const { wallet, connectWallet } = useWallet();
  const dispatch = useDispatch();
  const { user } = useUser();

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<
    typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD]
  >(PAYMENT_METHOD.CRYPTO);
  const [chainId, setChainId] = useState<string>('');
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [openConnectWalletModal, setOpenConnectWalletModal] =
    useState<boolean>(false);
  const [openConfirmingModal, setOpenConfirmingModal] =
    useState<boolean>(false);

  const userPlan = useMemo(() => user?.getPlan(), [user?.getPlan()]);
  const topUpContractAddress = useMemo(
    () => (chainId ? getTopUpConfigByNetworkId(chainId).contractAddress : ''),
    [chainId],
  );
  const chainOptions = getSupportChainsTopUp();
  const tokenOptions = useMemo(
    () => getTopUpCurrencyOptions(chainId),
    [chainId],
  );

  const isDownGrade = useMemo(
    () =>
      userPlan
        ? new BigNumber(selectedPlan.price).isLessThan(
            new BigNumber(userPlan.price),
          )
        : false,
    [userPlan, selectedPlan],
  );
  const isRenewal = useMemo(
    () =>
      userPlan
        ? new BigNumber(selectedPlan.price).isEqualTo(
            new BigNumber(userPlan.price),
          )
        : false,
    [userPlan, selectedPlan],
  );
  const isUpgrade = useMemo(
    () =>
      userPlan
        ? new BigNumber(selectedPlan.price).isGreaterThan(
            new BigNumber(userPlan.price),
          )
        : false,
    [userPlan, selectedPlan],
  );

  useEffect(() => {
    estimatePrice();
  }, [selectedPlan]);

  useEffect(() => {
    const connectorId = Storage.getConnectorId();
    const network = Storage.getNetwork();
    if (!connectorId) return;
    (async () => {
      await connectWallet(connectorId, network);
    })();
  }, [wallet?.getNework()]);

  useEffect(() => {
    if (!user || !wallet) {
      return;
    }

    const didWalletSignMessage = user
      .getLinkedAddresses()
      .some(
        (address) =>
          address.toLowerCase() === wallet.getAddress().toLowerCase(),
      );

    if (!user.isUserLinked() || !didWalletSignMessage) {
      dispatch(setOpenModalSignatureRequired(true));
    } else {
      dispatch(setOpenModalSignatureRequired(false));
    }
  }, [user?.getLinkedAddresses(), wallet?.getAddress()]);

  useEffect(() => {
    if (!!chainOptions.length) {
      setChainId(chainOptions[0].value);
    }
  }, [chainOptions]);

  useEffect(() => {
    if (!chainId) {
      return;
    }

    const currencies = getTopUpCurrenciesByChainId(chainId);
    setTokenAddress(currencies[0].address);
  }, [chainId]);

  const estimatePrice = async () => {
    if (!userPlan) {
      return;
    }

    try {
      const res =
        isDownGrade || isRenewal
          ? await rf
              .getRequest('BillingRequest')
              .estimatePriceForRenewOrDowngrade()
          : await rf
              .getRequest('BillingRequest')
              .estimatePriceForUpgrade(selectedPlan.code, subscriptionPeriod);

      setTotalAmount(res.amount);
    } catch (error) {
      console.error(error);
    }
  };

  const generatePlanAction = () => {
    if (isUpgrade) {
      return `Upgrade to ${formatCapitalize(selectedPlan.name)} plan`;
    } else if (isRenewal) {
      return `Renewal of ${formatCapitalize(selectedPlan.name)} plan`;
    } else if (isDownGrade) {
      return `Downgrade to ${formatCapitalize(selectedPlan.name)} plan`;
    }

    return '';
  };

  const onChangeTokenAddress = (value: string) => setTokenAddress(value);

  const onChangeChainId = (value: string) => setChainId(value);

  const _renderOrder = () => {
    if (!user) {
      return;
    }

    const showAmountPaid =
      user?.getNextPlan().price !== 0 && // next plan has fee
      selectedPlan.price > user?.getNextPlan().price && // selected plan is higher than next plan
      selectedPlan.price > totalAmount; // user did purchase next plan

    const period = `period ${moment().format('YYYY/MM/DD')}-${
      subscriptionPeriod === YEARLY_SUBSCRIPTION_CODE
        ? moment().add(1, 'year').subtract(1, 'day').format('YYYY/MM/DD')
        : moment().add(29, 'day').format('YYYY/MM/DD')
    }`;

    return (
      <Box className="billing-checkout__order">
        <Box className="title">Order</Box>
        <Flex className="name-plan" alignItems="flex-end" px={10}>
          <Text textTransform="capitalize" mr={2}>
            {selectedPlan.name.toLowerCase()} plan
          </Text>
          <Text className="period">{period}</Text>
        </Flex>
        <Flex
          alignItems="flex-end"
          justifyContent="space-between"
          mb="10px"
          px={10}
        >
          <Text className="plan-action">{generatePlanAction()}</Text>
          <Text>{selectedPlan.price}$</Text>
        </Flex>
        {showAmountPaid && (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            mb="10px"
            px={10}
          >
            <Text className="plan-action">
              Amount paid
              <br />
              (For {formatCapitalize(user?.getNextPlan().name)} plan - no longer
              use)
            </Text>
            <Text>{selectedPlan.price}$</Text>
          </Flex>
        )}
        <Flex alignItems="flex-end" justifyContent="space-between" px={10}>
          <Text>
            <b>Total amount</b>
          </Text>
          <Text>
            <b>{!!totalAmount ? totalAmount : '--'}$</b>
          </Text>
        </Flex>
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
                {!!wallet ? (
                  <Flex className="connect-wallet-btn">
                    <img
                      src={config.connectors[wallet.getConnectorId()].icon}
                      alt="wallet-icon"
                      width="16px"
                    />
                    <Text ml={2}>
                      {formatShortAddress(wallet.getAddress())}
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
            {!!wallet && (
              <Flex
                justifyContent="space-between"
                alignItems="center"
                className="billing-checkout__payment__selects"
              >
                <Flex alignItems="center">
                  <Text
                    mr={3}
                    className="billing-checkout__payment__selects__field-text"
                  >
                    Pay by
                  </Text>
                  <AppSelect2
                    size="medium"
                    onChange={onChangeTokenAddress}
                    options={tokenOptions}
                    value={tokenAddress}
                  />
                </Flex>
                <Flex alignItems="center">
                  <Text
                    mr={3}
                    className="billing-checkout__payment__selects__field-text"
                  >
                    Chain
                  </Text>
                  <AppSelect2
                    size="medium"
                    onChange={onChangeChainId}
                    options={chainOptions}
                    value={chainId}
                  />
                </Flex>
              </Flex>
            )}
            <AppRadio value={PAYMENT_METHOD.CARD} isDisabled>
              Credit Card <i>(Coming soon)</i>
            </AppRadio>
          </Stack>
        </RadioGroup>
      </Box>
    );
  };

  const checkTokenApproved = async (): Promise<boolean> => {
    if (!wallet) {
      return false;
    }

    const result = await isTokenApproved(
      chainId,
      tokenAddress,
      wallet.getAddress(),
      topUpContractAddress,
    );

    return result;
  };

  const approveToken = async (isTokenApproved: boolean): Promise<void> => {
    if (isTokenApproved) {
      return;
    }

    toastWarning({ message: 'You need to approve token before purchasing' });

    await dispatch(
      executeTransaction({
        provider: wallet?.getProvider(),
        params: {
          contractAddress: tokenAddress,
          abi: abi['erc20'],
          action: 'approve',
          transactionArgs: [topUpContractAddress, MaxUint256.toString()],
        },
      }),
    );
  };

  const purchasePlan = async (): Promise<string> => {
    const decimal = tokenOptions.find(
      (option) => option.value === tokenAddress,
    )?.decimals;

    const transactionPayload: any = await dispatch(
      executeTransaction({
        provider: wallet?.getProvider(),
        params: {
          contractAddress: topUpContractAddress,
          abi: abi['topup'],
          action: 'topup',
          transactionArgs: [
            config.topUp.appId,
            tokenAddress,
            convertDecToWei(totalAmount.toString(), decimal),
          ],
        },
        confirmation: config.topUp.confirmations,
      }),
    );

    if (!transactionPayload || !transactionPayload.payload) {
      throw new Error(
        transactionPayload.error.message || 'Creating transaction failed',
      );
    }

    return transactionPayload.payload.hash;
  };

  const confirmTransaction = async (txn: string) => {
    dispatch(toggleFinishTransactionModal(false));
    setOpenConfirmingModal(true);
    await retry(
      async (bail) => {
        if (!wallet) {
          // don't retry if wallet is not connected
          bail(new Error('Wallet is not connected!'));
          return;
        }

        const network = wallet.getNework();
        const chain = getChainConfig(network).id;

        try {
          const response = await rf
            .getRequest('BillingRequest')
            .checkPaymentTransaction(txn, network, chain);

          if (response === 'PROCESSING') {
            throw new Error('Transaction is being proceeded');
          }

          setOpenConfirmingModal(false);
        } catch (error) {
          throw new Error('Transaction failed to confirm');
        }
      },
      {
        retries: 60,
        minTimeout: 100,
        maxTimeout: 5000,
      },
    );
  };

  const updateSubscription = async () => {
    if (!isUpgrade) {
      return;
    }

    return rf
      .getRequest('BillingRequest')
      .upgradeSubscription(selectedPlan.code, subscriptionPeriod);
  };

  const onPay = async () => {
    if (!wallet) {
      return;
    }

    try {
      const isTokenApproved = await checkTokenApproved();
      await approveToken(isTokenApproved);
      const txn = await purchasePlan();
      await confirmTransaction(txn);
      await updateSubscription();

      toastSuccess({
        message:
          'Payment complete. Invoice & receipt have been sent to your email.',
      });
      dispatch(getUserPlan());
      onBack();
    } catch (error) {
      setOpenConfirmingModal(false);
      console.error(error);
      toastError({
        message: (
          <>
            Pay request failed. Please try again.{' '}
            <a
              href="https://discord.com/invite/ctnBrdhqad"
              target="_blank"
              style={{
                textDecoration: 'underline',
                fontWeight: 'bold',
              }}
            >
              Contact us
            </a>{' '}
            for help
          </>
        ),
      });
    }
  };

  return (
    <Box className="form-card">
      <Flex alignItems={'center'} mb={7}>
        <Box className="icon-arrow-left" mr={3.5} onClick={onBack} />
        <Box className={'sub-title'}>Billing Checkout</Box>
      </Flex>
      <Box className="billing-checkout__bill">
        <Box className="billing-checkout__bill-info">
          {_renderOrder()}
          <Divider w="330px" mx="auto" borderStyle="dashed" />
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
          isDisabled={!wallet || !totalAmount}
        >
          Pay
        </AppButton>
      </Box>
      <ModalConnectWallet
        open={openConnectWalletModal}
        onClose={() => setOpenConnectWalletModal(false)}
      />
      <ConfirmingTransactionModal
        isOpen={openConfirmingModal}
        onClose={() => setOpenConfirmingModal(false)}
      />
    </Box>
  );
};

export default PartCheckout;

interface ConfirmingTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmingTransactionModal: FC<ConfirmingTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <BaseModal
      size="2xl"
      title="Your payment is being confirmed"
      isOpen={isOpen}
      isHideCloseIcon
      onClose={onClose}
    >
      <Box textAlign={'center'}>Wait a second...</Box>
    </BaseModal>
  );
};
