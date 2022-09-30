import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import BasePage from 'src/layouts/BasePage';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import PartNFTWebhooks from './parts/PartNFTWebhooks';
import PartAppStatics from './parts/PartAppStatics';
import PartAddressWebhooks from './parts/PartAddressWebhooks';
import { getLogoChainByName } from 'src/utils/utils-network';
import PartContractWebhooks from './parts/PartContractWebhooks';
import ModalEditApp from 'src/modals/ModalEditApp';

export interface IAppInfo {
  name?: string;
  chain?: string;
  network?: string;
  description?: string;
  key?: string;
  appId?: number;
  userId?: number;
}

const AppDetail = () => {
  const [appInfo, setAppInfo] = useState<IAppInfo>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenModalEditApp, setIsOpenModalEditApp] = useState<boolean>(false);

  const { id: appId } = useParams<{ id: string }>();

  const getAppInfo = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await rf
        .getRequest('AppRequest')
        .getAppDetail(+appId)) as any;
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
    <BasePage>
      <Box className="app-detail">
        <Box mx={5}>
          <Box className="app-info">
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
                  className={getLogoChainByName(appInfo?.chain)}
                ></Box>
                {appInfo.chain}
              </Flex>
            </Flex>
          </Box>

          <PartAppStatics appInfo={appInfo} />
          <PartNFTWebhooks appInfo={appInfo} />
          <PartAddressWebhooks appInfo={appInfo} />
          <PartContractWebhooks appInfo={appInfo} />
        </Box>
      </Box>

      <ModalEditApp
        open={isOpenModalEditApp}
        onClose={() => setIsOpenModalEditApp(false)}
        appInfo={appInfo}
        reloadData={getAppInfo}
      />
    </BasePage>
  );
};

export default AppDetail;
