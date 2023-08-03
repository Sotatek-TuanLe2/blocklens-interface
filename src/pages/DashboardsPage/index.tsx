import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { DashboardListIcon, IconMywork, QueriesIcon } from 'src/assets/icons';
import { AppDataTable, RequestParams } from 'src/components';
import AppTabs, { ITabs } from 'src/components/AppTabs';
import { DisplayType } from 'src/constants';
import useUser from 'src/hooks/useUser';
import { BasePage } from 'src/layouts';
import {
  DashboardsParams,
  QueriesParams,
} from 'src/requests/DashboardsRequest';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/DashboardsPage.scss';
import { ROUTES } from 'src/utils/common';
import FilterSearch from './parts/FilterSearch';
import ListItem from './parts/ListItem';

export const LIST_ITEM_TYPE = {
  DASHBOARDS: 'dashboards',
  QUERIES: 'queries',
  MYWORK: 'my-work',
  SAVED: 'saved',
};

export const ITEM_TYPE = {
  DASHBOARDS: 'dashboards',
  QUERIES: 'queries',
};

export const HOME_URL_PARAMS = {
  TAB: 'tab',
  ITEM_TYPE: 'type',
  SEARCH: 'search',
  SORT: 'sort',
  CHAIN: 'chain',
  TAG: 'tag',
};

interface IDashboardParams extends RequestParams, DashboardsParams {}
interface IQueriesParams extends RequestParams, QueriesParams {}

