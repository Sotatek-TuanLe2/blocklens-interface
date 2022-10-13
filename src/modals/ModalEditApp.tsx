import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC, useEffect, useCallback, useRef, useState } from 'react';
import BaseModal from './BaseModal';
import { IAppInfo } from 'src/pages/AppDetail';
import { AppButton, AppField, AppInput, AppTextarea } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';

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
  const initData = {
    name: appInfo?.name,
    description: appInfo?.description,
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initData);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text className="text-error">{message}</Text>,
    }),
  );

  useEffect(() => {
    if (!appInfo) return;
    setDataForm(initData);
  }, [appInfo]);

  const handleSubmitForm = async () => {
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      return forceUpdate();
    }

    try {
      await rf.getRequest('AppRequest').updateApp(appInfo.appId, dataForm);
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
    setDataForm(initData);
  };

  return (
    <BaseModal size="2xl" title="Update App" isOpen={open} onClose={onCloseModal}>
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
                rule: ['required', 'max:20']
              }}
            />
          </AppField>
          <AppField label={'DESCRIPTION'} customWidth={'100%'} isRequired>
            <AppTextarea
              placeholder="Write something about this app in 50 characters!"
              value={dataForm.description}
              onChange={(e) =>
                setDataForm({
                  ...dataForm,
                  description: e.target.value,
                })
              }
              validate={{
                name: 'description',
                validator: validator.current,
                rule: ['required', 'max:50'],
              }}
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
