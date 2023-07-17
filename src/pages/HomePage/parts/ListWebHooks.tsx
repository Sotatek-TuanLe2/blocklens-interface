import { Box, Flex, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState, FC } from 'react';
import {
  AppButton,
  AppCard,
  AppDataTable,
  AppLoadingTable,
} from 'src/components';
import rf from 'src/requests/RequestFactory';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { useHistory } from 'react-router';
import {
  getLogoChainByChainId,
  getNameChainByChainId,
} from 'src/utils/utils-network';
import { isMobile } from 'react-device-detect';
import ModalCreateApp from 'src/modals/ModalCreateApp';
import useUser from 'src/hooks/useUser';

interface IAppMobile {
  app: IAppResponse;
}

export const _renderStatus = (status?: APP_STATUS) => {
  const isActive = status === APP_STATUS.ENABLE;

  return (
    <Box className={`status ${isActive ? 'active' : 'inactive'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </Box>
  );
};

const _renderChainApp = (chain: string, network: string) => {
  return (
    <Flex alignItems={'center'}>
      <Box className={getLogoChainByChainId(chain) || ''} mr={2.5} />
      <Box mr={1}>{getNameChainByChainId(chain)}</Box>
      <Box textTransform="capitalize"> {network}</Box>
    </Flex>
  );
};

interface IButtonCreateApp {
  onReload: () => void;
}

const ButtonCreateApp: FC<IButtonCreateApp> = ({ onReload }) => {
  const [openCreateApp, setOpenCreateApp] = useState(false);

  const _renderModalCreateApp = () => {
    return (
      <ModalCreateApp
        reloadData={onReload}
        open={openCreateApp}
        onClose={() => setOpenCreateApp(false)}
      />
    );
  };

  return (
    <>
      <AppButton size={'sm'} onClick={() => setOpenCreateApp(true)}>
        <Box className="icon-plus-circle" mr={2} /> Create
      </AppButton>
      {openCreateApp && _renderModalCreateApp()}
    </>
  );
};

const AppMobile: FC<IAppMobile> = ({ app }) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Box
        className={`${isOpen ? 'open' : ''} card-mobile`}
        onClick={() => history.push(`/app/${app.appId}`)}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box className="name-mobile">{app.name}</Box>
          <Box
            className={isOpen ? 'icon-minus' : 'icon-plus'}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          />
        </Flex>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box>Status</Box>
          <Box>{_renderStatus(app.status)}</Box>
        </Flex>

        {isOpen && (
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Network</Box>
              <Box className="value">
                {_renderChainApp(app.chain, app.network.toLowerCase())}
              </Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Message today</Box>
              <Box className="value">{app.messageToday}</Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Number of webhook</Box>
              <Box className="value">{app.totalWebhook}</Box>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
};

const ListWebHooksHomePage: React.FC = () => {
  const history = useHistory();
  const { user } = useUser();
  // const userPlan = user?.getPlan();
  const userStats = user?.getStats();

  const [params, setParams] = useState({});

  const getTotalWebhookEachApp = async (appIds: string) => {
    try {
      const res: any = await rf
        .getRequest('AppRequest')
        .getTotalWebhookEachApp({
          appIds,
        });
      return res;
    } catch (error) {
      return error;
    }
  };

  const getAppMetricToday = async (appIds: string[]) => {
    try {
      const res: any = await rf
        .getRequest('NotificationRequest')
        .getAppMetricToday({ appIds });
      return res;
    } catch (error) {
      return [];
    }
  };

  const fetchDataTable: any = async (param: any) => {
    try {
      const res: any = await rf.getRequest('AppRequest').getListApp(param);
      const appIds = res?.docs?.map((item: IAppResponse) => item?.appId) || [];
      const totalWebhooks = await getTotalWebhookEachApp(
        appIds.join(',').toString(),
      );
      const appsMetric = await getAppMetricToday(appIds);

      const dataApps = await Promise.all(
        res?.docs?.map(async (app: IAppResponse, index: number) => {
          const appMetricToday = appsMetric.find(
            (item: any) => item.appId === app.appId,
          );

          return {
            ...app,
            totalWebhook: totalWebhooks[index]?.totalRegistration || '--',
            messageToday: appMetricToday?.message || '--',
          };
        }),
      );

      return {
        ...res,
        docs: dataApps,
      };
    } catch (error) {
      return error;
    }
  };

  const _renderHeader = () => {
    if (isMobile) return;

    return (
      <Thead className="header-list">
        <Tr>
          <Th w="25%">NAME</Th>
          <Th w="20%">TYPE</Th>
          <Th w="20%">Network</Th>
          <Th w="20%" textAlign={'center'}>
            Messages today
          </Th>
          <Th w="15%" textAlign={'right'}>
            Status
          </Th>
        </Tr>
      </Thead>
    );
  };

  const _renderLoading = () => {
    const widthColumns = [25, 20, 20, 20, 15];
    return <AppLoadingTable widthColumns={widthColumns} />;
  };

  const _renderListAppMobile = (data?: IAppResponse[]) => {
    return (
      <Box className="list-card-mobile">
        {data?.map((app: IAppResponse, index: number) => {
          return <AppMobile app={app} key={index} />;
        })}
      </Box>
    );
  };

  const _renderBody = (data?: IAppResponse[]) => {
    if (isMobile) return _renderListAppMobile(data);
    return (
      <Tbody>
        {data?.map((app: IAppResponse, index: number) => {
          return (
            <Tr
              key={index}
              className="tr-list"
              onClick={() => history.push(`/app/${app.appId}`)}
            >
              <Td w="25%">{app.name}</Td>
              <Td w="20%">This is type</Td>
              <Td w="20%">
                {_renderChainApp(app.chain, app.network.toLowerCase())}
              </Td>
              <Td w="20%" textAlign={'center'}>
                {app?.messageToday}
              </Td>
              <Td w="15%" textAlign={'right'}>
                {_renderStatus(app.status)}
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  const _renderTotalApp = () => {
    return (
      <Box className="number-app">
        {userStats?.totalAppActive}/{userStats?.totalApp}
        <span> </span>active
      </Box>
    );
  };

  return (
    <Box className="list-app-hp">
      <AppCard className="list-table-wrap">
        <Flex className="title-list-app">
          <Text className="text-title">Webhooks</Text>
          <Flex alignItems={'center'}>
            {!isMobile && _renderTotalApp()}
            <ButtonCreateApp onReload={() => setParams({ ...params })} />
          </Flex>
        </Flex>

        {isMobile && (
          <Box px={5} mb={3}>
            {_renderTotalApp()}
          </Box>
        )}

        <AppDataTable
          requestParams={{ ...params }}
          renderLoading={_renderLoading}
          fetchData={fetchDataTable}
          renderBody={_renderBody}
          renderHeader={_renderHeader}
          limit={10}
        />
      </AppCard>
    </Box>
  );
};

export default ListWebHooksHomePage;
