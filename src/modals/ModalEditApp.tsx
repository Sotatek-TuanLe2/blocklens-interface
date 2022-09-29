import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import BaseModal from './BaseModal';
import { IAppInfo } from 'src/pages/AppDetail';
import { AppButton, AppField, AppInput, AppTextarea } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import FormCreateApp from '../pages/HomePage/parts/FormCreateApp';

interface IModalEditApp {
  open: boolean;
  onClose: () => void;
  reloadData: () => void;
  appInfo: IAppInfo;
}

interface IDataForm {
  name?: string;
  description?: string;
}

const ModalEditApp: FC<IModalEditApp> = ({ open, onClose, appInfo, reloadData }) => {
  const [dataForm, setDataForm] = useState<IDataForm>({});
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.500'}>{message}</Text>,
    }),
  );

  useEffect(() => {
    if (!appInfo) return;
    setDataForm({
      ...dataForm,
      name: appInfo?.name,
      description: appInfo?.description,
    });
  }, [appInfo]);


  const handleSubmitForm = async () => {
    try {
      await rf
        .getRequest('AppRequest')
        .updateApp(appInfo.appId, dataForm );
      toastSuccess({ message: 'Update Successfully!' });
      onClose();
      reloadData();
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
    validator.current.visibleFields = [];
  };

  return (
    <BaseModal size="2xl" title="Update App" isOpen={open} onClose={onClose}>
      <Box>
        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'NAME'} customWidth={'100%'} isRequired>
            <AppInput
              placeholder="Gavin"
              value={dataForm.name}
              onChange={(e) => {
                setDataForm({
                  ...dataForm,
                  name: e.target.value,
                });
              }}
              validate={{
                name: `name`,
                validator: validator.current,
                rule: 'required',
              }}
            />
          </AppField>
          <AppField label={'DESCRIPTION'} customWidth={'100%'} isRequired>
            <AppTextarea
              placeholder="Gavin"
              value={dataForm.description}
              onChange={(e) =>
                setDataForm({
                  ...dataForm,
                  description: e.target.value,
                })
              }
            />
          </AppField>
        </Flex>
        <Flex justifyContent={'flex-end'}>
          <AppButton
            disabled={isDisableSubmit}
            onClick={() => handleSubmitForm()}
            size={'md'}
            mt={5}
            textTransform={'uppercase'}
          >
            Update
          </AppButton>
        </Flex>
      </Box>
    </BaseModal>
  );
};

export default ModalEditApp;
