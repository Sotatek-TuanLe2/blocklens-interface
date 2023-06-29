import { Box, Flex } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { AppButton, AppField, AppInput, AppSelect2 } from 'src/components';
import { COUNTRIES } from 'src/constants';
import rf from 'src/requests/RequestFactory';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import BaseModal from './BaseModal';

interface IModalBillingInfo {
  open: boolean;
  onClose: () => void;
  reloadData: () => void;
  billingInfo: any;
}

interface IDataFormBillingInfo {
  name?: string;
  country: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
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
    city: '',
    state: '',
    postalCode: '',
    email: '',
  };

  const [dataForm, setDataForm] = useState<IDataFormBillingInfo>(initData);

  const updateMyBillingInfo = async () => {
    try {
      await rf.getRequest('BillingRequest').updateBillingInfo({
        ...dataForm,
        name: dataForm.name?.trim(),
        address: dataForm.address?.trim(),
      });
      toastSuccess({ message: 'Successfully!' });
      reloadData();
      onClose();
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  useEffect(() => {
    setDataForm({
      name: billingInfo.name,
      country: billingInfo.country,
      address: billingInfo.address,
      email: billingInfo.email,
      city: billingInfo.city,
      state: billingInfo.state,
      postalCode: billingInfo.postalCode,
    });
  }, [billingInfo, open]);

  return (
    <BaseModal
      size="lg"
      title={`Edit Billing Details`}
      isOpen={open}
      onClose={onClose}
    >
      <Box flexDirection={'column'} pt={'20px'}>
        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'Name'} customWidth={'100%'}>
            <AppInput
              value={dataForm.name}
              onChange={(e) => {
                setDataForm({
                  ...dataForm,
                  name: e.target.value,
                });
              }}
            />
          </AppField>
          <AppField label={'Address'} customWidth={'100%'}>
            <AppInput
              value={dataForm.address}
              onChange={(e) => {
                setDataForm({
                  ...dataForm,
                  address: e.target.value,
                });
              }}
            />
          </AppField>
          <Box width={'32%'}>
            <AppField label={'City'} customWidth={'100%'}>
              <AppInput
                value={dataForm.city}
                onChange={(e) => {
                  setDataForm({
                    ...dataForm,
                    city: e.target.value,
                  });
                }}
              />
            </AppField>
          </Box>

          <Box width={'32%'}>
            <AppField label={'State'} customWidth={'100%'}>
              <AppInput
                value={dataForm.state}
                onChange={(e) => {
                  setDataForm({
                    ...dataForm,
                    state: e.target.value,
                  });
                }}
              />
            </AppField>
          </Box>
          <Box width={'32%'}>
            <AppField label={'Postal Code'} customWidth={'100%'}>
              <AppInput
                value={dataForm.postalCode}
                onChange={(e) => {
                  setDataForm({
                    ...dataForm,
                    postalCode: e.target.value,
                  });
                }}
              />
            </AppField>
          </Box>

          <AppField label={'Country'} customWidth={'100%'}>
            <AppSelect2
              size="large"
              onChange={(value: string) => {
                setDataForm({
                  ...dataForm,
                  country: value,
                });
              }}
              options={listCountry}
              value={dataForm.country}
            />
          </AppField>

          <AppField label={'Billing Email'} customWidth={'100%'}>
            <AppInput
              value={dataForm.email}
              onChange={(e) => {
                setDataForm({
                  ...dataForm,
                  email: e.target.value,
                });
              }}
            />
          </AppField>
        </Flex>

        <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={4}>
          <AppButton
            width={'49%'}
            size={'lg'}
            variant={'cancel'}
            onClick={onClose}
          >
            Cancel
          </AppButton>
          <AppButton width={'49%'} size={'lg'} onClick={updateMyBillingInfo}>
            Save
          </AppButton>
        </Flex>
      </Box>
    </BaseModal>
  );
};

export default ModalBillingInfo;
