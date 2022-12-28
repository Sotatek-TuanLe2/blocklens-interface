import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import rf from 'src/requests/RequestFactory';
import { useHistory, useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import PartNFTWebhooks from './parts/PartNFTWebhooks';
import PartAppStatics from './parts/PartAppStatics';
import PartAddressWebhooks from './parts/PartAddressWebhooks';
import PartContractWebhooks from './parts/PartContractWebhooks';
import { BasePageContainer } from 'src/layouts';
import { AppButton, AppCard, AppLink } from 'src/components';
import AppSettings from './parts/AppSettings';
import { getLogoChainByChainId, isEVMNetwork } from 'src/utils/utils-network';
import { isMobile } from 'react-device-detect';
import { APP_STATUS } from 'src/utils/utils-app';
import PartAppGraph from './parts/PartAppGraph';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const AppDetail = () => {
  const {
    numberOfAddressActivities,
    numberOfContractActivities,
    numberOfNftActivities,
  } = useSelector((state: RootState) => state.stats);

  const [appInfo, setAppInfo] = useState<any>({});
  const [isShowSetting, setIsShowSetting] = useState<boolean>(false);
  const [type, setType] = useState<string>(WEBHOOK_TYPES.NFT_ACTIVITY);
  const history = useHistory();

  const { id: appId } = useParams<{ id: string }>();

  const getActiveTab = () => {
    const tabs = [
      numberOfNftActivities,
      numberOfAddressActivities,
      numberOfContractActivities,
    ];
    const tabHasWebhook = tabs.find((item) => item > 0);
    return tabHasWebhook ? tabs.indexOf(tabHasWebhook) : 0;
  };

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

  if (!appInfo || !Object.values(appInfo).length) {
    return (
      <BasePageContainer className="app-detail">
        <Flex justifyContent="center">App Not Found</Flex>
      </BasePageContainer>
    );
  }

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
                <Box className="icon-arrow-left" mr={isMobile ? 3 : 6} />
              </AppLink>
              <Box>{appInfo.name}</Box>
            </Flex>

            <Flex>
              {!isMobile && (
                <Flex alignItems={'center'} className="box-network">
                  <Box
                    className={getLogoChainByChainId(appInfo.chain)}
                    mr={2}
                  />
                  <Box textTransform="capitalize">
                    {appInfo.network.toLowerCase()}
                  </Box>
                </Flex>
              )}

              <AppButton
                size={'md'}
                px={isMobile ? 2.5 : 4}
                variant="cancel"
                onClick={() => setIsShowSetting(true)}
              >
                <Box className="icon-settings" mr={isMobile ? 0 : 2} />
                {isMobile ? '' : 'Setting'}
              </AppButton>
            </Flex>
          </Flex>

          <PartAppStatics
            totalWebhookActive={appInfo?.totalRegistrationActive}
          />

          <AppCard className="list-webhook">
            <Flex className={'title-list-app'} pt={0}>
              <Box className={'text-title'}>Webhooks</Box>
              <Box>
                <AppButton
                  size={'sm'}
                  px={4}
                  py={1}
                  isDisabled={appInfo.status === APP_STATUS.DISABLED}
                  className={'btn-create'}
                  onClick={() =>
                    history.push(
                      `/create-webhook/${appInfo.appId}?type=${type}`,
                    )
                  }
                >
                  <Box className="icon-plus-circle" mr={2} /> Create
                </AppButton>
              </Box>
            </Flex>

            <Tabs
              variant={'unstyled'}
              colorScheme="transparent"
              defaultIndex={getActiveTab()}
            >
              <TabList
                className={`${
                  isEVMNetwork(appInfo.chain) ? '' : 'no-tab'
                } app-tabs`}
              >
                <Flex w={'100%'}>
                  {isEVMNetwork(appInfo.chain) && (
                    <Tab
                      className="app-tab"
                      onClick={() => setType(WEBHOOK_TYPES.NFT_ACTIVITY)}
                    >
                      NFT Activity
                    </Tab>
                  )}
                  <Tab
                    className="app-tab"
                    onClick={() => setType(WEBHOOK_TYPES.ADDRESS_ACTIVITY)}
                  >
                    Address Activity
                  </Tab>
                  {isEVMNetwork(appInfo.chain) && (
                    <Tab
                      className="app-tab"
                      onClick={() => setType(WEBHOOK_TYPES.CONTRACT_ACTIVITY)}
                    >
                      Contract Activity
                    </Tab>
                  )}
                </Flex>
              </TabList>

              <TabPanels>
                {isEVMNetwork(appInfo.chain) && (
                  <TabPanel className="content-tab-app">
                    <PartNFTWebhooks appInfo={appInfo} />
                  </TabPanel>
                )}
                <TabPanel
                  className={`${
                    isEVMNetwork(appInfo.chain) ? '' : 'no-tab'
                  } content-tab-app`}
                >
                  <PartAddressWebhooks appInfo={appInfo} />
                </TabPanel>
                {isEVMNetwork(appInfo.chain) && (
                  <TabPanel className="content-tab-app">
                    <PartContractWebhooks appInfo={appInfo} />
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </AppCard>

          <PartAppGraph />
        </>
      )}
    </BasePageContainer>
  );
};

export default AppDetail;
