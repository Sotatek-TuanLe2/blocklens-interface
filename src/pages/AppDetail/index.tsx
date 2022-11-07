import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import PartNFTWebhooks from './parts/PartNFTWebhooks';
import PartAppStatics from './parts/PartAppStatics';
import PartAddressWebhooks from './parts/PartAddressWebhooks';
import { getLogoChainByName } from 'src/utils/utils-network';
import PartContractWebhooks from './parts/PartContractWebhooks';
import ModalEditApp from 'src/modals/ModalEditApp';
import ModalDeleteApp from 'src/modals/ModalDeleteApp';
import { BasePageContainer } from 'src/layouts';
import { AppButton } from 'src/components';
import ModalChangeStatusApp from 'src/modals/ModalChangeStatusApp';
import { APP_STATUS } from 'src/utils/utils-app';
import { CHAINS } from 'src/constants';

const AppDetail = () => {
  const [appInfo, setAppInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenModalEditApp, setIsOpenModalEditApp] = useState<boolean>(false);
  const [isOpenModalChangeStatus, setIsOpenModalChangeStatus] =
    useState<boolean>(false);
  const [isOpenModalDeleteApp, setIsOpenModalDeleteApp] =
    useState<boolean>(false);

  const { id: appId } = useParams<{ id: string }>();

  const getAppInfo = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await rf
        .getRequest('AppRequest')
        .getAppDetail(appId)) as any;
      setAppInfo(res);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    getAppInfo().then();
  }, []);

  return (
    <BasePageContainer className="app-detail">
      <>
        <Flex className="app-info">
          <Box>
            <Flex alignItems={'center'}>
              <Box className="name">{appInfo.name}</Box>
              <Box
                className="icon-edit"
                cursor="pointer"
                onClick={() => setIsOpenModalEditApp(true)}
              ></Box>
              <Flex ml={5} alignItems={'center'}>
                <Box
                  mr={2}
                  className={getLogoChainByName(appInfo?.chain) || ''}
                ></Box>
                {appInfo.chain + ' ' + appInfo.network}
              </Flex>
            </Flex>
            <Box className="description">{appInfo.description}</Box>
          </Box>

          <Flex>
            <AppButton
              size={'md'}
              variant="outline"
              mr={5}
              onClick={() => setIsOpenModalChangeStatus(true)}
            >
              {appInfo.status === APP_STATUS.DISABLED
                ? 'ACTIVATE'
                : 'DEACTIVATE'}{' '}
              APP
            </AppButton>
            <AppButton
              size={'md'}
              variant="outline"
              className={'btn-delete'}
              onClick={() => setIsOpenModalDeleteApp(true)}
            >
              DELETE APP
            </AppButton>
          </Flex>
        </Flex>

        <PartAppStatics />

        {appInfo.chain !== CHAINS.SOLANA && (
          <PartNFTWebhooks appInfo={appInfo} />
        )}
        <PartAddressWebhooks appInfo={appInfo} />
        {appInfo.chain !== CHAINS.SOLANA && (
          <PartContractWebhooks appInfo={appInfo} />
        )}

        <ModalEditApp
          open={isOpenModalEditApp}
          onClose={() => setIsOpenModalEditApp(false)}
          appInfo={appInfo}
          reloadData={getAppInfo}
        />

        <ModalDeleteApp
          open={isOpenModalDeleteApp}
          onClose={() => setIsOpenModalDeleteApp(false)}
          appInfo={appInfo}
        />

        <ModalChangeStatusApp
          open={isOpenModalChangeStatus}
          onClose={() => setIsOpenModalChangeStatus(false)}
          appInfo={appInfo}
          reloadData={getAppInfo}
        />
      </>
    </BasePageContainer>
  );
};

export default AppDetail;
