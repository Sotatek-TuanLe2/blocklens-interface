import React, { FC, MouseEvent, useState } from 'react';
import { Box, Flex, Tbody, Td, Tr } from '@chakra-ui/react';
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
    return <Td textAlign="left">{message?.input?.method}</Td>;
  };

  const _renderContentNFT = () => {
    return (
      <>
        {_renderContentContract()}
        <Td textAlign="center">{message?.input?.tokenId || '--'}</Td>
      </>
    );
  };

  const _renderContentAddress = () => {
    return <Td>{formatShortText(message?.input?.trackingAddress)}</Td>;
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
        <Td>
          {formatTimestamp(message?.createdAt * 1000, 'YYYY-MM-DD HH:mm:ss')}{' '}
          UTC
        </Td>

        <Td>{message?.input?.tx?.blockNumber}</Td>
        <Td>
          <Flex alignItems="center">
            {formatShortText(message?.input?.tx?.transactionHash)}
            <Box ml={2}>
              <a
                onClick={(e) => onRedirectToBlockExplorer(e)}
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
        </Td>
        {_renderContentActivities()}
        <Td>
          <StatusMessages message={message} />
        </Td>
        <Td>
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
                  <ReactJson
                    name={false}
                    theme="monokai"
                    src={message.input}
                    displayDataTypes={false}
                    collapsed={false}
                    displayObjectSize={false}
                  />
                </Box>
              </Box>
              <Box width={'49%'}>
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
            </Flex>
          </Td>
        </Tr>
      )}
    </Tbody>
  );
};

export default MessageItem;
