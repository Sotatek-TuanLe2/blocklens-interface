import { Box, Flex, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { FC, useCallback, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { LinkIcon } from 'src/assets/icons';
import { AppCard, AppDataTable, AppLoadingTable } from 'src/components';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/AppDetail.scss';
import { formatShortText, formatTimestamp } from 'src/utils/utils-helper';
import {
  getExplorerTxUrl,
  getLogoChainByChainId,
  getNameChainByChainId,
} from 'src/utils/utils-network';

interface ITopUp {
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  userId: string;
  senderAddress: string;
  chain: string;
  network: string;
  amount: number;
  currencyContract: string;
  currencySymbol: string;
}

interface ITopUpItemMobile {
  topUp: ITopUp;
}

const TopUpItemMobile: FC<ITopUpItemMobile> = ({ topUp }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Box className={`${isOpen ? 'open' : ''} card-mobile`}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box className="name-mobile">
            {formatTimestamp(topUp?.blockTimestamp * 1000, 'MMMM DD YYYY')}
          </Box>
          <Box
            className={isOpen ? 'icon-minus' : 'icon-plus'}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
        </Flex>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box>Network</Box>
          <Box className="value">
            <Flex>
              <Box className={getLogoChainByChainId(topUp.chain)} />
              <Box mx={2}>{getNameChainByChainId(topUp.chain)}</Box>
              <Box textTransform="capitalize">
                {topUp?.network?.toLowerCase()}
              </Box>
            </Flex>
          </Box>
        </Flex>

        {isOpen && (
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>TXN ID</Box>
              <Box className="value">
                <Flex>
                  <Box mr={2}>{formatShortText(topUp.transactionHash)}</Box>
                  <a
                    href={getExplorerTxUrl(
                      topUp.chain,
                      topUp.network,
                      topUp.transactionHash,
                    )}
                    className="link-redirect"
                    target="_blank"
                  >
                    <LinkIcon />
                  </a>
                </Flex>
              </Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Amount</Box>
              <Box className="value">{topUp.amount}</Box>
            </Flex>

            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Currency</Box>
              <Box className="value">{topUp.currencySymbol}</Box>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
};

const TopUpHistory = () => {
  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      return await rf.getRequest('UserRequest').getTopUpHistories(params);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const _renderHeader = () => {
    if (isMobile) return;

    return (
      <Thead className="header-list">
        <Tr>
          <Th w={'25%'}>Created AT</Th>
          <Th w={'20%'}>TXN ID</Th>
          <Th w={'20%'}>Network</Th>
          <Th w={'20%'} textAlign="center">
            Amount
          </Th>
          <Th w={'15%'} textAlign="center">
            Currency
          </Th>
        </Tr>
      </Thead>
    );
  };

  const _renderLoading = () => {
    const widthColumns = [25, 20, 20, 20, 15];
    return <AppLoadingTable widthColumns={widthColumns} />;
  };

  const _renderBody = (data?: ITopUp[]) => {
    if (isMobile) {
      return (
        <Box className="list-card-mobile">
          {data?.map((topUp: ITopUp, index: number) => {
            return <TopUpItemMobile topUp={topUp} key={index} />;
          })}
        </Box>
      );
    }

    return data?.map((item: ITopUp, index: number) => {
      return (
        <Tbody key={index}>
          <Tr className={`tr-list`}>
            <Td w={'25%'}>
              {formatTimestamp(item?.blockTimestamp * 1000, 'MMMM DD YYYY')}
            </Td>
            <Td w={'20%'}>
              <Flex>
                <Box mr={2}>{formatShortText(item.transactionHash)}</Box>
                <a
                  href={getExplorerTxUrl(
                    item.chain,
                    item.network,
                    item.transactionHash,
                  )}
                  className="link-redirect"
                  target="_blank"
                >
                  <LinkIcon />
                </a>
              </Flex>
            </Td>
            <Td w={'20%'}>
              <Flex>
                <Box className={getLogoChainByChainId(item.chain)} />
                <Box mx={2}>{getNameChainByChainId(item.chain)}</Box>
                <Box textTransform="capitalize">
                  {item?.network?.toLowerCase()}
                </Box>
              </Flex>
            </Td>
            <Td w={'20%'} textAlign="center">
              {item.amount}
            </Td>
            <Td w={'15%'} textAlign="center">
              {item.currencySymbol}
            </Td>
          </Tr>
        </Tbody>
      );
    });
  };

  return (
    <AppCard className="list-table-wrap">
      <Box className={'text-title'}>Top Up Histories</Box>
      <AppDataTable
        fetchData={fetchDataTable}
        renderBody={_renderBody}
        renderLoading={_renderLoading}
        renderHeader={_renderHeader}
        limit={10}
      />
    </AppCard>
  );
};

export default TopUpHistory;
