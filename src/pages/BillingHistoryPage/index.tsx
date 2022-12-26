import { Box, Flex, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/AppDetail.scss';
import { BasePageContainer } from 'src/layouts';
import { AppCard, AppDataTable } from 'src/components';
import BillingItem from './parts/BillingItem';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { isMobile } from 'react-device-detect';
import BillingItemMobile from './parts/BillingItemMobile';

const fileDownload = require('js-file-download');

interface ILineItems {
  amount: number;
  description: string;
  price: number;
  title: string;
  unit: number;
}

export interface IBilling {
  createdAt: number;
  id: string;
  lineItems: ILineItems[];
  receiptId: string;
  status: string;
  totalAmount: number;
  type: string;
  userId: string;
}

const BillingHistory = () => {
  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      return await rf.getRequest('BillingRequest').getInvoiceList(params);
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
      });
    }
  }, []);

  const onDownloadReceipt = useCallback(async (invoiceId: string) => {
    try {
      const res = await rf
        .getRequest('BillingRequest')
        .downloadInvoice('invoice', invoiceId);
      fileDownload(res, `Invoice-${invoiceId}.pdf`);
      toastSuccess({
        message: 'Successfully!',
      });
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
      });
    }
  }, []);

  const onRetry = useCallback(async (id: string) => {
    try {
      await rf.getRequest('BillingRequest').retryPendingInvoice(id);
      toastSuccess({ message: 'Successfully!' });
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
      });
    }
  }, []);

  const _renderHeader = () => {
    if (isMobile) return;

    return (
      <Thead className="header-list">
        <Tr>
          <Th w={"25%"}>date of issue</Th>
          <Th w={"20%"}>type</Th>
          <Th w={"20%"}>amount</Th>
          <Th w={"20%"}>method</Th>
          <Th w={"15%"}>Status</Th>
          <Th w={"10%"} />
        </Tr>
      </Thead>
    );
  };

  const _renderBody = (data?: IBilling[]) => {
    if (isMobile) {
      return (
        <Box className="list-card-mobile">
          {data?.map((billing: IBilling, index: number) => {
            return (
              <BillingItemMobile
                billing={billing}
                key={index}
                onDownload={onDownloadReceipt}
                onRetry={onRetry}
              />
            );
          })}
        </Box>
      );
    }

    return data?.map((billing: IBilling, index: number) => {
      return (
        <BillingItem
          billing={billing}
          key={index}
          onDownload={onDownloadReceipt}
          onRetry={onRetry}
        />
      );
    });
  };

  return (
    <BasePageContainer className="app-detail">
      <>
        <Flex className="app-info">
          <Flex className="name">
            <Box className="icon-arrow-left" mr={6} />
            <Box className={'title-mobile'}>Billing History</Box>
          </Flex>
        </Flex>

        <AppCard className="list-table-wrap">
          <Box py={3} />
          <AppDataTable
            fetchData={fetchDataTable}
            renderBody={_renderBody}
            renderHeader={_renderHeader}
            limit={15}
          />
        </AppCard>
      </>
    </BasePageContainer>
  );
};

export default BillingHistory;
