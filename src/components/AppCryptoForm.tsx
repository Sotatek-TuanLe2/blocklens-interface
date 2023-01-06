import React, { FC, useEffect, useMemo, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { isMobile } from 'react-device-detect';
import useWallet from 'src/hooks/useWallet';
import 'src/styles/components/AppCryptoForm.scss';
import AppCard from './AppCard';
import useUser from 'src/hooks/useUser';
import AppAlertWarning from './AppAlertWarning';
import AppField from './AppField';
import AppInput from './AppInput';
import AppSelect2 from './AppSelect2';
import config from 'src/config';
import { getChainConfig, getNetworkByEnv } from 'src/utils/utils-network';
import AppCurrencyInput from './AppCurrencyInput';
import { getBalanceToken } from 'src/utils/utils-token';

interface IAppCryptoForm {
  currencyAddress: string;
  chainId: string;
  amount: string;
  onChangeCurrencyAddress: (value: string) => void;
  onChangeChainId: (value: string) => void;
  onChangeAmount: (value: string) => void;
}

const EXCEPTED_NETWORKS = ['ETH', 'BSC', 'POLYGON'];

export const CHAIN_OPTIONS = Object.keys(config.chains)
  .filter((chainId) => EXCEPTED_NETWORKS.includes(chainId))
  .map((chainKey) => {
    const chain = config.chains[chainKey];
    return { label: chain.name, value: chain.id, icon: chain.icon };
  });

const AppCryptoForm: FC<IAppCryptoForm> = (props) => {
  const { wallet, isUserLinked } = useWallet();
  const { user } = useUser();
  const {
    currencyAddress,
    amount,
    onChangeCurrencyAddress,
    onChangeAmount,
    onChangeChainId,
    chainId,
  } = props;

  const AMOUNT_OPTIONS = [300, 500, 1000];

  const [balanceToken, setBalanceToken] = useState<string | number>('');

  const CURRENCY_OPTIONS = useMemo((): {
    label: string;
    value: string;
    icon: string | undefined;
    decimals: number;
  }[] => {
    if (!wallet) {
      return [];
    }
    const networkCurrencies = getNetworkByEnv(
      getChainConfig(chainId),
    ).currencies;
    return Object.keys(networkCurrencies).map((currencyKey) => {
      const currency = networkCurrencies[currencyKey];
      return {
        label: currency.name,
        value: currency.address,
        icon: currency.icon,
        decimals: currency.decimals,
      };
    });
  }, [chainId]);

  useEffect(() => {
    const getBalanceTokenCurrency = async () => {
      try {
        const balance = await getBalanceToken(
          chainId,
          currencyAddress,
          wallet?.getAddress(),
        );
        setBalanceToken(balance);
      } catch (error) {
        setBalanceToken('');
      }
    };

    getBalanceTokenCurrency().then();
  }, [currencyAddress, chainId]);

  const _renderCryptoForm = () => {
    if (!wallet || !user || !isUserLinked) {
      return null;
    }
    if (wallet.getAddress() !== user.getLinkedAddress()) {
      return (
        <AppAlertWarning>
          <Box>
            You are connecting with different address: {wallet.getAddress()}.
          </Box>
          <Box>
            Please connect with linked address: {user.getLinkedAddress()}.
          </Box>
        </AppAlertWarning>
      );
    }
    return (
      <AppCard className={'box-form-crypto'}>
        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField
            label={'Linked Wallet'}
            customWidth={'100%'}
            note="Each account has 1 linked wallet. Cryptocurrencies sent from other wallets would not be top up to your account balance.
                    You can change your linked wallet at the Account page."
          >
            <AppInput isDisabled={true} size="lg" value={wallet.getAddress()} />
          </AppField>
          <Box width={isMobile ? '100%' : '49.5%'} zIndex={99}>
            <AppField label={'Chain'} customWidth={'100%'}>
              <AppSelect2
                size="large"
                onChange={(value: string) => onChangeChainId(value)}
                options={CHAIN_OPTIONS}
                value={chainId}
              />
            </AppField>
          </Box>
          <Box width={isMobile ? '100%' : '49.5%'} zIndex={98}>
            <AppField label={'Currency'} customWidth={'100%'}>
              <AppSelect2
                size="large"
                onChange={(value: string) => onChangeCurrencyAddress(value)}
                options={CURRENCY_OPTIONS}
                value={currencyAddress}
              />
            </AppField>
          </Box>

          <Flex width={'100%'} flexDirection={isMobile ? 'column' : 'row'}>
            <AppField label={''} customWidth={'49.5%'}>
              <Flex
                justifyContent="space-between"
                className="field"
                flexDirection={isMobile ? 'column-reverse' : 'row'}
              >
                <Box className="label">Top up amount</Box>
                <Flex>
                  <Box mr={2} className="label">
                    User balance:
                  </Box>
                  <Box>{balanceToken || '--'}</Box>
                </Flex>
              </Flex>
              <AppCurrencyInput
                onChange={(e) => onChangeAmount(e.target.value.trim())}
                render={(ref, props) => (
                  <AppInput ref={ref} value={amount} {...props} />
                )}
              />
            </AppField>
            <Flex className="amount-options">
              {AMOUNT_OPTIONS.map((item: number, index: number) => {
                return (
                  <Box
                    className={`amount-option ${
                      +amount === item ? 'active' : ''
                    }`}
                    key={index}
                    onClick={() => onChangeAmount(item.toString())}
                  >
                    {item}
                  </Box>
                );
              })}
            </Flex>
          </Flex>
        </Flex>
      </AppCard>
    );
  };

  return _renderCryptoForm();
};

export default AppCryptoForm;
