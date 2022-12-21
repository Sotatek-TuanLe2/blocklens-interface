import React, { FC, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { IWebhook, WEBHOOK_TYPES, IMessages } from 'src/utils/utils-webhook';
import { formatShortText, formatTimestamp } from 'src/utils/utils-helper';
import { LinkIcon } from 'src/assets/icons';
import { AppButton } from 'src/components';
import ReactJson from 'react-json-view';
import { StatusMessages } from './MessageItem';
import { getBlockExplorerUrl } from 'src/utils/utils-network';

interface IMessagesItemMobile {
  message: IMessages;
  webhook: IWebhook;
}

const MessagesItemMobile: FC<IMessagesItemMobile> = ({
  message,
  webhook,
}: any) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);

  const _renderInfos = () => {
    const _renderInfoContractActivity = () => {
      return (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box>Method</Box>
          <Box className="value">
            <Flex alignItems="center">{message.input?.method}</Flex>
          </Box>
        </Flex>
      );
    };

    if (webhook.type === WEBHOOK_TYPES.CONTRACT_ACTIVITY) {
      return _renderInfoContractActivity();
    }

    if (webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY) {
      return (
        <>
          {_renderInfoContractActivity()}
          <Flex
            justifyContent="space-between"
            alignItems="center"
            className="info"
          >
            <Box>Token ID</Box>
            <Box className="value">
              <Flex alignItems="center">
                {message.input?.tokenId || '--'}
              </Flex>
            </Box>
          </Flex>
        </>
      );
    }

    return (
      <Flex justifyContent="space-between" alignItems="center" className="info">
        <Box>Address</Box>
        <Box className="value">
          <Flex alignItems="center">
            {formatShortText(message?.input?.trackingAddress)}
          </Flex>
        </Box>
      </Flex>
    );
  };

  const _renderDetail = () => {
    return (
      <Box className="box-detail">
        <Box>
          <Box className="label-detail">input</Box>
          <Box className="content-detail">
            <ReactJson
              theme="monokai"
              name={false}
              src={message.input}
              displayDataTypes={false}
              collapsed={false}
              displayObjectSize={false}
            />
          </Box>
        </Box>
        <Box>
          <Box className="label-detail">output</Box>
          <Box className="content-detail">
            <ReactJson
              name={false}
              theme="monokai"
              src={message.output}
              displayDataTypes={false}
              collapsed={false}
              displayObjectSize={false}
            />
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box className={`${isOpen ? 'open' : ''} card-mobile`}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box className="name-mobile">
            {formatTimestamp(message.createdAt * 1000, 'YYYY-MM-DD HH:mm:ss')}{' '}
            UTC
          </Box>
          <Box
            className={isOpen ? 'icon-minus' : 'icon-plus'}
            onClick={() => {
              setIsOpen(!isOpen);
              setIsShowDetail(false);
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
            <StatusMessages message={message} />
          </Box>
        </Flex>

        {isOpen && (
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Block</Box>
              <Box>{message?.input?.tx?.blockNumber}</Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>TXN ID</Box>
              <Box className="value">
                <Flex alignItems="center">
                  {formatShortText(message?.input?.tx?.transactionHash)}
                  <Box ml={2}>
                    <a
                      href={`${
                        getBlockExplorerUrl(
                          message?.input?.chain,
                          message?.input?.network,
                        ) + `tx/${message?.input?.tx?.transactionHash}`
                      }`}
                      className="link-redirect"
                      target="_blank"
                    >
                      <LinkIcon />
                    </a>
                  </Box>
                </Flex>
              </Box>
            </Flex>
            {_renderInfos()}

            {isShowDetail ? (
              _renderDetail()
            ) : (
              <Flex flexWrap={'wrap'} my={2} justifyContent={'center'}>
                <Box width={'48%'}>
                  <AppButton
                    variant="cancel"
                    size="sm"
                    w={'100%'}
                    onClick={() => setIsShowDetail(true)}
                  >
                    More Details
                  </AppButton>
                </Box>
              </Flex>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default MessagesItemMobile;
