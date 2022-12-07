import React, { useState } from 'react';
import { Box, Flex, Tbody, Td, Tr } from '@chakra-ui/react';
import { WEBHOOK_TYPES, getColorBrandStatus } from 'src/utils/utils-webhook';
import { formatTimestamp } from 'src/utils/utils-helper';
import {
  AppCard,
  AppField,
  AppInput,
  AppLink,
  AppSelect2,
} from 'src/components';
import { LinkIcon, ArrowDown } from 'src/assets/icons';

const MessageItem = ({ message, webhook }: any) => {
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
  const _renderStatus = (message: any) => {
    if (!message.status) return 'N/A';
    return (
      <Box className={`status ${getColorBrandStatus(message.status)}`}>
        {message.status}
      </Box>
    );
  };

  const _renderContentNFT = () => {
    return (
      <>
        <Td>N/A</Td>
        <Td textAlign="center">N/A</Td>
      </>
    );
  };

  const _renderContentAddress = () => {
    return <Td>N/A</Td>;
  };

  const _renderContentContract = () => {
    return <Td textAlign="center">method</Td>;
  };

  const _renderContentActivities = () => {
    if (webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY) {
      return _renderContentNFT();
    }

    if (webhook.type === WEBHOOK_TYPES.CONTRACT_ACTIVITY) {
      return _renderContentContract();
    }

    return _renderContentAddress();
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
        <Td>
          <Flex alignItems="center">
            <AppLink ml={3} to={'#'} className="link-redirect">
              <LinkIcon />
            </AppLink>
          </Flex>
        </Td>
        {_renderContentActivities()}
        <Td>{_renderStatus(message)}</Td>
        <Td>
          <Box className={`icon-down ${isShowDetail ? 'open' : ''}`}>
            <ArrowDown />
          </Box>
        </Td>
      </Tr>
      {isShowDetail && (
        <Tr>
          <Td colSpan={5} className="box-detail">
            <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
              <Box width={'49%'}>
                <Box className="label-detail">input</Box>
                <Box className="content-detail">N/A</Box>
              </Box>
              <Box width={'49%'}>
                <Box className="label-detail">output</Box>
                <Box className="content-detail">N/A</Box>
              </Box>
            </Flex>
          </Td>
        </Tr>
      )}
    </Tbody>
  );
};

export default MessageItem;
