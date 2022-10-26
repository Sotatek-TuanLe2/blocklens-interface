import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC, useEffect, useRef, useState } from 'react';
import BaseModal from './BaseModal';
import { AppButton, AppField, AppInput } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { IAppResponse } from 'src/utils/utils-app';

interface ICreateAddressActivityModal {
  open: boolean;
  onClose: () => void;
  onReloadData: () => void;
  appInfo: IAppResponse;
}

interface IDataForm {
  webhook: string;
  addresses: string[];
}

const ModalCreateWebhookAddress: FC<ICreateAddressActivityModal> = ({
  open,
  onClose,
  appInfo,
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
      element: (message: string) => (
        <Text className="text-error">{message}</Text>
      ),
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
    setTimeout(() => {
      const isDisabled = !validator.current.allValid();
      setIsDisableSubmit(isDisabled);
    }, 0);
  }, [dataForm, open]);

  const onCloseModal = () => {
    onClose();
    setDataForm(initDataCreateAddress);
    validator.current.visibleFields = [];
  };

  return (
    <BaseModal
      size="2xl"
      title="Create Address Activity"
      isOpen={open}
      onClose={onCloseModal}
      textActionLeft="Create Webhook"
    >
      <Box flexDirection={'column'} pt={'20px'}>
        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'WEBHOOK URL'} customWidth={'100%'} isRequired>
            <AppInput
              placeholder="https://yourapp.com/webhook/data/12345"
              borderRightRadius={0}
              value={dataForm.webhook}
              onChange={(e) =>
                setDataForm({
                  ...dataForm,
                  webhook: e.target.value.trim(),
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
                        index === id ? e.target.value.trim() : value,
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
                {dataForm.addresses.length > 1 && (
                  <Box
                    position={'absolute'}
                    right={'25px'}
                    color={'#4C84FF'}
                    cursor={'pointer'}
                    onClick={() =>
                      setDataForm({
                        ...dataForm,
                        addresses: [
                          ...dataForm.addresses.filter(
                            (address: string, i: number) => i !== index,
                          ),
                        ],
                      })
                    }
                  >
                    REMOVE
                  </Box>
                )}
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
      </Box>
    </BaseModal>
  );
};

export default ModalCreateWebhookAddress;
