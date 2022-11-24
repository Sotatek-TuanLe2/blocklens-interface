import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import PartNFTWebhooks from './parts/PartNFTWebhooks';
import PartAppStatics from './parts/PartAppStatics';
import PartAddressWebhooks from './parts/PartAddressWebhooks';
import PartContractWebhooks from './parts/PartContractWebhooks';
import { BasePageContainer } from 'src/layouts';
import { AppButton, AppCard, AppGraph, AppLink } from 'src/components';
import { CHAINS } from 'src/constants';
import AppSettings from './parts/AppSettings';

const AppDetail = () => {
  const [appInfo, setAppInfo] = useState<any>({});
  const [isShowSetting, setIsShowSetting] = useState<boolean>(false);

  const { id: appId } = useParams<{ id: string }>();

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

  useEffect(() => {
    getAppInfo().then();
  }, []);

  const isEVM = useMemo(
    () => appInfo.chain !== CHAINS.SOLANA && appInfo.chain !== CHAINS.BITCOIN,
    [appInfo],
  );

  return (
    <BasePageContainer className="app-detail">
      {isShowSetting ? (
        <AppSettings
          onBack={() => setIsShowSetting(false)}
          appInfo={appInfo}
          reloadData={getAppInfo}
        />
      ) : (
        <>
          <Flex className="app-info">
            <Flex className="name">
              <AppLink to={'/'}>
                <Box className="icon-arrow-left" mr={6} />
              </AppLink>
              <Box>{appInfo.name}</Box>
            </Flex>

            <Flex>
              <AppButton
                size={'md'}
                variant="cancel"
                mr={5}
                onClick={() => setIsShowSetting(true)}
              >
                <Box className="icon-settings" mr={2} /> Setting
              </AppButton>
            </Flex>
          </Flex>

          <PartAppStatics />

          <AppCard className="list-webhook">
            <Tabs variant={'unstyled'} colorScheme="transparent">
              <TabList className={`${isEVM ? '' : 'no-tab'} app-tabs`}>
                <Flex w={'100%'}>
                  {isEVM && <Tab className="app-tab">NFT Activity</Tab>}
                  <Tab className="app-tab">Address Activity</Tab>
                  {isEVM && <Tab className="app-tab">Contract Activity</Tab>}
                </Flex>
              </TabList>

              <TabPanels>
                {isEVM && (
                  <TabPanel className="content-tab-app">
                    <PartNFTWebhooks appInfo={appInfo} />
                  </TabPanel>
                )}
                <TabPanel
                  className={`${isEVM ? '' : 'no-tab'} content-tab-app`}
                >
                  <PartAddressWebhooks appInfo={appInfo} />
                </TabPanel>
                {isEVM && (
                  <TabPanel className="content-tab-app">
                    <PartContractWebhooks appInfo={appInfo} />
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </AppCard>

          <AppGraph type="app" />
        </>
      )}
    </BasePageContainer>
  );
};

export default AppDetail;
