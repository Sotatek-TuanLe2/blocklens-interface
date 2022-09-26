import { useRef, useState, useEffect } from 'react';
import React, { FC } from 'react';
import { AppField, AppInput, AppButton } from 'src/components';
import { Flex, Text, Box } from '@chakra-ui/react';
import { createValidator } from 'src/utils/utils-validator';
import { IAppInfo } from '../index';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';

interface IDataForm {
  webhook: string;
  addresses: string[];
}

interface IFormCreateAddress {
  appInfo: IAppInfo;
  onClose: () => void;
  onReloadData: () => void;
}

const FormCreateAddress: FC<IFormCreateAddress> = ({
  appInfo,
  onClose,
  onReloadData,
}) => {
  const initDataCreateAddress = {
    webhook: '',
    addresses: [''],
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateAddress);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.500'}>{message}</Text>,
    }),
  );

  const handleSubmitForm = async () => {
    const data = {
      ...dataForm,
      addresses: dataForm.addresses.filter((item: string) => !!item),
    };

    try {
      await rf
        .getRequest('RegistrationRequest')
        .addAddressActivity({ appId: appInfo.appId, ...data });
      toastSuccess({ message: 'Add Successfully!' });
      onReloadData();
      onClose();
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  return (
    <>
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'WEBHOOK URL'} customWidth={'100%'} isRequired>
          <AppInput
            placeholder="https://yourapp.com/webhook/data/12345"
            borderRightRadius={0}
            value={dataForm.webhook}
            onChange={(e) =>
              setDataForm({
                ...dataForm,
                webhook: e.target.value,
              })
            }
            validate={{
              name: `webhook`,
              validator: validator.current,
              rule: ['required', 'url'],
            }}
          />
        </AppField>
        {dataForm.addresses.map((item: string, index: number) => {
          return (
            <AppField
              label={`${appInfo.chain} ADDRESS`}
              customWidth={'100%'}
              key={index}
              isRequired
            >
              <AppInput
                placeholder="0xbb.."
                size="lg"
                value={item}
                onChange={(e) => {
                  const newAddresses = dataForm.addresses.map(
                    (value: string, id: number) =>
                      index === id ? e.target.value : value,
                  );
                  setDataForm({
                    ...dataForm,
                    addresses: newAddresses,
                  });
                }}
                validate={{
                  name: `address ${index + 1}`,
                  validator: validator.current,
                  rule: 'required',
                }}
              />
            </AppField>
          );
        })}

        <Box
          color={'brand.400'}
          cursor={'pointer'}
          onClick={() =>
            setDataForm({
              ...dataForm,
              addresses: [...dataForm.addresses, ''],
            })
          }
        >
          ADD ADDRESS
        </Box>
      </Flex>
      <Flex justifyContent={'flex-end'}>
        <AppButton
          disabled={isDisableSubmit}
          onClick={() => handleSubmitForm()}
          size={'md'}
          mt={5}
          textTransform={'uppercase'}
        >
          Create webhook
        </AppButton>
      </Flex>
    </>
  );
};

export default FormCreateAddress;
