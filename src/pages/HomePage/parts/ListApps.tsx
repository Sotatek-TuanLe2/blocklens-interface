import { Box, Flex, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState, FC } from 'react';
import {
  AppButton,
  AppCard,
  AppChainNetwork,
  AppDataTable,
  AppLoadingTable,
  AppStatus,
} from 'src/components';
import rf from 'src/requests/RequestFactory';
import { IAppResponse } from 'src/utils/utils-app';
import { useHistory } from 'react-router';
// import ModalUpgradeCreateApp from 'src/modals/ModalUpgradeCreateApp';
import { isMobile } from 'react-device-detect';
import ModalCreateApp from 'src/modals/ModalCreateApp';
import useUser from 'src/hooks/useUser';
import { IAppStats } from 'src/pages/AppDetail/parts/PartAppStatics';

interface IAppMobile {
  app: IAppResponse;
}

interface IButtonCreateApp {
  onReload: () => void;
}

const ButtonCreateApp: FC<IButtonCreateApp> = ({ onReload }) => {
  const [openCreateApp, setOpenCreateApp] = useState(false);

  const _renderModalCreateApp = () => {
    // const isLimitApp =
    //   userPlan?.capacity.project &&
    //   !!userStats?.totalApp &&
    //   userStats?.totalApp >= userPlan?.capacity.project;
    // return isLimitApp ? (
    //   <ModalUpgradeCreateApp
    //     open={openCreateApp}
    //     onClose={() => setOpenCreateApp(false)}
    //   />
    // ) : (
    //   <ModalCreateApp
    //     reloadData={fetchDataTable}
    //     open={openCreateApp}
    //     onClose={() => setOpenCreateApp(false)}
    //   />
    // );

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
        onClick={() => history.push(`/app/${app.projectId}`)}
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
          <Box>
            <AppStatus status={app.status} />
          </Box>
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
                <AppChainNetwork chain={app.chain} network={app.network} />
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
  // const userPlan = user?.getPlan();
  const userStats = user?.getStats();

  const [params, setParams] = useState({});

  const fetchDataTable: any = async (param: any) => {
    try {
      const res: any = await rf.getRequest('AppRequest').getListApp(param);
      const projectIds =
        res?.docs?.map((item: IAppResponse) => item?.projectId) || [];

      const res24h: IAppStats[] = await rf
        .getRequest('NotificationRequest')
        .getAppStats24h(projectIds);

      const dataApps = res?.docs?.map((app: IAppResponse) => {
        const appMetricToday = res24h.find(
          (item: IAppStats) => item.projectId === app.projectId,
        );

        return {
          ...app,
          totalWebhook: app?.numOfWebhook || '--',
          messageToday: appMetricToday?.message || '--',
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

  const _renderHeader = () => {
    if (isMobile) return;

    return (
      <Thead className="header-list">
        <Tr>
          <Th w="25%">NAME</Th>
          <Th w="20%">NETWORK</Th>
          <Th w="20%" textAlign={'center'}>
            MSG (IN 24H)
          </Th>
          <Th w="20%" textAlign={'center'}>
            number of webhook
          </Th>
        </Tr>
      </Thead>
    );
  };

  const _renderLoading = () => {
    const widthColumns = [25, 20, 20, 20];
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
              onClick={() => history.push(`/app/${app.projectId}`)}
            >
              <Td w="25%">{app.name}</Td>
              <Td w="20%">
                <AppChainNetwork chain={app.chain} network={app.network} />
              </Td>
              <Td w="20%" textAlign={'center'}>
                {app?.messageToday}
              </Td>
              <Td w="20%" textAlign={'center'}>
                {app?.totalWebhook}
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  return (
    <Box className="list-app-hp">
      <AppCard className="list-table-wrap">
        <Flex className="title-list-app">
          <Text className="text-title">Projects</Text>
          <Flex alignItems={'center'}>
            <ButtonCreateApp onReload={() => setParams({ ...params })} />
          </Flex>
        </Flex>
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

export default ListApps;
