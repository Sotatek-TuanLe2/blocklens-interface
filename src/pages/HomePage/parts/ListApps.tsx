import { Box, Flex, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState, FC, useCallback, useEffect } from 'react';
import { AppButton, AppCard, AppDataTable } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { IListAppResponse } from 'src/utils/common';
import { useHistory } from 'react-router';
import {
  getLogoChainByChainId,
  getNameChainByChainId,
} from 'src/utils/utils-network';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import ModalUpgradeCreateApp from 'src/modals/ModalUpgradeCreateApp';
import { isMobile } from 'react-device-detect';

interface IListApps {
  totalApps: number;
  searchListApp: any;
  setOpenModalCreateApp: () => void;
}

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
      <Box className={`${isOpen ? 'open' : ''} card-mobile`}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box
            className="name-mobile"
            onClick={() => history.push(`/apps/${app.appId}`)}
          >
            {app.name}
          </Box>
          <Box
            className={isOpen ? 'icon-minus' : 'icon-plus'}
            onClick={() => setIsOpen(!isOpen)}
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
              <Box className="value">--</Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Number of webhook</Box>
              <Box className="value">--</Box>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
};

const ListApps: React.FC<IListApps> = ({
  totalApps,
  setOpenModalCreateApp,
  searchListApp,
}) => {
  const history = useHistory();
  const { myPlan } = useSelector((state: RootState) => state.billing);
  const [appStat, setAppStat] = useState<any>({});
  const [openModalUpgradeCreateApp, setOpenModalUpgradeCreateApp] =
    useState<boolean>(false);

  const fetchDataTable: any = async (param: any) => {
    try {
      const res: IListAppResponse = await rf
        .getRequest('AppRequest')
        .getListApp(param);
      return res;
    } catch (error) {
      return error;
    }
  };

  const getAppStatOfUser = useCallback(async () => {
    try {
      const res = await rf.getRequest('AppRequest').getAppStatsOfUser();
      setAppStat(res);
    } catch (error: any) {
      setAppStat([]);
    }
  }, []);

  useEffect(() => {
    getAppStatOfUser().then();
  }, []);

  const onCreateApp = () => {
    if (
      myPlan?.appLimitation &&
      appStat?.totalAppActive &&
      appStat?.totalAppActive >= myPlan?.appLimitation
    ) {
      setOpenModalUpgradeCreateApp(true);
      return;
    }

    setOpenModalCreateApp();
  };

  const _renderHeader = () => {
    if (isMobile) return;

    return (
      <Thead className="header-list">
        <Tr>
          <Th>NAME</Th>
          <Th>NETWORK</Th>
          <Th textAlign={'center'}>Messages today</Th>
          <Th textAlign={'center'}>number of webhook</Th>
          <Th textAlign={'right'}>Status</Th>
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
              <Td>{app.name}</Td>
              <Td>{_renderChainApp(app.chain, app.network.toLowerCase())}</Td>
              <Td textAlign={'center'}>--</Td>
              <Td textAlign={'center'}>--</Td>
              <Td textAlign={'right'}>{_renderStatus(app.status)}</Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  const _renderTotalApp = () => {
    return (
      <Box className="number-app">
        <Text as={'span'}>Active Apps:</Text> {appStat?.totalAppActive}/
        {totalApps}
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
            <AppButton
              size={'sm'}
              px={4}
              py={1}
              className={'btn-create'}
              onClick={onCreateApp}
            >
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
          requestParams={searchListApp}
          fetchData={fetchDataTable}
          renderBody={_renderBody}
          renderHeader={_renderHeader}
          limit={10}
        />
      </AppCard>

      {openModalUpgradeCreateApp && (
        <ModalUpgradeCreateApp
          open={openModalUpgradeCreateApp}
          onClose={() => setOpenModalUpgradeCreateApp(false)}
        />
      )}
    </Box>
  );
};

export default ListApps;
