import { Tbody, Th, Thead, Tr, Td, Box, Tag, Flex } from '@chakra-ui/react';
import React from 'react';
import { AppDataTable } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { formatTimestamp } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';

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

  const _renderStatus = (invoice: IInvoiceResponse) => {
    if (!invoice.status) return 'N/A';
    return (
      <Tag
        size={'sm'}
        borderRadius="full"
        variant="solid"
        colorScheme={getColorBrandStatus(invoice.status)}
        px={5}
      >
        {invoice.status}
      </Tag>
    );
  };

  const _renderNoData = () => {
    return (
      <Flex justifyContent={'center'} my={5}>
        No invoices yet.
      </Flex>
    );
  };

  const onDownloadInvoice = async (type: string, id: string) => {
    try {
      await rf.getRequest('BillingRequest').downloadInvoice(type, id);
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
                    onClick={() =>
                      onDownloadInvoice('invoice', invoice.invoiceId)
                    }
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
                    onClick={() =>
                      onDownloadInvoice('receipt', invoice.receiptId)
                    }
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
