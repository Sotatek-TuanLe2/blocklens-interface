import React, { FC, MouseEvent, useState } from 'react';
import { Box, Flex, Tbody, Td, Tooltip, Tr } from '@chakra-ui/react';
import {
  IMessages,
  IWebhook,
  STATUS,
  WEBHOOK_TYPES,
  formatTokenData,
} from 'src/utils/utils-webhook';
import {
  formatCapitalize,
  formatShortText,
  formatTimestamp,
  shortAddressType,
} from 'src/utils/utils-helper';
import { LinkIcon, ArrowDown } from 'src/assets/icons';
import ReactJson from 'react-json-view';
import { getExplorerTxUrl } from 'src/utils/utils-network';
import { Scrollbars } from 'react-custom-scrollbars';
import { AppStatus } from 'src/components';
import { APP_STATUS } from 'src/utils/utils-app';

export const StatusMessages = ({ message }: any) => {
  if (!!message.status) {
    return (
      <AppStatus
        status={
          message.status === STATUS.FAILED
            ? APP_STATUS.DISABLED
            : APP_STATUS.ENABLE
        }
        activeText={formatCapitalize(message?.status)}
        inactiveText={formatCapitalize(message?.status)}
      />
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
    const content = message?.input?.tx?.tokenIds?.join(', ');

    return (
      <>
        <Td textAlign="left" w="13%">
          {message?.input?.method}
        </Td>
        <Td textAlign="center" w="13%">
          <Tooltip hasArrow placement="top" label={content}>
            <Box overflow={'hidden'} textOverflow={'ellipsis'}>
              {content || '*'}
            </Box>
          </Tooltip>
        </Td>
      </>
    );
  };

  const _renderContentAddress = () => {
    return (
      <Td w="15%">
        <Tooltip
          hasArrow
          placement="top"
          label={message?.input?.trackingAddress || ''}
        >
          {formatShortText(message?.input?.trackingAddress || '')}
        </Tooltip>
      </Td>
    );
  };

  const _renderContentAptosCoin = () => {
    return (
      <Td w="15%" isTruncated>
        <Tooltip
          hasArrow
          placement="top"
          label={webhook?.metadata?.coinType || ''}
        >
          {shortAddressType(webhook?.metadata?.coinType || '')}
        </Tooltip>
      </Td>
    );
  };

  const _renderContentAptosToken = () => {
    const content = formatTokenData(webhook);

    return (
      <Td w="15%">
        <Tooltip hasArrow placement="top" label={content}>
          <Box overflow={'hidden'} textOverflow={'ellipsis'}>
            {content}
          </Box>
        </Tooltip>
      </Td>
    );
  };

  const _renderContentActivities = () => {
    if (webhook?.type === WEBHOOK_TYPES.NFT_ACTIVITY) {
      return _renderContentNFT();
    }

    if (webhook?.type === WEBHOOK_TYPES.CONTRACT_ACTIVITY) {
      return _renderContentContract();
    }

    if (webhook?.type === WEBHOOK_TYPES.APTOS_COIN_ACTIVITY) {
      return _renderContentAptosCoin();
    }

    if (webhook?.type === WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY) {
      return _renderContentAptosToken();
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
          {message?.block || '--'}
        </Td>
        <Td w={webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY ? '15%' : '20%'}>
          <Flex alignItems="center">
            <Tooltip hasArrow placement="top" label={message?.tnxId}>
              {formatShortText(message?.tnxId)}
            </Tooltip>
            {message?.tnxId && (
              <Box ml={2}>
                <a
                  onClick={(e) => onRedirectToBlockExplorer(e)}
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
                      theme="summerfruit:inverted"
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
            </Flex>
          </Td>
        </Tr>
      )}
    </Tbody>
  );
};

export default MessageItem;
