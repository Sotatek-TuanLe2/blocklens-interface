import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import BasePage from 'src/layouts/BasePage';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import ListNTF from './parts/ListNFT';
import ListInfo from './parts/ListInfo';
import ListAddress from './parts/ListAddress';

const AppDetail = () => {
  const [appInfo, setAppInfo] = useState<any>({});
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
            </Flex>

            <Box className="description">{appInfo.description}</Box>
          </Box>

          <ListInfo />
          <ListNTF />
          <ListAddress />
        </Box>
      </Box>
    </BasePage>
  );
};

export default AppDetail;
