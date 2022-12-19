import { Box, Flex } from '@chakra-ui/react';
import { FC, useEffect, useMemo, useState } from 'react';
import 'src/styles/pages/AppDetail.scss';
import {
  AppButton,
  AppCard,
  AppField,
  AppInput,
  AppSelect2,
} from 'src/components';
import { isMobile } from 'react-device-detect';
import { IChain } from 'src/modals/ModalCreateApp';
import config from 'src/config';
import AppConnectWalletButton from 'src/components/AppConnectWalletButton';
import useWallet from 'src/hooks/useWallet';

interface IFormCrypto {
  onBack: () => void;
}

interface IDataForm {
  wallet: string;
  chain: string;
  currency: string;
  amount: string;
}

export const CHAINS = config.chains.map((chain: IChain) => {
  const currenciesClone = chain.currencies.map(
    (currency: { name: string; id: string; icon: string }) => {
      return { label: currency.name, value: currency.id, icon: currency.icon };
    },
  );

  return {
    label: chain.name,
    value: chain.id,
    icon: chain.icon,
    currencies: [...currenciesClone],
  };
});

const FormCrypto: FC<IFormCrypto> = ({ onBack }) => {
  const initData = {
    wallet: '',
    chain: '',
    currency: '',
    amount: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initData);
  const { wallet, changeNetwork } = useWallet();

  useEffect(() => {
    if (wallet?.getAddress()) {
      const networkCurrencies = config.networks[wallet.getNework()].currencies;
      const defaultCurrency = networkCurrencies[Object.keys(networkCurrencies)[0]];
      setDataForm(prevState => ({
        ...prevState,
        wallet: wallet.getAddress(),
        chain: wallet.getNework(),
        currency: defaultCurrency.name
      }));
    }
  }, [wallet?.getAddress(), wallet?.getNework()]);

  const CHAIN_OPTIONS = useMemo(() => {
    if (!wallet) {
      return [];
    }
    return Object.keys(config.networks).map((networkKey) => {
      const network = config.networks[networkKey];
      return { label: network.name, value: network.id, icon: network.icon };
    });
  }, [wallet?.getNework()]);

  const CURRENCY_OPTIONS = useMemo(() => {
    if (!wallet) {
      return [];
    }
    const networkCurrencies = config.networks[wallet.getNework()].currencies;
    return Object.keys(networkCurrencies).map(currencyKey => {
      const currency = networkCurrencies[currencyKey];
      return { label: currency.name, value: currency.name, icon: currency.icon };
    });
  }, [wallet?.getNework()]);

  const onChangeCurrency = (currency: string) => {
    setDataForm(prevState => ({ ...prevState, currency }));
  };

  return (
    <Box className="form-card">
      <Flex alignItems={'center'} mb={7}>
        <Box className="icon-arrow-left" mr={6} onClick={onBack} />
        <Box className={'sub-title'}>Crypto</Box>
      </Flex>

      <AppCard className={'box-form-crypto'}>
        <Flex
          flexWrap={'wrap'}
          justifyContent={'space-between'}
          alignItems={'flex-end'}
        >
          <AppField label={'Linked Wallet'} customWidth={'100%'}>
            <Flex
              flexWrap={'wrap'}
              justifyContent={'space-between'}
              flexDirection={isMobile ? 'column' : 'row'}
            >
              <Box width={isMobile ? '100%' : 'calc(100% - 175px)'}>
                <AppInput
                  isDisabled={true}
                  size="lg"
                  value={dataForm.wallet}
                />
              </Box>

              <Box width={isMobile ? '100%' : '165px'} mt={isMobile ? 4 : 0}>
                <AppConnectWalletButton
                  width={'100%'}
                  size="lg"
                >
                  Connect Wallet
                </AppConnectWalletButton>
              </Box>
            </Flex>
          </AppField>

          {wallet && (
            <Flex
              flexWrap={'wrap'}
              justifyContent={'space-between'}
              alignItems={'flex-end'}
            >
              <Box width={isMobile ? '100%' : '49.5%'} zIndex={99}>
                <AppField label={'Chain'} customWidth={'100%'}>
                  <AppSelect2
                    size="large"
                    onChange={(value: string) => changeNetwork(value)}
                    options={CHAIN_OPTIONS}
                    value={dataForm.chain}
                  />
                </AppField>
              </Box>
              <Box width={isMobile ? '100%' : '49.5%'}>
                <AppField label={'Currency'} customWidth={'100%'}>
                  <AppSelect2
                    size="large"
                    onChange={(value: string) => onChangeCurrency(value)}
                    options={CURRENCY_OPTIONS}
                    value={dataForm.currency}
                  />
                </AppField>
              </Box>
              <AppField label={'Amount'} customWidth={'49%'}>
                <AppInput
                  size="lg"
                  placeholder="0"
                  value={dataForm.amount}
                  onChange={(e) => {
                    setDataForm({
                      ...dataForm,
                      amount: e.target.value.trim(),
                    });
                  }}
                />
              </AppField>
            </Flex>
          )}
        </Flex>
      </AppCard>

      {wallet && (
        <Flex justifyContent={isMobile ? 'center' : 'flex-end'} mt={7}>
          <AppButton size={'lg'}>Top Up</AppButton>
        </Flex>
      )}
    </Box>
  );
};

export default FormCrypto;
