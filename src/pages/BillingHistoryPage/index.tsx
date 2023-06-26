import { Box, Flex, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/AppDetail.scss';
import { BasePage } from 'src/layouts';
import { AppCard, AppDataTable, AppLoadingTable } from 'src/components';
import BillingItem from './parts/BillingItem';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { isMobile } from 'react-device-detect';
import BillingItemMobile from './parts/BillingItemMobile';
import { useHistory } from 'react-router';
import { getErrorMessage } from '../../utils/utils-helper';
import { getWidthColumns } from '../../components/ActivityDatatable';

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
  activePaymentMethod?: string;
  stripePaymentMethod?: any;
}

const BillingHistory = () => {
  const history = useHistory();
  const getListReceipt = async (receiptIds: string) => {
    try {
      return await rf.getRequest('BillingRequest').getListReceipt(receiptIds);
    } catch (error) {
      console.error(error);
      // toastError({ message: getErrorMessage(error) });
    }
  };

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      const res = await rf.getRequest('BillingRequest').getInvoiceList(params);
      const receiptIds =
        res.docs.map((item: any) => item?.receiptId || -1) || [];
      const listReceipt = await getListReceipt(receiptIds.join(',').toString());

      const dataTable = res?.docs.map((invoice: any, index: number) => {
        return {
          ...invoice,
          activePaymentMethod: listReceipt[index]?.activePaymentMethod || null,
          stripePaymentMethod: listReceipt[index]?.stripePaymentMethod || null,
        };
      });

      return {
        ...res,
        docs: dataTable,
      };
    } catch (error) {
      console.error(error);
      // toastError({
      //   message: getErrorMessage(error),
      // });
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
    } catch (error) {
      toastError({
        message: getErrorMessage(error),
      });
    }
  }, []);

  const onRetry = useCallback(async (id: string) => {
    try {
      await rf.getRequest('BillingRequest').retryPendingInvoice(id);
      toastSuccess({ message: 'Successfully!' });
    } catch (error) {
      toastError({
        message: getErrorMessage(error),
      });
    }
  }, []);

  const _renderHeader = () => {
    if (isMobile) return;

    return (
      <Thead className="header-list">
        <Tr>
          <Th w={'25%'}>date of issue</Th>
          <Th w={'20%'}>type</Th>
          <Th w={'15%'}>amount</Th>
          <Th w={'15%'}>method</Th>
          <Th w={'15%'}>Status</Th>
          <Th w={'10%'} />
        </Tr>
      </Thead>
    );
  };

  const _renderLoading = () => {
    const widthColumns = [25, 20, 15, 15, 15, 10];
    return <AppLoadingTable widthColumns={widthColumns} />;
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
    <BasePage className="app-detail">
      <>
        <Flex className="app-info">
          <Flex className="name">
            <Box
              cursor={'pointer'}
              className="icon-arrow-left"
              mr={6}
              onClick={() => history.push('/billing')}
            />
            <Box className={'title-mobile'}>Billing History</Box>
          </Flex>
        </Flex>

        <AppCard className="list-table-wrap">
          <Box py={3} />
          <AppDataTable
            fetchData={fetchDataTable}
            renderBody={_renderBody}
            renderLoading={_renderLoading}
            renderHeader={_renderHeader}
            limit={15}
          />
        </AppCard>
      </>
    </BasePage>
  );
};

export default BillingHistory;
