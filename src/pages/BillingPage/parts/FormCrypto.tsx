import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
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
  const [chainSelected, setChainSelected] = useState<any>(CHAINS[0]);
  const [currencySelected, setCurrencySelected] = useState<any>(
    CHAINS[0].currencies[0],
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
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
                  onChange={(e) => {
                    setDataForm({
                      ...dataForm,
                      wallet: e.target.value.trim(),
                    });
                  }}
                />
              </Box>

              <Box width={isMobile ? '100%' : '165px'} mt={isMobile ? 4 : 0}>
                <AppButton width={'100%'} size="lg">
                  Connect Wallet
                </AppButton>
              </Box>
            </Flex>
          </AppField>

          {isConnected && (
            <Flex
              flexWrap={'wrap'}
              justifyContent={'space-between'}
              alignItems={'flex-end'}
            >
              <Box width={isMobile ? '100%' : '49.5%'} zIndex={99}>
                <AppField label={'Chain'} customWidth={'100%'}>
                  <AppSelect2
                    size="large"
                    onChange={(value: string) => {
                      setChainSelected(
                        CHAINS.find((chain) => chain.value === value),
                      );
                      setCurrencySelected(
                        CHAINS.find((chain) => chain.value === value)
                          ?.currencies[0],
                      );
                    }}
                    options={CHAINS}
                    value={chainSelected.value}
                  />
                </AppField>
              </Box>
              <Box width={isMobile ? '100%' : '49.5%'}>
                <AppField label={'Currency'} customWidth={'100%'}>
                  <AppSelect2
                    size="large"
                    onChange={(value: string) => {
                      setCurrencySelected(
                        chainSelected.currencies.find(
                          (currency: any) => currency.value === value,
                        ),
                      );
                    }}
                    options={chainSelected.currencies}
                    value={currencySelected.value}
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

      {isConnected && (
        <Flex justifyContent={isMobile ? 'center' : 'flex-end'} mt={7}>
          <AppButton size={'lg'}>Transfer</AppButton>
        </Flex>
      )}
    </Box>
  );
};

export default FormCrypto;
