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
  AppHeading,
  AppInput,
  AppTextarea,
  AppButtonLarge
} from 'src/components';
import ModalDeleteApp from 'src/modals/ModalDeleteApp';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import ModalChangeStatusApp from 'src/modals/ModalChangeStatusApp';
import { createValidator } from 'src/utils/utils-validator';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import {
  getLogoChainByChainId,
  getNameChainByChainId,
} from 'src/utils/utils-network';
import { useParams } from 'react-router';
import { BasePageContainer } from 'src/layouts';
import useAppDetails from 'src/hooks/useAppDetails';

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
  const { appInfo, getAppInfo } = useAppDetails(appId);

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
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
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
    );
  };

  return (
    <BasePageContainer className="app-detail">
      <>
        <Flex className="app-info">
          <AppHeading title="Settings" linkBack={`/apps/${appId}`} isCenter/>

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
              <Box className="title-status">App Status</Box>
              <Flex alignItems={'center'}>
                <Box
                  className={isActive ? 'icon-active' : 'icon-inactive'}
                  mr={2}
                />
                <Box>{isActive ? 'Active' : 'Inactive'}</Box>
              </Flex>
            </Flex>

            <AppButtonLarge
              onClick={() => setIsOpenChangeStatusAppModal(true)}
            >
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
    </BasePageContainer>
  );
};

export default AppSettingsPage;
