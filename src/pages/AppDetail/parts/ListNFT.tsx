import { Flex, Tbody, Th, Thead, Tr, Td, Box } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import React from 'react';
import { useHistory } from 'react-router';
import { AppButton, AppCard, AppDataTable } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { IAppResponse, IListAppResponse } from 'src/utils/common';

const ListNTF = () => {
  const history = useHistory();

  const fetchDataTable: any = async (params: any) => {
    try {
      const res: IListAppResponse = await rf
        .getRequest('RegistrationRequest')
        .getNFTActivity(params);
      return res;
    } catch (error) {
      return error;
    }
  };

  const _renderHeader = () => {
    return (
      <Thead>
        <Tr>
          <Th>Version</Th>
          <Th>ID</Th>
          <Th>Network</Th>
          <Th>Status</Th>
          <Th>Webhook URL</Th>
          <Th>Nfts</Th>
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
              <Td>{app.network}</Td>
              <Td>{app.description || ''}</Td>
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
    <AppCard mt={10} className="list-nft" p={0} pb={5}>
      <Flex justifyContent="space-between" py={5} px={8} alignItems="center">
        <Flex alignItems="center">
          <Box className="icon-app-nft" mr={4} />
          <Box className="name">
            NFT Activity
            <Box
              className="description"
              textTransform="uppercase"
              fontSize={'13px'}
            >
              Get notified when an NFT is transferred
            </Box>
          </Box>
        </Flex>
        <AppButton textTransform="uppercase">
          <SmallAddIcon /> Create webhook
        </AppButton>
      </Flex>
      <AppDataTable
        fetchData={fetchDataTable}
        renderBody={_renderBody}
        renderHeader={_renderHeader}
        limit={10}
      />
    </AppCard>
  );
};

export default ListNTF;
