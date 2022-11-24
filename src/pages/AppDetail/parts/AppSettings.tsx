import { Box, Flex, Text } from '@chakra-ui/react';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import 'src/styles/pages/AppDetail.scss';
import {
  AppButton,
  AppCard,
  AppField,
  AppInput,
  AppTextarea,
} from 'src/components';
import ModalDeleteApp from 'src/modals/ModalDeleteApp';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import ModalChangeStatusApp from 'src/modals/ModalChangeStatusApp';
import { createValidator } from 'src/utils/utils-validator';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { getLogoChainByName } from 'src/utils/utils-network';

interface IAppSettings {
  onBack: () => void;
  reloadData: () => void;
  appInfo: IAppResponse;
}

interface IDataForm {
  name?: string;
  description?: string;
}

const AppSettings: FC<IAppSettings> = ({ onBack, appInfo, reloadData }) => {
  const initData = {
    name: appInfo?.name,
    description: appInfo?.description,
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initData);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [isOpenModalDeleteApp, setIsOpenModalDeleteApp] =
    useState<boolean>(false);
  const [isOpenModalChangeStatus, setIsOpenModalChangeStatus] =
    useState<boolean>(false);

  const isActive = useMemo(
    () => appInfo.status === APP_STATUS.ENABLE,
    [appInfo],
  );

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  const validator = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="text-error">{message}</Text>
      ),
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
      await rf.getRequest('AppRequest').updateApp(appInfo.appId, {
        name: dataForm.name?.trim(),
        description: dataForm.description?.trim(),
      });
      toastSuccess({ message: 'Update Successfully!' });
      reloadData();
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  return (
    <>
      <Flex className="app-info">
        <Flex className="name">
          <Box
            className="icon-arrow-left"
            mr={6}
            onClick={onBack}
            cursor="pointer"
          />
          <Box>Setting</Box>
        </Flex>

        <Flex>
          <AppButton
            size={'md'}
            variant="cancel"
            mr={5}
            onClick={() => setIsOpenModalDeleteApp(true)}
          >
            <Box className="icon-trash" />
          </AppButton>
        </Flex>
      </Flex>

      <AppCard className="basic-setting">
        <Flex justifyContent={'space-between'}>
          <Box className="title-status">Basic Settings</Box>

          <AppButton onClick={handleSubmitForm} isDisabled={isDisableSubmit}>
            Save
          </AppButton>
        </Flex>

        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'App Name'} customWidth={'49%'} isRequired>
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
                rule: ['required', 'max:20'],
              }}
            />
          </AppField>
          <AppField label={'Chain'} customWidth={'24.5%'} isRequired>
            <Flex className="chain-app">
              <Box className={getLogoChainByName(appInfo.chain)} mr={3} />
              <Box>{appInfo.chain}</Box>
            </Flex>
          </AppField>
          <AppField label={'Network'} customWidth={'24.5%'} isRequired>
            <Flex className="chain-app">
              <Box className={getLogoChainByName(appInfo.chain)} mr={3} />
              <Box>{appInfo.network}</Box>
            </Flex>
          </AppField>
          <AppField label={'Description'} customWidth={'100%'}>
            <AppTextarea
              placeholder="Write something about this app in 100 characters!"
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
                rule: ['max:100'],
              }}
            />
          </AppField>
        </Flex>
      </AppCard>

      <AppCard className="app-status">
        <Flex justifyContent={'space-between'}>
          <Flex alignItems="center">
            <Box className="title-status">App Status</Box>
            <Box>{isActive ? 'Active' : 'Inactive'}</Box>
          </Flex>

          <AppButton onClick={() => setIsOpenModalChangeStatus(true)}>
            {isActive ? 'Deactivate' : 'Activate'}
          </AppButton>
        </Flex>
      </AppCard>

      {isOpenModalDeleteApp && (
        <ModalDeleteApp
          open={isOpenModalDeleteApp}
          onClose={() => setIsOpenModalDeleteApp(false)}
          appInfo={appInfo}
        />
      )}

      {isOpenModalChangeStatus && (
        <ModalChangeStatusApp
          open={isOpenModalChangeStatus}
          onClose={() => setIsOpenModalChangeStatus(false)}
          reloadData={reloadData}
          appInfo={appInfo}
        />
      )}
    </>
  );
};

export default AppSettings;
