import { Box, Flex, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppButton, AppCard, AppDataTable } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { IListAppResponse } from 'src/utils/common';
import { useHistory } from 'react-router';
import { getLogoChainByName } from 'src/utils/utils-network';
import { SmallAddIcon } from '@chakra-ui/icons';

interface IListApps {
  totalApps: number;
  searchListApp: any;
  setOpenModalCreateApp: () => void;
}

export const _renderStatus = (status?: APP_STATUS) => {
  const isActive = status === APP_STATUS.ENABLE;

  return (
    <Box className={`status ${isActive ? 'active' : 'inactive'}`}>
      {isActive ? 'ACTIVE' : 'INACTIVE'}
    </Box>
  );
};

const ListApps: React.FC<IListApps> = ({
  totalApps,
  setOpenModalCreateApp,
  searchListApp,
}) => {
  const history = useHistory();
  const [totalAppActive, setTotalAppActive] = useState<number | undefined>(0);
    useState<boolean>(false);

  const fetchDataTable: any = async (param: any) => {
    try {
      const res: IListAppResponse = await rf
        .getRequest('AppRequest')
        .getListApp(param);
      setTotalAppActive(res?.totalAppActive);
      return res;
    } catch (error) {
      return error;
    }
  };

  const _renderHeader = () => {
    return (
      <Thead className="header-list-app">
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

  const _renderBody = (data?: IAppResponse[]) => {
    return (
      <Tbody>
        {data?.map((app: IAppResponse, index: number) => {
          return (
            <Tr
              key={index}
              className="tr-list-app"
              onClick={() => history.push(`/app-detail/${app.appId}`)}
            >
              <Td>{app.name}</Td>
              <Td>
                <Flex alignItems={'center'}>
                  <Box
                    className={getLogoChainByName(app.chain) || ''}
                    mr={2.5}
                  />
                  {app.chain}
                </Flex>
              </Td>
              <Td textAlign={'center'}>N/A</Td>
              <Td textAlign={'center'}>N/A</Td>
              <Td textAlign={'right'}>{_renderStatus(app.status)}</Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  return (
    <Box className="list-app-hp">
      <AppCard className="list-app-table-wrap">
        <Flex className="title-list-app">
          <Text className="text-title">Apps</Text>
          <Flex alignItems={'center'}>
            <Box className="number-app">
              <Text as={'span'}>Active Apps:</Text> {totalAppActive} /{' '}
              {totalApps}
            </Box>

            <AppButton
              size={'sm'}
              px={4}
              py={1}
              className={'btn-create'}
              onClick={setOpenModalCreateApp}
            >
              <Box className="icon-plus-circle" mr={2} /> Create
            </AppButton>
          </Flex>
        </Flex>
        <AppDataTable
          requestParams={searchListApp}
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
