import React, { FC, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { formatTimestamp } from 'src/utils/utils-helper';
import { AppButton } from 'src/components';
import { IBilling } from '../index';
import { StatusBilling } from './BillingItem';

interface IBillingItemMobile {
  billing: IBilling;
  onDownload: (id: string) => void;
  onRetry: (id: string) => void;
}

const BillingItemMobile: FC<IBillingItemMobile> = ({
  billing,
  onDownload,
  onRetry,
}) => {
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
            {formatTimestamp(billing?.createdAt, 'MMMM DD YYYY')}
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
          <Box>Status</Box>
          <Box>
            <StatusBilling billing={billing} />
          </Box>
        </Flex>

        {isOpen && (
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Type</Box>
              <Box className="value">{billing.type}</Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Amount</Box>
              <Box className="value">${billing.totalAmount}</Box>
            </Flex>

            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Method</Box>
              <Box className="value">--</Box>
            </Flex>

            <Flex flexWrap={'wrap'} my={2} justifyContent={'center'}>
              {billing.status !== 'SUCCESS' && (
                <Box width={'48%'}>
                  <AppButton
                    variant="cancel"
                    size="sm"
                    w={'100%'}
                    onClick={() => onRetry(billing.id)}
                  >
                    Retry
                  </AppButton>
                </Box>
              )}

              <Box width={'48%'}>
                <AppButton
                  variant="cancel"
                  size="sm"
                  w={'100%'}
                  onClick={() => onDownload(billing.id)}
                >
                  Download
                </AppButton>
              </Box>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
};

export default BillingItemMobile;
