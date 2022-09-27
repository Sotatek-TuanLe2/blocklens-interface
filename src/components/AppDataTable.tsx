/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  forwardRef,
  useImperativeHandle,
  Ref,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import { isMobile } from 'react-device-detect';
import { debounce } from 'lodash';
import AppPagination from './AppPagination';
import 'src/styles/components/AppDataTable.scss';
import AppButton from './AppButton';
import { Table, TableContainer, Flex } from '@chakra-ui/react';

// For more params, please define them below with ? mark
export interface RequestParams {
  search?: string;
  network?: string;
  type?: string;
  status?: string | number;
  name?: string;
  permissionName?: string;
  searchKey?: string;
  poolId?: string;
  projectId?: string;
  appId?: number;
}

interface DataTableProps {
  requestParams?: RequestParams; // if requestParams are not passed, only fetchs API in didMount
  limit?: number;
  wrapperClassName?: string;
  fetchData: (requestParams: RequestParams) => Promise<IResponseType>;
  renderBody: (tableData: any[]) => ReactNode;
  renderHeader?: () => ReactNode;
  renderNoData?: () => ReactNode;
  loading?: boolean;
}

export interface DataTableRef {
  tableData: any[];
  fetchTableData: any;
}

export interface Pagination {
  limit: number; // the limit item of page
  page: number; // the current page
  sortBy?: string;
  sortType?: 'asc' | 'desc'; // Available values : asc, desc
}

interface IResponseType {
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  docs: any[];
}

const AppDataTable = forwardRef(
  (props: DataTableProps, ref: Ref<DataTableRef>) => {
    const DEFAULT_LIMIT = 20;
    const DEBOUNCE_TIME = 1000;
    const CONSTANT = 'CONSTANT';

    // make requestParams not change => call at the first load
    const defaultRequestParams = useMemo(() => ({}), [CONSTANT]);

    const {
      limit = DEFAULT_LIMIT,
      requestParams = defaultRequestParams,
      fetchData,
      renderBody,
      renderHeader,
      renderNoData,
    } = props;

    const initialPagination: Pagination = { limit, page: 1 };

    const [tableData, setTableData] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pagination, setPagination] = useState<Pagination>(initialPagination);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      tableData,
      fetchTableData,
      pagination,
      isLoadingMore,
    }));

    const fetchTableData = async (
      params: RequestParams,
      tablePagination: Pagination,
      isLoadMore = false,
    ) => {
      const setLoading = isLoadMore ? setIsLoadingMore : setIsLoading;
      setLoading(true);
      const response: IResponseType | any[] = await fetchData({
        ...params,
        ...tablePagination,
      });
      setLoading(false);
      if (response && response.docs) {
        setTableData((prevState) =>
          isLoadMore ? [...prevState, ...response.docs] : response.docs,
        );
        setPagination({ ...tablePagination });
        setTotalPages(response.totalPages);
      } else setTableData([]);
    };

    const debounceFetchTablaData = useCallback(
      debounce(fetchTableData, DEBOUNCE_TIME),
      [requestParams],
    );

    useEffect(() => {
      debounceFetchTablaData(requestParams, { ...pagination, page: 1 });
      return () => {
        debounceFetchTablaData.cancel();
      };
    }, [debounceFetchTablaData]);

    const onChangePagination = (event: { selected: number }) => {
      fetchTableData(requestParams, {
        ...pagination,
        page: event.selected + 1,
      });
    };

    const onLoadMore = () => {
      const nextPage = pagination.page + 1;
      fetchTableData(
        requestParams,
        { ...pagination, page: nextPage },
        isMobile,
      );
    };

    const _renderLoading = () => {
      return (
        <div style={{ marginTop: '25px', width: '100%', textAlign: 'center' }}>
          Loading...
        </div>
      );
    };

    const _renderLoadMore = () => {
      return pagination.page < totalPages ? (
        <div className="load-more">
          <AppButton
            size={'sm'}
            variant="outline"
            className="btn-load-more"
            onClick={onLoadMore}
            isLoading={isLoadingMore}
            isDisabled={isLoadingMore}
          >
            See more
          </AppButton>
        </div>
      ) : null;
    };
    const _renderPagination = () => {
      return (
        <Flex justifyContent="flex-end">
          <AppPagination
            pageCount={totalPages}
            forcePage={pagination.page - 1}
            onPageChange={onChangePagination}
          />
        </Flex>
      );
    };

    const _renderFooter = () => {
      if (totalPages <= 1 || isLoading || props.loading) {
        return null;
      }
      return isMobile ? _renderLoadMore() : _renderPagination();
    };
    const _renderNoResultOrLoading = () => {
      if (isLoading || props.loading) {
        return _renderLoading();
      }
      if (!tableData.length) {
        return renderNoData ? (
          renderNoData()
        ) : (
          <div
            style={{ marginTop: '25px', width: '100%', textAlign: 'center' }}
          >
            No data...
          </div>
        );
      }
    };
    const _renderBody = () => {
      if (!tableData.length || isLoading || props.loading) {
        return;
      }
      return <>{renderBody(tableData)}</>;
    };

    const _renderTable = () => {
      return (
        <>
          {renderHeader && renderHeader()}
          {_renderBody()}
        </>
      );
    };

    return (
      <>
        <TableContainer>
          <Table colorScheme="gray">{_renderTable()}</Table>
        </TableContainer>
        {_renderNoResultOrLoading()}
        {_renderFooter()}
      </>
    );
  },
);

export default AppDataTable;
