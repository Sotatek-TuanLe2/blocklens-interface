import { Flex, Tbody, Th, Thead, Tr, Td, Box, Tag } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { AppButton, AppCard, AppDataTable, AppLink } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { IListAppResponse } from 'src/utils/common';
import ModalCreateWebhookNFT from 'src/modals/ModalCreateWebhookNFT';
import { IAppInfo } from '../index';

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
  const [totalWebhook, setTotalWebhook] = useState<any>();

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      const res: IListAppResponse = await rf
        .getRequest('RegistrationRequest')
        .getNFTActivity(params);
      setTotalWebhook(res.totalDocs);
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
          <Th>Status</Th>
          <Th>Webhook URL</Th>
          <Th>Address</Th>
          <Th>Activities</Th>
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

  const _renderBody = (data?: INFTResponse[]) => {
    return (
      <Tbody>
        {data?.map((nft: INFTResponse, index: number) => {
          return (
            <Tr key={index}>
              <Td>{nft.registrationId}</Td>
              <Td>{_renderStatus(nft)}</Td>
              <Td>{nft.webhook}</Td>
              <Td>N/A Address</Td>
              <Td>
                <AppLink to={`/webhook-activities/${nft.registrationId}`}>
                  View
                </AppLink>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  const _renderNoData = () => {
    return (
      <Flex alignItems={'center'} my={10} flexDirection={'column'}>
        Set up your first NFT activity webhook!
        <Box
          className="button-create-webhook"
          mt={2}
          onClick={() => setIsOpenCreateNFTModal(true)}
        >
          + Create webhook
        </Box>
      </Flex>
    );
  };

  return (
    <>
      <AppCard mt={10} className="list-nft" p={0}>
        <Flex justifyContent="space-between" py={5} px={8} alignItems="center">
          <Flex alignItems="center">
            <Box className="icon-app-nft" mr={4} />
            <Box className="name">
              NFT Activity
              <Box className="description">
                Get notified when an NFT is transferred
              </Box>
            </Box>
          </Flex>
          <AppButton
            textTransform="uppercase"
            size={'md'}
            fontWeight={'400'}
            onClick={() => setIsOpenCreateNFTModal(true)}
          >
            <SmallAddIcon mr={1} /> Create webhook
          </AppButton>
        </Flex>

        <Box bgColor={'#FAFAFA'} borderBottomRadius={'10px'} pb={8}>
          <AppDataTable
            requestParams={params}
            fetchData={fetchDataTable}
            renderBody={_renderBody}
            isNotShowNoData
            renderHeader={totalWebhook > 0 ? _renderHeader : undefined}
            limit={10}
          />

          {totalWebhook === 0 && _renderNoData()}
        </Box>
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
