import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import PartAppStatics from './parts/PartAppStatics';
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
import {
  WEBHOOK_TYPES,
  WEBHOOK_TYPES_APTOS,
  WEBHOOK_TYPES_EVM,
  WEBHOOK_TYPES_NAME,
} from 'src/utils/utils-webhook';
import useUser from 'src/hooks/useUser';
import rf from 'src/requests/RequestFactory';
import { ROUTES } from 'src/utils/common';
import PartWebhooks from './parts/PartWebhooks';

const AppDetail = () => {
  const [type, setType] = useState<string>('');
  const [defaultTab, setDefaultTab] = useState(0);
  const history = useHistory();
  const { user } = useUser();
  const userStats = user?.getStats();
  const { search: searchUrl } = useLocation();
  const searchParams = new URLSearchParams(searchUrl);
  const currentType = searchParams.get('type');

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
    if (!currentType) {
      setDefaultTab(0);
      setType(WEBHOOK_TYPES.ADDRESS_ACTIVITY);
      return;
    }

    if (isEVMNetwork(appInfo.chain)) {
      setDefaultTab(WEBHOOK_TYPES_EVM.indexOf(currentType || ''));
    } else {
      setDefaultTab(WEBHOOK_TYPES_APTOS.indexOf(currentType || ''));
    }

    setType(currentType || '');
  }, [currentType, appInfo]);

  const _renderListTabsEVM = () => {
    return (
      <>
        <Tab
          className="app-tab"
          onClick={() =>
            history.push(
              `/app/${appId}?type=${WEBHOOK_TYPES.CONTRACT_ACTIVITY}`,
            )
          }
        >
          Contract Activity
        </Tab>
        <Tab
          className="app-tab"
          onClick={() =>
            history.push(`/app/${appId}?type=${WEBHOOK_TYPES.NFT_ACTIVITY}`)
          }
        >
          NFT Activity
        </Tab>
        <Tab
          className="app-tab"
          onClick={() =>
            history.push(`/app/${appId}?type=${WEBHOOK_TYPES.TOKEN_ACTIVITY}`)
          }
        >
          Token Activity
        </Tab>
      </>
    );
  };

  const _renderListTabsAptos = () => {
    return (
      <>
        <Tab
          className="app-tab"
          onClick={() =>
            history.push(
              `/app/${appId}?type=${WEBHOOK_TYPES.APTOS_COIN_ACTIVITY}`,
            )
          }
        >
          Coin Activity
        </Tab>

        <Tab
          className="app-tab"
          onClick={() =>
            history.push(
              `/app/${appId}?type=${WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY}`,
            )
          }
        >
          Token Activity
        </Tab>
        <Tab
          className="app-tab"
          onClick={() =>
            history.push(
              `/app/${appId}?type=${WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY}`,
            )
          }
        >
          Module Activity
        </Tab>
      </>
    );
  };

  const _renderTabPanelsEVM = () => {
    return (
      <TabPanels>
        <TabPanel className={`content-tab-app`}>
          <PartWebhooks
            appInfo={appInfo}
            type={WEBHOOK_TYPES.ADDRESS_ACTIVITY}
            description={'Get notified whenever an address occurs activity'}
          />
        </TabPanel>

        <TabPanel className="content-tab-app">
          <PartWebhooks
            appInfo={appInfo}
            type={WEBHOOK_TYPES.CONTRACT_ACTIVITY}
            description={'Get notified whenever an contract occurs activity'}
          />
        </TabPanel>

        <TabPanel className="content-tab-app">
          <PartWebhooks
            appInfo={appInfo}
            type={WEBHOOK_TYPES.NFT_ACTIVITY}
            description={'Get notified whenever an NFT occurs activity'}
          />
        </TabPanel>

        <TabPanel className="content-tab-app">
          <PartWebhooks
            appInfo={appInfo}
            type={WEBHOOK_TYPES.TOKEN_ACTIVITY}
            description={'Get notified whenever an token occurs activity'}
          />
        </TabPanel>
      </TabPanels>
    );
  };

  const _renderTabPanelsAptos = () => {
    return (
      <TabPanels>
        <TabPanel className={`content-tab-app`}>
          <PartWebhooks
            appInfo={appInfo}
            type={WEBHOOK_TYPES.ADDRESS_ACTIVITY}
            description={'Get notified whenever an address occurs activity'}
          />
        </TabPanel>

        <TabPanel className="content-tab-app">
          <PartWebhooks
            appInfo={appInfo}
            type={WEBHOOK_TYPES.APTOS_COIN_ACTIVITY}
            description={'Get notified whenever an coin occurs activity'}
          />
        </TabPanel>

        <TabPanel className="content-tab-app">
          <PartWebhooks
            appInfo={appInfo}
            type={WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY}
            description={'Get notified whenever an token occurs activity'}
          />
        </TabPanel>
        <TabPanel className="content-tab-app">
          <PartWebhooks
            appInfo={appInfo}
            type={WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY}
            description={'Get notified whenever an module occurs activity'}
          />
        </TabPanel>
      </TabPanels>
    );
  };

  const _renderTabPanelsSui = () => {
    return (
      <TabPanels>
        <TabPanel className={`content-tab-app`}>
          <PartWebhooks
            appInfo={appInfo}
            type={WEBHOOK_TYPES.ADDRESS_ACTIVITY}
            description={'Get notified whenever an address occurs activity'}
          />
        </TabPanel>
      </TabPanels>
    );
  };

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
              <Tab
                className="app-tab"
                onClick={() =>
                  history.push(
                    `/app/${appId}?type=${WEBHOOK_TYPES.ADDRESS_ACTIVITY}`,
                  )
                }
              >
                Address Activity
              </Tab>

              {isEVMNetwork(appInfo.chain) && _renderListTabsEVM()}

              {isAptosNetwork(appInfo.chain) && _renderListTabsAptos()}
            </Flex>
          </TabList>

          {isEVMNetwork(appInfo.chain) && _renderTabPanelsEVM()}

          {isAptosNetwork(appInfo.chain) && _renderTabPanelsAptos()}

          {isSuiNetwork(appInfo?.chain) && _renderTabPanelsSui()}
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
              {!isMobile && (
                <Box className="setting-btn" ml={2}>
                  Setting
                </Box>
              )}
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
