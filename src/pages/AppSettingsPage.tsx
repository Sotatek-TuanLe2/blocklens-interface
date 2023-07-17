import { Box, Flex, Text } from '@chakra-ui/react';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import {
  AppButton,
  AppButtonLarge,
  AppCard,
  AppField,
  AppHeading,
  AppInput,
  AppTextarea,
} from 'src/components';
import { BasePage } from 'src/layouts';
import ModalChangeStatusApp from 'src/modals/ModalChangeStatusApp';
import ModalDeleteApp from 'src/modals/ModalDeleteApp';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/AppDetail.scss';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { getErrorMessage } from 'src/utils/utils-helper';
import {
  getLogoChainByChainId,
  getNameChainByChainId,
} from 'src/utils/utils-network';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { createValidator } from 'src/utils/utils-validator';

interface IAppSettings {
  onBack: () => void;
  reloadData: () => void;
  appInfo: IAppResponse;
}

interface IDataForm {
  name?: string;
  description?: string;
}

const AppSettingsPage: FC<IAppSettings> = () => {
  const { id: appId } = useParams<{ id: string }>();
  const [appInfo, setAppInfo] = useState<IAppResponse | any>({});

  const initData = {
    name: appInfo?.name,
    description: appInfo?.description,
  };
  const [dataForm, setDataForm] = useState<IDataForm>(initData);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [isOpenDeleteAppModal, setIsOpenDeleteAppModal] =
    useState<boolean>(false);
  const [isOpenChangeStatusAppModal, setIsOpenChangeStatusAppModal] =
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

  const getAppInfo = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('AppRequest')
        .getAppDetail(appId)) as any;
      setAppInfo(res);
    } catch (error: any) {
      setAppInfo({});
    }
  }, [appId]);

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
      await getAppInfo();
      toastSuccess({ message: 'Update Successfully!' });
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const _renderBasicSettings = () => {
    return (
      <AppCard className="basic-setting">
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Box className="title-status">Basic Settings</Box>

          <AppButtonLarge
            onClick={handleSubmitForm}
            isDisabled={isDisableSubmit}
          >
            Save
          </AppButtonLarge>
        </Flex>

        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'Project Name'} customWidth={'49%'} isRequired>
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
              <Box className={getLogoChainByChainId(appInfo?.chain)} mr={3} />
              <Box>{getNameChainByChainId(appInfo?.chain)}</Box>
            </Flex>
          </AppField>
          <AppField label={'Network'} customWidth={'24.5%'} isRequired>
            <Flex className="chain-app">
              <Box className={getLogoChainByChainId(appInfo?.chain)} mr={3} />
              <Box textTransform="capitalize">
                {appInfo?.network?.toLowerCase()}
              </Box>
            </Flex>
          </AppField>
          <AppField label={'Description'} customWidth={'100%'}>
            <AppTextarea
              placeholder="Write something about this project in 100 characters!"
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
    );
  };

  return (
    <BasePage className="app-detail" onInitPage={getAppInfo}>
      <>
        <Flex className="app-info">
          <AppHeading title="Settings" linkBack={`/app/${appId}`} isCenter />

          <Flex>
            <AppButton
              size={'md'}
              variant="cancel"
              onClick={() => setIsOpenDeleteAppModal(true)}
            >
              <Box className="icon-trash" />
            </AppButton>
          </Flex>
        </Flex>

        {_renderBasicSettings()}

        <AppCard className="app-status">
          <Flex justifyContent={'space-between'}>
            <Flex className="box-status">
              <Box className="title-status">Project Status</Box>
              <Flex alignItems={'center'}>
                <Box
                  className={isActive ? 'icon-active' : 'icon-inactive'}
                  mr={2}
                />
                <Box>{isActive ? 'ACTIVE' : 'INACTIVE'}</Box>
              </Flex>
            </Flex>

            <AppButtonLarge onClick={() => setIsOpenChangeStatusAppModal(true)}>
              {isActive ? 'Deactivate' : 'Activate'}
            </AppButtonLarge>
          </Flex>
        </AppCard>

        {isOpenDeleteAppModal && (
          <ModalDeleteApp
            open={isOpenDeleteAppModal}
            onClose={() => setIsOpenDeleteAppModal(false)}
            appInfo={appInfo}
          />
        )}

        {isOpenChangeStatusAppModal && (
          <ModalChangeStatusApp
            open={isOpenChangeStatusAppModal}
            onClose={() => setIsOpenChangeStatusAppModal(false)}
            reloadData={getAppInfo}
            appInfo={appInfo}
          />
        )}
      </>
    </BasePage>
  );
};

export default AppSettingsPage;
