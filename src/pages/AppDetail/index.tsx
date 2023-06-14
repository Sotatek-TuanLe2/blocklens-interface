import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import PartNFTWebhooks from './parts/PartNFTWebhooks';
import PartAppStatics from './parts/PartAppStatics';
import PartAddressWebhooks from './parts/PartAddressWebhooks';
import PartContractWebhooks from './parts/PartContractWebhooks';
import { BasePage } from 'src/layouts';
import { AppButton, AppCard, AppHeading } from 'src/components';
import {
  getLogoChainByChainId,
  isEVMNetwork,
  isAptosNetwork,
  isSuiNetwork,
} from 'src/utils/utils-network';
import { isMobile } from 'react-device-detect';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import PartAppGraph from './parts/PartAppGraph';
import { CHAINS, WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import useUser from 'src/hooks/useUser';
import rf from 'src/requests/RequestFactory';
import { ROUTES } from 'src/utils/common';
import PartAptosModuleWebhooks from './parts/PartAptosModuleWebhooks';
import PartAptosCoinWebhooks from './parts/PartAptosCoinWebhooks';
import PartAptosTokenWebhooks from './parts/PartAptosTokenWebhooks';

const AppDetail = () => {
  const [type, setType] = useState<string>('');
  const [defaultTab, setDefaultTab] = useState(0);
  const history = useHistory();
  const { user } = useUser();
  const userStats = user?.getStats();

  const { id: appId } = useParams<{ id: string }>();
  const [appInfo, setAppInfo] = useState<IAppResponse | any>({});

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

  const getActiveTab = () => {
    const tabs = [
      userStats?.numberOfNftActivities,
      userStats?.numberOfAddressActivities,
      userStats?.numberOfContractActivities,
    ];
    const tabHasWebhook = tabs.find((item) => item && item > 0);
    return tabHasWebhook ? tabs.indexOf(tabHasWebhook) : 0;
  };

  useEffect(() => {
    const activeTab = getActiveTab();
    setDefaultTab(activeTab);
  }, [
    userStats?.numberOfContractActivities,
    userStats?.numberOfAddressActivities,
    userStats?.numberOfNftActivities,
  ]);

  useEffect(() => {
    if (!isEVMNetwork(appInfo.chain)) {
      setDefaultTab(0);
      return;
    }
  }, [appInfo]);

  useEffect(() => {
    if (isEVMNetwork(appInfo.chain)) {
      setType(WEBHOOK_TYPES.NFT_ACTIVITY);
    }

    if (isSuiNetwork(appInfo.chain) || isAptosNetwork(appInfo.chain)) {
      setType(WEBHOOK_TYPES.ADDRESS_ACTIVITY);
    }
  }, [appInfo]);

  const _renderListWebhook = () => {
    return (
      <AppCard className="list-webhook">
        <Flex className={'title-list-app'} pt={0}>
          <Box className={'text-title'}>Webhooks</Box>
          <Box>
            <AppButton
              size={'sm'}
              isDisabled={appInfo.status === APP_STATUS.DISABLED}
              onClick={() =>
                history.push(`/create-webhook/${appInfo.appId}?type=${type}`)
              }
            >
              <Box className="icon-plus-circle" mr={2} /> Create
            </AppButton>
          </Box>
        </Flex>

        <Tabs
          variant={'unstyled'}
          colorScheme="transparent"
          defaultIndex={defaultTab}
        >
          <TabList className={`app-tabs`}>
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

              {isAptosNetwork(appInfo.chain) && (
                <>
                  <Tab
                    className="app-tab"
                    onClick={() => setType(WEBHOOK_TYPES.APTOS_COIN_ACTIVITY)}
                  >
                    Coin Activity
                  </Tab>
                  <Tab
                    className="app-tab"
                    onClick={() => setType(WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY)}
                  >
                    Module Activity
                  </Tab>
                  <Tab
                    className="app-tab"
                    onClick={() => setType(WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY)}
                  >
                    Token Activity
                  </Tab>
                </>
              )}
            </Flex>
          </TabList>

          {isEVMNetwork(appInfo.chain) && (
            <TabPanels>
              <TabPanel className="content-tab-app">
                <PartNFTWebhooks appInfo={appInfo} />
              </TabPanel>

              <TabPanel className={`content-tab-app`}>
                <PartAddressWebhooks appInfo={appInfo} />
              </TabPanel>

              {isEVMNetwork(appInfo.chain) && (
                <TabPanel className="content-tab-app">
                  <PartContractWebhooks appInfo={appInfo} />
                </TabPanel>
              )}
            </TabPanels>
          )}

          {isAptosNetwork(appInfo.chain) && (
            <TabPanels>
              <TabPanel className={`content-tab-app`}>
                <PartAddressWebhooks appInfo={appInfo} />
              </TabPanel>

              <TabPanel className="content-tab-app">
                <PartAptosCoinWebhooks appInfo={appInfo} />
              </TabPanel>

              <TabPanel className="content-tab-app">
                <PartAptosModuleWebhooks appInfo={appInfo} />
              </TabPanel>

              <TabPanel className="content-tab-app">
                <PartAptosTokenWebhooks appInfo={appInfo} />
              </TabPanel>
            </TabPanels>
          )}

          {isSuiNetwork(appInfo?.chain) && (
            <TabPanels>
              <TabPanel className={`content-tab-app`}>
                <PartAddressWebhooks appInfo={appInfo} />
              </TabPanel>
            </TabPanels>
          )}
        </Tabs>
      </AppCard>
    );
  };

  const _renderNoApp = () => {
    return <Flex justifyContent="center">App Not Found</Flex>;
  };

  const _renderAppDetail = () => {
    return (
      <>
        <Flex className="app-info">
          <AppHeading title={appInfo.name} linkBack={ROUTES.TRIGGERS} />

          <Flex>
            {!isMobile && (
              <Flex alignItems={'center'} className="box-network">
                <Box className={getLogoChainByChainId(appInfo.chain)} mr={2} />
                <Box textTransform="capitalize">
                  {appInfo.network.toLowerCase()}
                </Box>
              </Flex>
            )}

            <AppButton
              size={'md'}
              variant="cancel"

              onClick={() => history.push(`/app/${appId}/settings`)}
            >
              <Box className="icon-settings" />
              {!isMobile && <Box bg='' color='black' ml={2}>Setting</Box>}
            </AppButton>
          </Flex>
        </Flex>

        <Box className={'statics'}>
          <PartAppStatics
            totalWebhookActive={appInfo?.totalRegistrationActive}
            totalWebhook={appInfo?.totalRegistration}
          />
        </Box>

        {_renderListWebhook()}

        <Box className={'user-graph'}>
          <PartAppGraph />
        </Box>
      </>
    );
  };

  return (
    <BasePage className="app-detail" onInitPage={getAppInfo}>
      {!appInfo || !Object.values(appInfo).length
        ? _renderNoApp()
        : _renderAppDetail()}
    </BasePage>
  );
};

export default AppDetail;
