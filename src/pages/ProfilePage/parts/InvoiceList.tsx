import {
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  Box,
  Tag,
  Flex,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppDataTable } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { formatTimestamp } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import fileDownload from 'js-file-download';

interface IInvoiceResponse {
  userId: number;
  receiptId: string;
  invoiceId: string;
  createdAt: number;
  status: string;
}
const INVOICE_STATUS = {
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
};

const getColorBrandStatus = (status: string) => {
  switch (status) {
    case INVOICE_STATUS.PENDING:
      return 'teal';
    case INVOICE_STATUS.SUCCESS:
      return 'green';
    case INVOICE_STATUS.FAILED:
      return 'red';
  }
};

const InvoiceList = () => {
  const [params, setParams] = useState<any>({});

  const fetchDataTable: any = async (param: any) => {
    try {
      return await rf.getRequest('BillingRequest').getInvoiceList(param);
    } catch (error) {
      return error;
    }
  };

  const _renderHeader = () => {
    return (
      <Thead>
        <Tr bg={'#f9f9f9'}>
          <Th>Date of Issue</Th>
          <Th>Status</Th>
          <Th>Invoice</Th>
          <Th>Receipt</Th>
        </Tr>
      </Thead>
    );
  };

  const onRetryPayInvoice = async (invoiceId: any) => {
    try {
      await rf.getRequest('BillingRequest').payPendingInvoice(invoiceId);
      setParams((pre: any) => {
        return { ...pre };
      });
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  const _renderStatus = (invoice: IInvoiceResponse) => {
    if (!invoice.status) return 'N/A';
    return (
      <Flex alignItems={'center'}>
        <Tag
          size={'sm'}
          borderRadius="full"
          variant="solid"
          colorScheme={getColorBrandStatus(invoice.status)}
          px={5}
          mr={2}
        >
          {invoice.status}
        </Tag>

        {invoice.status === INVOICE_STATUS.PENDING && invoice.invoiceId && (
          <Box
            cursor={'pointer'}
            color={'#4C84FF'}
            onClick={() => onRetryPayInvoice(invoice.invoiceId)}
          >
            • Retry
          </Box>
        )}
      </Flex>
    );
  };

  const _renderNoData = () => {
    return (
      <Flex justifyContent={'center'} my={5}>
        No invoices yet.
      </Flex>
    );
  };

  const handleDownload = async (type: string, id: string) => {
    try {
      const res = await rf
        .getRequest('BillingRequest')
        .downloadInvoice(type, id);
      fileDownload(res, 'receipt.pdf');
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  const _renderBody = (data?: IInvoiceResponse[]) => {
    return (
      <Tbody>
        {data?.map((invoice: IInvoiceResponse, index: number) => {
          return (
            <Tr key={index}>
              <Td>{formatTimestamp(invoice.createdAt, 'MMM DD YYYY')}</Td>
              <Td>{_renderStatus(invoice)}</Td>
              <Td>
                {invoice.invoiceId ? (
                  <Box
                    onClick={() => handleDownload('invoice', invoice.invoiceId)}
                    cursor={'pointer'}
                    color={'#4C84FF'}
                  >
                    Download
                  </Box>
                ) : (
                  <Box>-</Box>
                )}
              </Td>
              <Td>
                {invoice.receiptId ? (
                  <Box
                    onClick={() => handleDownload('receipt', invoice.receiptId)}
                    cursor={'pointer'}
                    color={'#4C84FF'}
                  >
                    Download
                  </Box>
                ) : (
                  <Box>-</Box>
                )}
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  return (
    <Box px={5} mt={5}>
      <Box mb={5}>Recent Invoices</Box>
      <AppDataTable
        requestParams={params}
        fetchData={fetchDataTable}
        renderBody={_renderBody}
        renderHeader={_renderHeader}
        renderNoData={_renderNoData}
        limit={10}
      />
    </Box>
  );
};

export default InvoiceList;
