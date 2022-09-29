import { Flex, Tbody, Text, Th, Thead, Tr, Td } from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router';
import { AppCard, AppDataTable } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { IAppResponse, IListAppResponse } from 'src/utils/common';
import { BasePageContainer } from 'src/layouts/';

const LogsPage = () => {
  const { id: appId } = useParams<{ id: string }>();

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

  const _renderHeader = () => {
    return (
      <Thead className="header-list-app">
        <Tr>
          <Th>Schedule Time</Th>
          <Th>Start Time</Th>
          <Th>End Time</Th>
          <Th>Excution Time (second)</Th>
          <Th>HTTP Code</Th>
          <Th>Status</Th>
          <Th>Output</Th>
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
              <Td>n/a</Td>
              <Td>n/a</Td>
              <Td>n/a</Td>
              <Td>n/a</Td>
              <Td>n/a</Td>
              <Td>n/a</Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  return (
    <BasePageContainer>
      <>
        <Text fontSize={'24px'} mb={8}>
          Logs
        </Text>
        <AppCard className="list-app-table-wrap">
          <AppDataTable
            fetchData={fetchDataTable}
            renderBody={_renderBody}
            renderHeader={_renderHeader}
            limit={10}
          />
        </AppCard>
      </>
    </BasePageContainer>
  );
};

export default LogsPage;
