import React, { FC } from 'react';
import { Box, Tbody, Td, Tr, Flex } from '@chakra-ui/react';
import { formatTimestamp } from 'src/utils/utils-helper';
import { DownloadBillingIcon, RetryIcon } from 'src/assets/icons';
import { IBilling } from '../index';

interface IStatusBilling {
  billing: IBilling;
}

interface IBillingItem {
  billing: IBilling;
  onDownload: (id: string) => void;
  onRetry: (id: string) => void;
}

export const StatusBilling: FC<IStatusBilling> = ({ billing }) => {
  return (
    <Box
      className={`status ${
        billing.status === 'SUCCESS' ? 'active' : 'inactive'
      }`}
    >
      <Box textTransform="capitalize">{billing.status.toLowerCase()}</Box>
    </Box>
  );
};

const BillingItem: FC<IBillingItem> = ({ billing, onDownload, onRetry }) => {
  return (
    <Tbody>
      <Tr className={`tr-list`}>
        <Td w={"25%"}>{formatTimestamp(billing?.createdAt, 'MMMM DD YYYY')}</Td>

        <Td w={"20%"}>{billing.type}</Td>
        <Td w={"20%"}>${billing.totalAmount}</Td>
        <Td w={"20%"}>--</Td>
        <Td w={"15%"}>
          <StatusBilling billing={billing} />
        </Td>
        <Td w={"10%"}>
          <Flex alignItems="center" justifyContent={'flex-end'}>
            {billing.status !== 'SUCCESS' && (
              <Box
                mr={3}
                className="link-redirect"
                onClick={(e) => {
                  e.stopPropagation();
                  onRetry(billing.id);
                }}
              >
                <RetryIcon />
              </Box>
            )}

            <Box
              className="link-redirect"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(billing.id);
              }}
            >
              <DownloadBillingIcon />
            </Box>
          </Flex>
        </Td>
      </Tr>
    </Tbody>
  );
};

export default BillingItem;
