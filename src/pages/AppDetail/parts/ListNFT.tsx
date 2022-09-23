import { Flex, Tbody, Th, Thead, Tr, Td, Box, Tag } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AppButton, AppCard, AppDataTable } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { IAppResponse, IListAppResponse } from 'src/utils/common';
import CreateNFTActivityModal from 'src/modals/CreateNFTActivityModal';
import { IAppInfo } from '../index';
import { getLogoChainByName } from 'src/utils/utils-network';

interface IListNTF {
  appInfo: IAppInfo;
}

interface IParams {
  appId?: number;
}

interface INFTResponse {
  userId: number;
  registrationId: number;
  network: string;
  type: string;
  contractAddress: string;
  tokenIds: string[];
}

const ListNTF: FC<IListNTF> = ({ appInfo }) => {
  const [isOpenCreateNFTModal, setIsOpenCreateNFTModal] =
    useState<boolean>(false);
  const [params, setParams] = useState<IParams>({});

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      const res: IListAppResponse = await rf
        .getRequest('RegistrationRequest')
        .getNFTActivity(params);
      return res;
    } catch (error) {
      return error;
    }
  }, []);

  useEffect(() => {
    setParams({
      ...params,
      appId: appInfo.appId,
    });
  }, [appInfo]);

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

  const _renderStatus = () => {
    return (
      <Tag
        size={'sm'}
        borderRadius="full"
        variant="solid"
        colorScheme="green"
        px={5}
      >
        ACTIVE
      </Tag>
    );
  };

  const _renderVersion = () => {
    return (
      <Tag
        size={'sm'}
        borderRadius="full"
        variant="solid"
        colorScheme="green"
        px={5}
      >
        V1
      </Tag>
    );
  };

  const _renderNetwork = (nft: INFTResponse) => {
    return (
      <Flex alignItems={'center'}>
        <Box mr={2} className={getLogoChainByName(appInfo.chain)}></Box>
        {nft.network}
      </Flex>
    );
  };

  const _renderBody = (data?: INFTResponse[]) => {
    return (
      <Tbody>
        {data?.map((nft: INFTResponse, index: number) => {
          return (
            <Tr key={index}>
              <Td>{_renderVersion()}</Td>
              <Td>N/A</Td>
              <Td>{_renderNetwork(nft)}</Td>
              <Td>{_renderStatus()}</Td>
              <Td>N/A</Td>
              <Td>N/A</Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  return (
    <>
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
          <AppButton
            textTransform="uppercase"
            size={'md'}
            onClick={() => setIsOpenCreateNFTModal(true)}
          >
            <SmallAddIcon mr={1} /> Create webhook
          </AppButton>
        </Flex>
        <AppDataTable
          requestParams={params}
          fetchData={fetchDataTable}
          renderBody={_renderBody}
          renderHeader={_renderHeader}
          limit={10}
        />
      </AppCard>

      <CreateNFTActivityModal
        open={isOpenCreateNFTModal}
        onClose={() => setIsOpenCreateNFTModal(false)}
        appInfo={appInfo}
        onReloadData={() =>
          setParams((pre: any) => {
            return { ...pre };
          })
        }
      />
    </>
  );
};

export default ListNTF;
