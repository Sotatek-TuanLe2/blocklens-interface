import React, { FC, MouseEvent, useState } from 'react';
import { Box, Flex, Tbody, Td, Th, Tr } from '@chakra-ui/react';
import {
  IMessages,
  IWebhook,
  STATUS,
  WEBHOOK_TYPES,
} from 'src/utils/utils-webhook';
import { formatShortText, formatTimestamp } from 'src/utils/utils-helper';
import { LinkIcon, ArrowDown } from 'src/assets/icons';
import ReactJson from 'react-json-view';
import { getBlockExplorerUrl } from 'src/utils/utils-network';
import { Scrollbars } from 'react-custom-scrollbars';

export const StatusMessages = ({ message }: any) => {
  if (!!message.status) {
    return (
      <Box
        className={`status ${
          message.status === STATUS.FAILED ? 'inactive' : 'active'
        }`}
      >
        {message.status}
      </Box>
    );
  }

  return <Box className={`status inactive`}>--</Box>;
};

interface IMessageItem {
  message: IMessages;
  webhook: IWebhook;
}

const MessageItem: FC<IMessageItem> = ({ message, webhook }: any) => {
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);

  const _renderContentContract = () => {
    return (
      <Td textAlign="left" w="15%">
        {message?.input?.method}
      </Td>
    );
  };

  const _renderContentNFT = () => {
    return (
      <>
        <Td textAlign="left" w="13%">
          {message?.input?.method}
        </Td>
        <Td textAlign="center" w="13%">
          {message?.input?.tokenIds || '*'}
        </Td>
      </>
    );
  };

  const _renderContentAddress = () => {
    return <Td w="15%">{formatShortText(message?.input?.trackingAddress)}</Td>;
  };

  const _renderContentActivities = () => {
    if (webhook?.type === WEBHOOK_TYPES.NFT_ACTIVITY) {
      return _renderContentNFT();
    }

    if (webhook?.type === WEBHOOK_TYPES.CONTRACT_ACTIVITY) {
      return _renderContentContract();
    }

    return _renderContentAddress();
  };

  const getNumberColspan = () => {
    if (webhook?.type === WEBHOOK_TYPES.NFT_ACTIVITY) {
      return 7;
    }

    if (webhook?.type === WEBHOOK_TYPES.CONTRACT_ACTIVITY) {
      return 6;
    }

    return 6;
  };

  const onRedirectToBlockExplorer = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    return;
  };

  return (
    <Tbody>
      <Tr
        className={`tr-list ${isShowDetail ? 'show' : ''}`}
        onClick={() => setIsShowDetail(!isShowDetail)}
      >
        <Td w="25%">
          {formatTimestamp(message?.createdAt * 1000, 'YYYY-MM-DD HH:mm:ss')}{' '}
          UTC
        </Td>

        <Td w={webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY ? '12%' : '15%'}>
          {message?.input?.tx?.blockNumber}
        </Td>
        <Td w={webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY ? '15%' : '20%'}>
          <Flex alignItems="center">
            {formatShortText(message?.input?.tx?.transactionHash)}
            <Box ml={2}>
              <a
                onClick={(e) => onRedirectToBlockExplorer(e)}
                href={
                  getBlockExplorerUrl(
                    message?.input?.chain,
                    message?.input?.network,
                  ) + message?.input?.tx?.transactionHash
                }
                className="link-redirect"
                target="_blank"
              >
                <LinkIcon />
              </a>
            </Box>
          </Flex>
        </Td>
        {_renderContentActivities()}
        <Td w="12%">
          <StatusMessages message={message} />
        </Td>
        <Td w="10%">
          <Box className={`icon-down ${isShowDetail ? 'open' : ''}`}>
            <ArrowDown />
          </Box>
        </Td>
      </Tr>
      {isShowDetail && (
        <Tr>
          <Td colSpan={getNumberColspan()} className="box-detail">
            <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
              <Box width={'49%'}>
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
                      name={false}
                      theme="monokai"
                      src={message.input}
                      displayDataTypes={false}
                      collapsed={1}
                      shouldCollapse={false}
                      displayObjectSize={false}
                    />
                  </Scrollbars>
                </Box>
              </Box>
              <Box width={'49%'}>
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
                      theme="monokai"
                      src={message.output}
                      displayDataTypes={false}
                      collapsed={1}
                      shouldCollapse={false}
                      displayObjectSize={false}
                    />
                  </Scrollbars>
                </Box>
              </Box>
            </Flex>
          </Td>
        </Tr>
      )}
    </Tbody>
  );
};

export default MessageItem;
