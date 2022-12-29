import React, { FC, useMemo, useRef } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
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
import { createValidator } from '../utils/utils-validator';

interface IAppCryptoForm {
  currencyAddress: string;
  amount: string;
  onChangeCurrencyAddress: (value: string) => void;
  onChangeAmount: (value: string) => void;
}

const AppCryptoForm: FC<IAppCryptoForm> = (props) => {
  const { wallet, isUserLinked, changeNetwork } = useWallet();
  const { user } = useUser();
  const { currencyAddress, amount, onChangeCurrencyAddress, onChangeAmount } =
    props;
  const validators = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="text-error">{message}</Text>
      ),
    }),
  );

  const AMOUNT_OPTIONS = [300, 500, 1000];

  const CHAIN_OPTIONS = useMemo((): {
    label: string;
    value: string;
    icon: string | undefined;
  }[] => {
    if (!wallet) {
      return [];
    }
    return Object.keys(config.chains).map((chainKey) => {
      const chain = config.chains[chainKey];
      return { label: chain.name, value: chain.id, icon: chain.icon };
    });
  }, [wallet?.getNework()]);

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
      getChainConfig(wallet.getNework()),
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
  }, [wallet?.getNework()]);

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
                onChange={(value: string) => changeNetwork(value)}
                options={CHAIN_OPTIONS}
                value={wallet.getNework()}
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
          <AppField label={'Amount'} customWidth={'49.5%'}>
            <AppInput
              size="lg"
              placeholder="0"
              min={'0'}
              type={'number'}
              value={amount}
              onKeyDown={(e) =>
                ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
              }
              onChange={(e) => {
                onChangeAmount(e.target.value.trim());
              }}
              validate={{
                name: `amount`,
                validator: validators.current,
                rule: ['isPositive'],
              }}
              endAdornment={
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
              }
            />
          </AppField>
        </Flex>
      </AppCard>
    );
  };

  return _renderCryptoForm();
};

export default AppCryptoForm;
