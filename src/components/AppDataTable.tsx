/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex, Spinner, Table, TableContainer } from '@chakra-ui/react';
import { debounce } from 'lodash';
import {
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isMobile } from 'react-device-detect';
import InfiniteScroll from 'react-infinite-scroll-component';
import 'src/styles/components/AppDataTable.scss';
import AppPagination from './AppPagination';

// For more params, please define them below with ? mark
export interface RequestParams {
  search?: string;
  network?: string;
  type?: string;
  status?: string | number;
  name?: string;
  permissionName?: string;
  searchKey?: string;
  appId?: string;
  registrationId?: string;
  method?: string;
  address?: string;
  tokenId?: string;
  txHash?: string;
}

interface DataTableProps {
  requestParams?: RequestParams; // if requestParams are not passed, only fetchs API in didMount
  limit?: number;
  wrapperClassName?: string;
  fetchData: (requestParams: RequestParams) => Promise<IResponseType>;
  renderBody: (tableData: any[]) => ReactNode;
  renderHeader?: () => ReactNode;
  renderLoading?: () => ReactNode;
  renderNoData?: () => ReactNode;
  loading?: boolean;
  isNotShowNoData?: boolean;
  hidePagination?: boolean;
  isInfiniteScroll?: boolean;
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
  currentPage: number;
  itemsPerPage: number;
  page: number;
  limit: number;
  docs: any[];
}

interface PageInfos {
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
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
      renderLoading,
      isNotShowNoData = false,
      hidePagination = false,
      isInfiniteScroll = false,
    } = props;

    const initialPagination: Pagination = { limit, page: 1 };

    const initialPageInfos: PageInfos = {
      currentPage: 0,
      itemsPerPage: 0,
      totalPages: 0,
    };

    const [tableData, setTableData] = useState<any[]>([]);
    const [pagesInfo, setPagesInfo] = useState<PageInfos>(initialPageInfos);
    const [pagination, setPagination] = useState<Pagination>(initialPagination);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const refScrollInfinite = useRef<InfiniteScroll>(null);
    const [scrollThreshold, setScrollThreshold] = useState<string | number>(1);

    useLayoutEffect(() => {
      if (isInfiniteScroll && refScrollInfinite) {
        if (
          (refScrollInfinite.current as any)?._infScroll?.clientHeight <
            window.innerHeight &&
          pagesInfo.currentPage < pagesInfo.totalPages
        ) {
          if ((refScrollInfinite.current as any)?.props?.next) {
            (refScrollInfinite.current as any).props.next();
          }

          setScrollThreshold(
            (refScrollInfinite.current as any)?._infScroll?.clientHeight +
              10 +
              'px' || 1,
          );
        }
      }
    }, [pagesInfo]);

    useImperativeHandle(ref, () => ({
      tableData,
      fetchTableData,
      pagination,
      isLoadingMore,
    }));

    const fetchTableData = async (
      params: RequestParams,
      tablePagination: Pagination,
      isLoadInfiniteScroll = false,
    ) => {
      const setLoading = isLoadInfiniteScroll ? setIsLoadingMore : setIsLoading;
      !isInfiniteScroll && setLoading(true);
      const response: IResponseType | any[] = await fetchData({
        ...params,
        ...tablePagination,
      });
      setLoading(false);
      if (response && response.docs) {
        isLoadInfiniteScroll
          ? setTableData((prevState) => [...prevState, ...response.docs])
          : setTableData(() => response.docs);

        setPagination({ ...tablePagination });
        setPagesInfo({
          totalPages: +response.totalPages,
          currentPage: +response.currentPage,
          itemsPerPage: +response.itemsPerPage,
        });
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
    }, [debounceFetchTablaData, fetchData]);

    const onChangePagination = (event: { selected: number }) => {
      fetchTableData(requestParams, {
        ...pagination,
        page: event.selected + 1,
      });
    };

    // const onLoadMore = () => {
    //   const nextPage = pagination.page + 1;
    //   fetchTableData(
    //     requestParams,
    //     { ...pagination, page: nextPage },
    //     isMobile,
    //   );
    // };

    const _renderLoading = () => {
      if (!!renderLoading) {
        return renderLoading();
      }

      return (
        <div style={{ marginTop: '25px', width: '100%', textAlign: 'center' }}>
          Loading...
        </div>
      );
    };

    const _renderPagination = () => {
      if (hidePagination || isInfiniteScroll) return;
      return (
        <Flex justifyContent={'flex-end'}>
          <AppPagination
            pageCount={pagesInfo.totalPages}
            forcePage={pagination.page - 1}
            onPageChange={onChangePagination}
          />
        </Flex>
      );
    };

    const _renderFooter = () => {
      if (pagesInfo.totalPages <= 1 || isLoading || props.loading) {
        return null;
      }
      return _renderPagination();
    };

    const _renderNoResultOrLoading = () => {
      if (isLoading || props.loading) {
        return _renderLoading();
      }

      if (!tableData.length && !isNotShowNoData) {
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
      if (isInfiniteScroll) {
        return (
          <InfiniteScroll
            ref={refScrollInfinite}
            className="infinite-scroll"
            scrollThreshold={scrollThreshold}
            dataLength={tableData.length}
            next={() =>
              fetchTableData(
                requestParams,
                {
                  ...pagination,
                  page: pagesInfo.currentPage + 1,
                },
                true,
              )
            }
            hasMore={
              (pagesInfo?.currentPage || 0) < (pagesInfo?.totalPages || 0)
            }
            loader={
              <Flex justifyContent={'center'} pt={'30px'}>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="md"
                />
              </Flex>
            }
          >
            <>{renderBody(tableData)}</>
          </InfiniteScroll>
        );
      }

      return <>{renderBody(tableData)}</>;
    };

    const _renderHeader = () => {
      if (!renderHeader) {
        return;
      }
      return <>{renderHeader()}</>;
    };

    const _renderTable = () => {
      return (
        <>
          {_renderHeader()}
          {_renderBody()}
        </>
      );
    };

    return (
      <>
        {isMobile ? (
          _renderTable()
        ) : (
          <TableContainer overflowX="inherit" overflowY="inherit">
            <Table colorScheme="gray">{_renderTable()}</Table>
          </TableContainer>
        )}

        {_renderNoResultOrLoading()}
        {_renderFooter()}
      </>
    );
  },
);

export default AppDataTable;
