import { Box, Flex, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState, FC, useRef } from 'react';
import { AppButton, AppCard, AppDataTable, DataTableRef } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { useHistory } from 'react-router';
import {
  getLogoChainByChainId,
  getNameChainByChainId,
} from 'src/utils/utils-network';
import ModalUpgradeCreateApp from 'src/modals/ModalUpgradeCreateApp';
import { isMobile } from 'react-device-detect';
import ModalCreateApp from '../../../modals/ModalCreateApp';
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

const AppMobile: FC<IAppMobile> = ({ app }) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Box
        className={`${isOpen ? 'open' : ''} card-mobile`}
        onClick={() => history.push(`/apps/${app.appId}`)}
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

const ListApps: React.FC = () => {
  const history = useHistory();
  const { user } = useUser();
  const userPlan = user?.getPlan();
  const userStats = user?.getStats();

  const [openCreateApp, setOpenCreateApp] = useState(false);

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

  const getAppMetricToday = async (appIds: string) => {
    try {
      const res: any = await rf
        .getRequest('NotificationRequest')
        .getAppMetricToday({
          appIds,
        });
      return res;
    } catch (error) {
      return error;
    }
  };

  const dataTableRef = useRef<DataTableRef>();

  const fetchDataTable: any = async (param: any) => {
    try {
      const res: any = await rf.getRequest('AppRequest').getListApp(param);
      const appIds = res.docs.map((item: IAppResponse) => item?.appId) || [];
      const appMetric = await getAppMetricToday(appIds.join(',').toString());
      const totalWebhooks = await getTotalWebhookEachApp(
        appIds.join(',').toString(),
      );

      const dataApps = res?.docs.map((app: IAppResponse, index: number) => {
        return {
          ...app,
          totalWebhook: totalWebhooks[index].totalRegistration,
          messageToday: appMetric[index].message,
        };
      });

      return {
        ...res,
        docs: dataApps,
      };
    } catch (error) {
      return error;
    }
  };

  const onCreateApp = () => {
    setOpenCreateApp(true);
  };

  const _renderModalCreateApp = () => {
    const isLimitApp =
      userPlan?.appLimitation && !!userStats?.totalApp && userStats?.totalApp >= userPlan?.appLimitation;
    return isLimitApp ? (
      <ModalUpgradeCreateApp
        open={openCreateApp}
        onClose={() => setOpenCreateApp(false)}
      />
    ) : (
      <ModalCreateApp
        reloadData={() => dataTableRef.current?.fetchTableData()}
        open={openCreateApp}
        onClose={() => setOpenCreateApp(false)}
      />
    );
  };

  const _renderHeader = () => {
    if (isMobile) return;

    return (
      <Thead className="header-list">
        <Tr>
          <Th w="25%">NAME</Th>
          <Th w="20%">NETWORK</Th>
          <Th w="20%" textAlign={'center'}>
            Messages today
          </Th>
          <Th w="20%" textAlign={'center'}>
            number of webhook
          </Th>
          <Th w="15%" textAlign={'right'}>
            Status
          </Th>
        </Tr>
      </Thead>
    );
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
              onClick={() => history.push(`/apps/${app.appId}`)}
            >
              <Td w="25%">{app.name}</Td>
              <Td w="20%">
                {_renderChainApp(app.chain, app.network.toLowerCase())}
              </Td>
              <Td w="20%" textAlign={'center'}>
                {app?.messageToday}
              </Td>
              <Td w="20%" textAlign={'center'}>
                {app?.totalWebhook}
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
        <Text as={'span'}>Active Apps:</Text> {userStats?.totalAppActive}/{userStats?.totalApp}
      </Box>
    );
  };

  return (
    <Box className="list-app-hp">
      <AppCard className="list-table-wrap">
        <Flex className="title-list-app">
          <Text className="text-title">Apps</Text>
          <Flex alignItems={'center'}>
            {!isMobile && _renderTotalApp()}
            <AppButton size={'sm'} onClick={onCreateApp}>
              <Box className="icon-plus-circle" mr={2} /> Create
            </AppButton>
          </Flex>
        </Flex>
        {isMobile && (
          <Box px={5} mb={3}>
            {_renderTotalApp()}
          </Box>
        )}
        <AppDataTable
          //@ts-ignore
          ref={dataTableRef}
          fetchData={fetchDataTable}
          renderBody={_renderBody}
          renderHeader={_renderHeader}
          limit={10}
        />
      </AppCard>
      {_renderModalCreateApp()}
    </Box>
  );
};

export default ListApps;
