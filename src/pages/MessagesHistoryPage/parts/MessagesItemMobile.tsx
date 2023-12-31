import React, { FC, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { IWebhook, WEBHOOK_TYPES, IMessages } from 'src/utils/utils-webhook';
import {
  formatShortText,
  formatTimestamp,
  shortAddressType,
} from 'src/utils/utils-helper';
import { LinkIcon } from 'src/assets/icons';
import { AppButton } from 'src/components';
import ReactJson from 'react-json-view';
import { StatusMessages } from './MessageItem';
import { getExplorerTxUrl } from 'src/utils/utils-network';
import { Scrollbars } from 'react-custom-scrollbars';

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
                {message.input?.tx?.tokenIds?.join(', ') || '*'}
              </Flex>
            </Box>
          </Flex>
        </>
      );
    }

    if (webhook.type === WEBHOOK_TYPES.APTOS_COIN_ACTIVITY) {
      return (
        <>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            className="info"
          >
            <Box>Coin Type</Box>
            <Box className="value">
              <Flex alignItems="center">
                {shortAddressType(webhook?.metadata?.coinType || '')}
              </Flex>
            </Box>
          </Flex>
        </>
      );
    }

    if (webhook.type === WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY) {
      return (
        <>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            className="info"
          >
            <Box>Token Data</Box>
            <Box className="value">
              <Flex alignItems="center">
                {`${formatShortText(
                  webhook?.metadata?.creatorAddress || '',
                )}::${webhook?.metadata?.collectionName}${
                  webhook?.metadata?.name ? `::${webhook?.metadata?.name}` : ''
                }`}
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
            <Scrollbars
              style={{ width: '100%', height: 210 }}
              autoHide
              renderThumbVertical={({ style, ...props }: any) => (
                <div
                  style={{
                    ...style,
                    backgroundColor: '#8D91A5',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  {...props}
                />
              )}
              renderThumbHorizontal={({ style, ...props }: any) => (
                <div
                  style={{
                    ...style,
                    backgroundColor: '#8D91A5',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  {...props}
                />
              )}
            >
              <ReactJson
                theme="summerfruit:inverted"
                name={false}
                src={message.input}
                displayDataTypes={false}
                collapsed={1}
                shouldCollapse={false}
                displayObjectSize={false}
              />
            </Scrollbars>
          </Box>
        </Box>
        <Box>
          <Box className="label-detail">output</Box>
          <Box className="content-detail">
            <Scrollbars
              style={{ width: '100%', height: 210 }}
              autoHide
              renderThumbVertical={({ style, ...props }: any) => (
                <div
                  style={{
                    ...style,
                    backgroundColor: '#8D91A5',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  {...props}
                />
              )}
              renderThumbHorizontal={({ style, ...props }: any) => (
                <div
                  style={{
                    ...style,
                    backgroundColor: '#8D91A5',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  {...props}
                />
              )}
            >
              <ReactJson
                name={false}
                theme="summerfruit:inverted"
                src={message.output}
                displayDataTypes={false}
                collapsed={1}
                shouldCollapse={false}
                displayObjectSize={false}
              />
            </Scrollbars>
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
              <Box>{message?.block || '--'}</Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>TXN ID</Box>
              <Box className="value">
                <Flex alignItems="center">
                  {formatShortText(message?.tnxId)}
                  {message?.tnxId && (
                    <Box ml={2}>
                      <a
                        href={getExplorerTxUrl(
                          message?.input?.chain,
                          message?.input?.network,
                          message?.tnxId,
                        )}
                        className="link-redirect"
                        target="_blank"
                      >
                        <LinkIcon />
                      </a>
                    </Box>
                  )}
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
                    variant="brand"
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