const DashboardsPage: React.FC = () => {
  const { search: searchUrl } = useLocation();
  const history = useHistory();
  const { user } = useUser();

  const searchParams = new URLSearchParams(searchUrl);

  const [tab, setTab] = useState<string>(LIST_ITEM_TYPE.DASHBOARDS);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [dashboardParams, setDashboardParams] = useState<IDashboardParams>({});
  const [queryParams, setQueryParams] = useState<IQueriesParams>({});
  const [itemType, setItemType] = useState<string>(ITEM_TYPE.DASHBOARDS);

  const [displayed, setDisplayed] = useState<string>(DisplayType.Grid);

  useEffect(() => {
    const tabId =
      searchParams.get(HOME_URL_PARAMS.TAB) || LIST_ITEM_TYPE.DASHBOARDS;
    const myWork =
      searchParams.get(HOME_URL_PARAMS.ITEM_TYPE) || ITEM_TYPE.DASHBOARDS;
    const search = searchParams.get(HOME_URL_PARAMS.SEARCH) || '';
    const sort = searchParams.get(HOME_URL_PARAMS.SORT) || '';
    const chain = searchParams.get(HOME_URL_PARAMS.CHAIN) || '';
    const tag = (searchParams.get(HOME_URL_PARAMS.TAG) || '').replace('#', '');

    setTab(tabId);
    setItemType(myWork);

    switch (tabId) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        setTabIndex(0);
        setDashboardParams(() =>
          _.omitBy(
            {
              search: search,
              sort: sort,
              chain: chain,
              'tags[]': tag,
            },
            (param) => !param,
          ),
        );
        break;
      case LIST_ITEM_TYPE.QUERIES:
        setTabIndex(1);
        setQueryParams(() =>
          _.omitBy(
            {
              search: search,
              sort: sort,
              chain: chain,
              'tags[]': tag,
            },
            (param) => !param,
          ),
        );
        break;
      case LIST_ITEM_TYPE.MYWORK:
        if (!user) {
          history.push(ROUTES.HOME);
          break;
        }
        setTabIndex(2);
        myWork === ITEM_TYPE.DASHBOARDS
          ? setDashboardParams(() =>
              _.omitBy(
                {
                  search: search,
                  sort: sort,
                  'tags[]': tag,
                },
                (param) => !param,
              ),
            )
          : setQueryParams(() =>
              _.omitBy(
                {
                  search: search,
                  sort: sort,
                  'tags[]': tag,
                },
                (param) => !param,
              ),
            );
        break;
      default:
        break;
    }
  }, [searchUrl, tab, itemType]);

  useEffect(() => {
    // user logs out when in My Work tab
    if (!user && tab === LIST_ITEM_TYPE.MYWORK) {
      setTab(LIST_ITEM_TYPE.DASHBOARDS);
      setTabIndex(0);
    }
  }, [user]);

  const getSearchParam = (value: string) => {
    return value?.trim() || undefined;
  };

  const fetchAllDashboards: any = useCallback(
    async (params: any) => {
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getAllDashboards({
            ...params,
            search: getSearchParam(params.search),
          });
        return { ...res, docs: res.data };
      } catch (error) {
        console.error(error);
      }
    },
    [dashboardParams],
  );

  const fetchMyDashboards: any = useCallback(
    async (params: any) => {
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getMyListDashboards({
            ...params,
            search: getSearchParam(params.search),
          });
        return { ...res, docs: res.data };
      } catch (error) {
        console.error(error);
      }
    },
    [dashboardParams],
  );

  const fetchAllQueries: any = useCallback(
    async (params: any) => {
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getAllQueries({ ...params, search: getSearchParam(params.search) });
        return { ...res, docs: res.data };
      } catch (error) {
        console.error(error);
      }
    },
    [queryParams],
  );

  const fetchMyQueries: any = useCallback(
    async (params: any) => {
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getMyListQueries({
            ...params,
            search: getSearchParam(params.search),
          });
        return { ...res, docs: res.data };
      } catch (error) {
        console.error(error);
      }
    },
    [queryParams],
  );

  const _renderContentTable = useCallback(
    (appTable: any) => {
      return (
        <>
          <Box pb={{ base: '28px', lg: '34px' }} className="dashboard-filter">
            <FilterSearch
              type={tab}
              displayed={displayed}
              setDisplayed={setDisplayed}
              itemType={itemType}
            />
          </Box>
          <Box>{appTable}</Box>
        </>
      );
    },
    [tab, itemType, displayed],
  );

  const _renderBody = useCallback(
    (listItem: any) => {
      if (displayed === DisplayType.List) {
        return listItem;
      }
      return (
        <SimpleGrid
          className="infos"
          columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
          columnGap="20px"
          rowGap="20px"
        >
          {listItem}
        </SimpleGrid>
      );
    },
    [tab, itemType, displayed],
  );

  const _renderHeader = useCallback(() => {
    if (displayed !== DisplayType.List) {
      return null;
    }
    return (
      <Flex display={{ base: 'none', lg: 'flex' }} className="table-header">
        <Flex align={'center'} w={'calc(100% - 24px)'}>
          <Box w={'24%'} flexGrow={1} pr={2.5}>
            Name
          </Box>
          <Box w={'24%'} flexGrow={1} pr={2.5}>
            Creator
          </Box>
          <Box w={'16%'} flexGrow={1} pr={2.5}>
            date
          </Box>
          <Box w={'10%'} flexGrow={1} pr={2.5}>
            View
          </Box>
          <Box w={'26%'} flexGrow={1} pr={2.5}>
            tag
          </Box>
        </Flex>
        <Box w={'24px'}></Box>
      </Flex>
    );
  }, [displayed]);

  const _renderSkeleton = (listItem: any) => {
    return (
      <>
        {displayed === DisplayType.Grid ? (
          <SimpleGrid
            className="infos"
            columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
            columnGap="20px"
            rowGap="20px"
          >
            {listItem}
          </SimpleGrid>
        ) : (
          listItem
        )}
      </>
    );
  };

  const _renderTable = (
    params: IDashboardParams | IQueriesParams,
    fetchData: any,
    type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE],
    itemType?: typeof ITEM_TYPE[keyof typeof ITEM_TYPE],
  ) => (
    <AppDataTable
      requestParams={params}
      fetchData={fetchData}
      isInfiniteScroll
      renderHeader={_renderHeader}
      wrapperClassName="block-table"
      renderBody={(data) =>
        _renderBody(
          data.map((item: any) => (
            <ListItem
              key={item.id}
              item={item}
              type={type}
              itemType={itemType}
              displayed={displayed}
            />
          )),
        )
      }
      renderLoading={() =>
        _renderSkeleton(
          [...Array(8)].map((_, index: number) => (
            <ListItem
              key={index}
              isLoading
              type={type}
              itemType={itemType}
              displayed={displayed}
            />
          )),
        )
      }
    />
  );

  const generateTabs = (): ITabs[] => {
    const tabs: ITabs[] = [
      {
        id: LIST_ITEM_TYPE.DASHBOARDS,
        name: 'Dashboards',
        icon: <DashboardListIcon />,
        content: _renderContentTable(
          _renderTable(
            dashboardParams,
            fetchAllDashboards,
            LIST_ITEM_TYPE.DASHBOARDS,
          ),
        ),
      },
      {
        id: LIST_ITEM_TYPE.QUERIES,
        name: 'Queries',
        icon: <QueriesIcon />,
        content: _renderContentTable(
          _renderTable(queryParams, fetchAllQueries, LIST_ITEM_TYPE.QUERIES),
        ),
      },
    ];

    if (!!user) {
      tabs.push({
        id: LIST_ITEM_TYPE.MYWORK,
        name: 'My Work',
        icon: <IconMywork />,
        content: _renderContentTable(
          <>
            {itemType === ITEM_TYPE.DASHBOARDS && (
              <Box>
                {_renderTable(
                  dashboardParams,
                  fetchMyDashboards,
                  LIST_ITEM_TYPE.MYWORK,
                  ITEM_TYPE.DASHBOARDS,
                )}
              </Box>
            )}
            {itemType === ITEM_TYPE.QUERIES && (
              <Box>
                {_renderTable(
                  queryParams,
                  fetchMyQueries,
                  LIST_ITEM_TYPE.MYWORK,
                  ITEM_TYPE.QUERIES,
                )}
              </Box>
            )}
          </>,
        ),
      });
    }
    return tabs;
  };

  const onChangeTab = (tabId: string) => {
    searchParams.delete(HOME_URL_PARAMS.TAB);
    searchParams.delete(HOME_URL_PARAMS.ITEM_TYPE);
    searchParams.delete(HOME_URL_PARAMS.SEARCH);
    searchParams.delete(HOME_URL_PARAMS.SORT);
    searchParams.delete(HOME_URL_PARAMS.TAG);
    if (tabId !== LIST_ITEM_TYPE.DASHBOARDS) {
      searchParams.set(HOME_URL_PARAMS.TAB, tabId);
    }
    history.push({
      pathname: ROUTES.HOME,
      search: `${searchParams.toString()}`,
    });
  };

  return (
    <BasePage>
      <Flex
        flexDirection="column"
        className="dashboards-page"
        justifyContent={'space-between'}
      >
        <Box className="dashboard-list">
          <AppTabs
            currentTabIndex={tabIndex}
            tabs={generateTabs()}
            onChange={onChangeTab}
            sxTabList={{
              borderBottom: {
                base: '1px solid #C7D2E1 !important',
                lg: 'none !important',
              },
              mb: { base: '34px', lg: 6 },
            }}
            sxTabsHeader={{
              justifyContent: { lg: 'center !important' },
              overflow: 'hidden',
              borderBottom: { base: '1px solid #C7D2E1', lg: 'none' },
            }}
          />
        </Box>
      </Flex>
    </BasePage>
  );
};

export default DashboardsPage;
