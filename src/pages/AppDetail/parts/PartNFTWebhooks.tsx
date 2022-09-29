import { Flex, Tbody, Th, Thead, Tr, Td, Box, Tag } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { AppButton, AppCard, AppDataTable, AppLink } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { IListAppResponse } from 'src/utils/common';
import ModalCreateWebhookNFT from 'src/modals/ModalCreateWebhookNFT';
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
  webhook: string;
  status?: string;
  contractAddress: string;
  tokenIds: string[];
}

const PartNFTWebhooks: FC<IListNTF> = ({ appInfo }) => {
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
          <Th>ID</Th>
          <Th>Network</Th>
          <Th>Status</Th>
          <Th>Webhook URL</Th>
          <Th>Nfts</Th>
        </Tr>
      </Thead>
    );
  };

  const _renderStatus = (nft: INFTResponse) => {
    if (!nft.status) return 'N/A';
    return (
      <Tag
        size={'sm'}
        borderRadius="full"
        variant="solid"
        colorScheme="green"
        px={5}
      >
        {nft.status}
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
              <Td>
                <AppLink to={`/log/nft.registrationId`}>{nft.registrationId}</AppLink>
              </Td>
              <Td>{_renderNetwork(nft)}</Td>
              <Td>{_renderStatus(nft)}</Td>
              <Td>{nft.webhook}</Td>
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

      <ModalCreateWebhookNFT
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

export default PartNFTWebhooks;
