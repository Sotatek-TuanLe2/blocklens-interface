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
import { AppButton, AppCard, AppHeading } from 'src/components';
import { getLogoChainByChainId, isEVMNetwork } from 'src/utils/utils-network';
import { isMobile } from 'react-device-detect';
import { APP_STATUS } from 'src/utils/utils-app';
import PartAppGraph from './parts/PartAppGraph';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

const AppDetail = () => {
  const {
    stats: {
      numberOfAddressActivities,
      numberOfContractActivities,
      numberOfNftActivities,
    },
  } = useSelector((state: RootState) => state.user);

  const [appInfo, setAppInfo] = useState<any>({});
  const [type, setType] = useState<string>(WEBHOOK_TYPES.NFT_ACTIVITY);
  const [defaultTab, setDefaultTab] = useState(0);
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

  useEffect(() => {
    const activeTab = getActiveTab();
    setDefaultTab(activeTab);
  }, [
    numberOfContractActivities,
    numberOfAddressActivities,
    numberOfNftActivities,
  ]);

  if (!appInfo || !Object.values(appInfo).length) {
    return (
      <BasePageContainer className="app-detail">
        <Flex justifyContent="center">App Not Found</Flex>
      </BasePageContainer>
    );
  }

  const _renderListWebhook = () => {
    return (
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
    );
  };

  const _renderHeadingInfo = () => {
    return (
      <Flex className="app-info">
        <AppHeading title={appInfo.name} linkBack={'/'} />

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
            px={isMobile ? 2.5 : 4}
            variant="cancel"
            onClick={() => history.push(`/apps/${appId}/settings`)}
          >
            <Box className="icon-settings" mr={isMobile ? 0 : 2} />
            {isMobile ? '' : 'Setting'}
          </AppButton>
        </Flex>
      </Flex>
    );
  };

  return (
    <BasePageContainer className="app-detail">
      <>
        {_renderHeadingInfo()}

        <PartAppStatics
          totalWebhookActive={appInfo?.totalRegistrationActive}
          totalWebhook={appInfo?.totalRegistration}
        />

        {_renderListWebhook()}

        <PartAppGraph />
      </>
    </BasePageContainer>
  );
};

export default AppDetail;
