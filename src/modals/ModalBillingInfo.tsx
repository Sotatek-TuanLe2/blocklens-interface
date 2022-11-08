import React, { FC, useEffect, useMemo, useState } from 'react';
import BaseModal from './BaseModal';
import { Box, Flex } from '@chakra-ui/react';
import { loadStripe } from '@stripe/stripe-js';
import config from 'src/config';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { AppButton, AppField, AppInput, AppSelect } from 'src/components';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import rf from 'src/requests/RequestFactory';
import { COUNTRIES } from 'src/constants';
import _ from 'lodash';

interface IModalBillingInfo {
  open: boolean;
  onClose: () => void;
  reloadData: () => void;
  billingInfo: any;
}

interface IDataFormBillingInfo {
  name?: string;
  country?: string;
  address?: string;
  email?: string;
}

const listCountry = COUNTRIES.map((item: { name: string }) => {
  return {
    label: item.name,
    value: item.name,
  };
});

const ModalBillingInfo: FC<IModalBillingInfo> = ({
  open,
  onClose,
  reloadData,
  billingInfo,
}) => {
  const initData = {
    name: '',
    country: '',
    address: '',
  };

  const [dataForm, setDataForm] = useState<IDataFormBillingInfo>(initData);

  const updateMyBillingInfo = async () => {
    try {
      await rf.getRequest('BillingRequest').updateBillingInfo(dataForm);
      toastSuccess({ message: 'Successfully!' });
      reloadData();
      onClose();
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  useEffect(() => {
    setDataForm({
      name: billingInfo.name,
      country: billingInfo.country,
      address: billingInfo.address,
    });
  }, [billingInfo]);

  return (
    <BaseModal
      size="2xl"
      title={`Billing Address`}
      isOpen={open}
      onClose={onClose}
      onActionLeft={onClose}
      textActionRight="Submit"
      onActionRight={updateMyBillingInfo}
      textActionLeft="Cancel"
    >
      <Box flexDirection={'column'} pt={'20px'}>
        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'NAME'} customWidth={'49%'}>
            <AppInput
              placeholder={'Name or Company name'}
              value={dataForm.name}
              onChange={(e) => {
                setDataForm({
                  ...dataForm,
                  name: e.target.value,
                });
              }}
            />
          </AppField>
          <AppField label={'COUNTRY'} customWidth={'49%'}>
            <AppSelect
              placeholder={'Billing country'}
              onChange={(e: any) => {
                setDataForm({
                  ...dataForm,
                  country: e.value,
                });
              }}
              options={listCountry}
              value={
                listCountry.find(
                  (item) => item.value === dataForm.country,
                ) as any
              }
            />
          </AppField>
          <AppField label={'ADDRESS'} customWidth={'100%'}>
            <AppInput
              placeholder={'Billing address'}
              value={dataForm.address}
              onChange={(e) => {
                setDataForm({
                  ...dataForm,
                  address: e.target.value,
                });
              }}
            />
          </AppField>
        </Flex>
      </Box>
    </BaseModal>
  );
};

export default ModalBillingInfo;
