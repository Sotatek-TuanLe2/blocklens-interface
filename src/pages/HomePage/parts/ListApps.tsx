import {
  Flex,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Td,
  Box,
  Badge,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppCard, AppDataTable, AppLink } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { IAppResponse, IListAppResponse } from 'src/utils/common';

interface IListApps {
  searchListApp: any;
}

const ListApps: React.FC<IListApps> = ({ searchListApp }) => {
  const [totalApps, setTotalApps] = useState<number>(0);
  const fetchDataTable: any = async (param: any) => {
    try {
      const res: IListAppResponse = await rf
        .getRequest('AppRequest')
        .getListApp(param);
      setTotalApps(res?.totalDocs);
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
          <Th>Description</Th>
          <Th textAlign={'right'}>Days on Blocklens</Th>
          <Th>Status</Th>
          <Th>ACTIONS</Th>
        </Tr>
      </Thead>
    );
  };

  const _renderBody = (data?: IAppResponse[]) => {
    return (
      <Tbody>
        {data?.map((app: IAppResponse, index: number) => {
          return (
            <Tr key={index} className="tr-list-app">
              <Td>
                <AppLink to={`/app-detail/${app.appId}`}>{app.name}</AppLink>
              </Td>
              <Td>{app.chain + ' ' + app.network}</Td>
              <Td>{app.description || ''}</Td>
              <Td textAlign={'right'}>N/A</Td>
              <Td>N/A</Td>
              <Td>N/A</Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  return (
    <Box className="list-app-hp">
      <Flex className="title-list-app">
        <Text className="text-title">Apps</Text>
        <div>
          <Text as={'span'} mr={5}>
            ACTIVE APPS
          </Text> N/A / {totalApps}
        </div>
      </Flex>
      <AppCard className="list-app-table-wrap">
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
