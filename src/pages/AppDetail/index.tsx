import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import BasePage from 'src/layouts/BasePage';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import ListNTF from './parts/ListNFT';
import ListInfo from './parts/ListInfo';
import ListAddress from './parts/ListAddress';
import { getLogoChainByName } from 'src/utils/utils-network';

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
              <Box className="icon-edit" cursor="pointer"></Box>
              <Flex ml={5} alignItems={'center'}>
                <Box mr={2} className={getLogoChainByName(appInfo?.chain)}>
                </Box>
                {appInfo.chain}
              </Flex>
            </Flex>
            <Box className="description">{appInfo.description}</Box>
          </Box>

          <ListInfo appInfo={appInfo} />
          <ListNTF appInfo={appInfo} />
          <ListAddress appInfo={appInfo} />
        </Box>
      </Box>
    </BasePage>
  );
};

export default AppDetail;
