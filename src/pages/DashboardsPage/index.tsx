import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  DashboardListIcon,
  QueriesIcon,
  IconMywork,
  SavedListIcon,
} from 'src/assets/icons';
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
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
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
  ORDERBY: 'orderBy',
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
  const [savedDashboardIds, setSavedDashboardIds] = useState<string[]>([]);
  const [savedQueryIds, setSavedQueryIds] = useState<string[]>([]);
  const [itemType, setItemType] = useState<string>(ITEM_TYPE.DASHBOARDS);
  const [displayed, setDisplayed] = useState<string>(DisplayType.Grid);

  useEffect(() => {
    const tabId =
      searchParams.get(HOME_URL_PARAMS.TAB) || LIST_ITEM_TYPE.DASHBOARDS;
    const type =
      searchParams.get(HOME_URL_PARAMS.ITEM_TYPE) || ITEM_TYPE.DASHBOARDS;
    const search = searchParams.get(HOME_URL_PARAMS.SEARCH) || '';
    const orderBy = searchParams.get(HOME_URL_PARAMS.ORDERBY) || '';
    const chain = searchParams.get(HOME_URL_PARAMS.CHAIN) || '';
    const tag = searchParams.get(HOME_URL_PARAMS.TAG) || '';

    setTab(tabId);

    switch (tabId) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        setTabIndex(0);
        setItemType(ITEM_TYPE.DASHBOARDS);
        setDashboardParams(() =>
          _.omitBy(
            {
              search: search,
              orderBy: orderBy,
              chain: chain,
              'tags[]': tag,
            },
            (param) => !param,
          ),
        );
        setSavedDashboardIds([]);
        break;
      case LIST_ITEM_TYPE.QUERIES:
        setTabIndex(1);
        setItemType(ITEM_TYPE.QUERIES);
        setQueryParams(() =>
          _.omitBy(
            {
              search: search,
              orderBy: orderBy,
              chain: chain,
              'tags[]': tag,
            },
            (param) => !param,
          ),
        );
        setSavedQueryIds([]);
        break;
      case LIST_ITEM_TYPE.MYWORK:
      case LIST_ITEM_TYPE.SAVED:
        if (!user) {
          setTab(LIST_ITEM_TYPE.DASHBOARDS);
          break;
        }
        setItemType(type);
        setTabIndex(tabId === LIST_ITEM_TYPE.MYWORK ? 2 : 3);
        if (type === ITEM_TYPE.DASHBOARDS) {
          setDashboardParams(() =>
            _.omitBy(
              {
                search: search,
                orderBy: orderBy,
                'tags[]': tag,
              },
              (param) => !param,
            ),
          );
          setSavedDashboardIds([]);
        } else {
          setQueryParams(() =>
            _.omitBy(
              {
                search: search,
                orderBy: orderBy,
                'tags[]': tag,
              },
              (param) => !param,
            ),
          );
          setSavedQueryIds([]);
        }
        break;
      default:
        break;
    }
  }, [searchUrl, tab, itemType, user]);

  useEffect(() => {
    // user logs out when in My Work tab or Saved tab
    if (
      !user &&
      (tab === LIST_ITEM_TYPE.MYWORK || tab === LIST_ITEM_TYPE.SAVED)
    ) {
      history.push(ROUTES.HOME);
    }
  }, [user, tab]);

  const getSearchParam = (value?: string) => {
    return value?.trim() || undefined;
  };

  const getSavedDashboardIds = async (data: IDashboardDetail[]) => {
    if (!user) {
      return;
    }
    const dashboardIds = data.map((item) => item.id);
    if (!dashboardIds.length) {
      return;
    }
    const savedDashboards = await rf
      .getRequest('DashboardsRequest')
      .filterSavedDashboardsByIds(dashboardIds);
    if (!savedDashboards) {
      return;
    }
    setSavedDashboardIds((prevState) =>
      _.uniq([...prevState, ...savedDashboards]),
    );
  };

  const getSavedQueryIds = async (data: IQuery[]) => {
    if (!user) {
      return;
    }
    const queryIds = data.map((item) => item.id);
    if (!queryIds.length) {
      return;
    }
    const savedQueries = await rf
      .getRequest('DashboardsRequest')
      .filterSavedQueriesByIds(queryIds);
    if (!savedQueries) {
      return;
    }
    setSavedQueryIds((prevState) => _.uniq([...prevState, ...savedQueries]));
  };

  const onSaveSuccess = async (id: string, isSaved: boolean) => {
    const setState =
      itemType === ITEM_TYPE.DASHBOARDS
        ? setSavedDashboardIds
        : setSavedQueryIds;
    setState((prevState) =>
      isSaved
        ? prevState.filter((prevId) => prevId !== id)
        : [...prevState, id],
    );
  };

  const fetchAllDashboards = useCallback(
    async (params: RequestParams) => {
      try {
        const res = await rf.getRequest('DashboardsRequest').getAllDashboards({
          ...params,
          search: getSearchParam(params.search),
        });
        await getSavedDashboardIds(res.data);
        return { ...res, docs: res.data };
      } catch (error) {
        console.error(error);
      }
    },
    [dashboardParams, user],
  );

  const fetchMyDashboards = useCallback(
    async (params: RequestParams) => {
      try {
        const res = await rf
          .getRequest('DashboardsRequest')
          .getMyListDashboards({
            ...params,
            search: getSearchParam(params.search),
          });
        await getSavedDashboardIds(res.data);
        return { ...res, docs: res.data };
      } catch (error) {
        console.error(error);
      }
    },
    [dashboardParams, user],
  );

  const fetchMySavedDashboards = useCallback(
    async (params: RequestParams) => {
      try {
        const res = await rf
          .getRequest('DashboardsRequest')
          .getMySavedDashboards({
            ...params,
            search: getSearchParam(params.search),
          });
        setSavedDashboardIds((prevState) =>
          _.uniq([
            ...prevState,
            ...res.data.map((item: IDashboardDetail) => item.id),
          ]),
        );
        return { ...res, docs: res.data };
      } catch (error) {
        console.error(error);
      }
    },
    [dashboardParams, user],
  );

  const fetchAllQueries = useCallback(
    async (params: RequestParams) => {
      try {
        const res = await rf
          .getRequest('DashboardsRequest')
          .getAllQueries({ ...params, search: getSearchParam(params.search) });
        await getSavedQueryIds(res.data);
        return { ...res, docs: res.data };
      } catch (error) {
        console.error(error);
      }
    },
    [queryParams, user],
  );

  const fetchMyQueries = useCallback(
    async (params: RequestParams) => {
      try {
        const res = await rf.getRequest('DashboardsRequest').getMyListQueries({
          ...params,
          search: getSearchParam(params.search),
        });
        await getSavedQueryIds(res.data);
        return { ...res, docs: res.data };
      } catch (error) {
        console.error(error);
      }
    },
    [queryParams, user],
  );

  const fetchMySavedQueries = useCallback(
    async (params: RequestParams) => {
      try {
        const res = await rf.getRequest('DashboardsRequest').getMySavedQueries({
          ...params,
          search: getSearchParam(params.search),
        });
        setSavedQueryIds((prevState) =>
          _.uniq([...prevState, ...res.data.map((item: IQuery) => item.id)]),
        );
        return { ...res, docs: res.data };
      } catch (error) {
        console.error(error);
      }
    },
    [queryParams, user],
  );

  const _renderContentTable = useCallback(
    (appTable) => {
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
    (renderList: () => any) => {
      if (displayed === DisplayType.List) {
        return renderList();
      }
      return (
        <SimpleGrid
          className="infos"
          columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
          columnGap="20px"
          rowGap="20px"
        >
          {renderList()}
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

  const getSavedStatus = (id: string) => {
    if (tab === LIST_ITEM_TYPE.SAVED) {
      return true;
    }

    return itemType === ITEM_TYPE.DASHBOARDS
      ? savedDashboardIds.includes(id)
      : savedQueryIds.includes(id);
  };

  const _renderTable = (
    params: IDashboardParams | IQueriesParams,
    fetchData: (params: RequestParams) => Promise<any>,
  ) => (
    <AppDataTable
      requestParams={params}
      fetchData={fetchData}
      isInfiniteScroll
      renderHeader={_renderHeader}
      wrapperClassName="block-table"
      renderBody={(data) =>
        _renderBody(() => {
          let displayedData = [...data];
          if (tab === LIST_ITEM_TYPE.SAVED) {
            displayedData = displayedData.filter((item) =>
              itemType === ITEM_TYPE.DASHBOARDS
                ? savedDashboardIds.includes(item.id)
                : savedQueryIds.includes(item.id),
            );
          }
          if (!displayedData.length) {
            return (
              <div
                style={{
                  marginTop: '25px',
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                No data...
              </div>
            );
          }
          return displayedData.map((item) => {
            const isSaved = getSavedStatus(item.id);
            return (
              <ListItem
                key={item.id}
                item={item}
                type={tab}
                itemType={itemType}
                displayed={displayed}
                isSaved={isSaved}
                onSaveSuccess={() => onSaveSuccess(item.id, isSaved)}
              />
            );
          });
        })
      }
      renderLoading={() =>
        _renderSkeleton(
          [...Array(8)].map((_, index: number) => (
            <ListItem
              key={index}
              isLoading
              type={tab}
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
          _renderTable(dashboardParams, fetchAllDashboards),
        ),
      },
      {
        id: LIST_ITEM_TYPE.QUERIES,
        name: 'Queries',
        icon: <QueriesIcon />,
        content: _renderContentTable(
          _renderTable(queryParams, fetchAllQueries),
        ),
      },
    ];

    if (!!user) {
      tabs.push(
        ...[
          {
            id: LIST_ITEM_TYPE.MYWORK,
            name: 'My Work',
            icon: <IconMywork />,
            content: _renderContentTable(
              <>
                {itemType === ITEM_TYPE.DASHBOARDS && (
                  <Box>{_renderTable(dashboardParams, fetchMyDashboards)}</Box>
                )}
                {itemType === ITEM_TYPE.QUERIES && (
                  <Box>{_renderTable(queryParams, fetchMyQueries)}</Box>
                )}
              </>,
            ),
          },
          {
            id: LIST_ITEM_TYPE.SAVED,
            name: 'Saved',
            icon: <SavedListIcon />,
            content: _renderContentTable(
              <>
                {itemType === ITEM_TYPE.DASHBOARDS && (
                  <Box>
                    {_renderTable(dashboardParams, fetchMySavedDashboards)}
                  </Box>
                )}
                {itemType === ITEM_TYPE.QUERIES && (
                  <Box>{_renderTable(queryParams, fetchMySavedQueries)}</Box>
                )}
              </>,
            ),
          },
        ],
      );
    }
    return tabs;
  };

  const onChangeTab = (tabId: string) => {
    searchParams.delete(HOME_URL_PARAMS.TAB);
    searchParams.delete(HOME_URL_PARAMS.ITEM_TYPE);
    searchParams.delete(HOME_URL_PARAMS.SEARCH);
    searchParams.delete(HOME_URL_PARAMS.ORDERBY);
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
