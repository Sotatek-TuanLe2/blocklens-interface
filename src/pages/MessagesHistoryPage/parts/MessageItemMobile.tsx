import React, { FC, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import { formatShortText, formatTimestamp } from 'src/utils/utils-helper';
import { LinkIcon } from 'src/assets/icons';
import { AppButton } from 'src/components';
import ReactJson from 'react-json-view';

const MessagesItemMobile = ({ message, webhook }: any) => {
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
            <Flex alignItems="center">{message?.method}</Flex>
          </Box>
        </Flex>
      );
    };

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
              <Flex alignItems="center">{message?.tokenId?.join(', ')}</Flex>
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
            {formatShortText(message?.trackingAddrress)}
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
            <Box
              className={'content-output'}
              dangerouslySetInnerHTML={{ __html: message.output.error }}
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
          <Box> N/A</Box>
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
                <Flex alignItems="center">
                  {formatShortText(message.txHash)}
                  <Box ml={2}>
                    <a href={'#'} className="link-redirect" target="_blank">
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
