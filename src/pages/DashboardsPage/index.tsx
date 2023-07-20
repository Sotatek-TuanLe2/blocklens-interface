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
};

export const MY_WORK_TYPE = {
  DASHBOARDS: 'dashboards',
  QUERIES: 'queries',
};

export const HOME_URL_PARAMS = {
  TAB: 'tab',
  MYWORK: 'my-work',
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
  const [myWorkType, setMyWorkType] = useState<string>(MY_WORK_TYPE.DASHBOARDS);

  const [displayed, setDisplayed] = useState<string>(DisplayType.Grid);

  useEffect(() => {
    const tabId =
      searchParams.get(HOME_URL_PARAMS.TAB) || LIST_ITEM_TYPE.DASHBOARDS;
    const myWork =
      searchParams.get(HOME_URL_PARAMS.MYWORK) || MY_WORK_TYPE.DASHBOARDS;
    const search = searchParams.get(HOME_URL_PARAMS.SEARCH) || '';
    const sort = searchParams.get(HOME_URL_PARAMS.SORT) || '';
    const chain = searchParams.get(HOME_URL_PARAMS.CHAIN) || '';
    const tag = searchParams.get(HOME_URL_PARAMS.TAG) || '';

    setTab(tabId);
    setMyWorkType(myWork);

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
        myWork === MY_WORK_TYPE.DASHBOARDS
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
  }, [searchUrl, tab, myWorkType]);

  useEffect(() => {
    // user logs out when in My Work tab
    if (!user && tab === LIST_ITEM_TYPE.MYWORK) {
      setTab(LIST_ITEM_TYPE.DASHBOARDS);
      setTabIndex(0);
    }
  }, [user]);

  const fetchAllDashboards: any = useCallback(
    async (params: any) => {
      const paramsDashboard = { ...params, search: params.search?.trim() };
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getAllDashboards(paramsDashboard);
        return { ...res, docs: res.data };
      } catch (error) {
        console.error(error);
      }
    },
    [dashboardParams],
  );

  const fetchMyDashboards: any = useCallback(
    async (params: any) => {
      const paramsMyDashboard = { ...params, search: params.search?.trim() };
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getMyListDashboards(paramsMyDashboard);
        return { ...res, docs: res.data };
      } catch (error) {
        console.error(error);
      }
    },
    [dashboardParams],
  );

  const fetchAllQueries: any = useCallback(
    async (params: any) => {
      const paramsAllQueries = { ...params, search: params.search?.trim() };
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getAllQueries(paramsAllQueries);
        return { ...res, docs: res.data };
      } catch (error) {
        console.error(error);
      }
    },
    [queryParams],
  );

  const fetchMyQueries: any = useCallback(
    async (params: any) => {
      const paramsMyQueries = { ...params, search: params.search?.trim() };
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getMyListQueries(paramsMyQueries);
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
              myWorkType={myWorkType}
            />
          </Box>
          <Box>{appTable}</Box>
        </>
      );
    },
    [tab, myWorkType, displayed],
  );

  const _renderBody = useCallback(
    (listItem: any) => {
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
    },
    [tab, myWorkType, displayed],
  );

  const _renderHeader = useCallback(() => {
    return (
      <>
        {displayed === DisplayType.List ? (
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
        ) : (
          <></>
        )}
      </>
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

  const generateTabs = (): ITabs[] => {
    const tabs: ITabs[] = [
      {
        id: LIST_ITEM_TYPE.DASHBOARDS,
        name: 'Dashboards',
        icon: <DashboardListIcon />,
        content: _renderContentTable(
          <AppDataTable
            requestParams={dashboardParams}
            fetchData={fetchAllDashboards}
            isInfiniteScroll
            renderHeader={_renderHeader}
            wrapperClassName="block-table"
            renderBody={(data) =>
              _renderBody(
                data.map((item: any) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    type={LIST_ITEM_TYPE.DASHBOARDS}
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
                    type={LIST_ITEM_TYPE.DASHBOARDS}
                    displayed={displayed}
                  />
                )),
              )
            }
          />,
        ),
      },
      {
        id: LIST_ITEM_TYPE.QUERIES,
        name: 'Queries',
        icon: <QueriesIcon />,
        content: _renderContentTable(
          <AppDataTable
            requestParams={queryParams}
            isInfiniteScroll
            fetchData={fetchAllQueries}
            renderHeader={_renderHeader}
            wrapperClassName="block-table"
            renderBody={(data) =>
              _renderBody(
                data.map((item: any) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    type={LIST_ITEM_TYPE.QUERIES}
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
                    type={LIST_ITEM_TYPE.QUERIES}
                    displayed={displayed}
                  />
                )),
              )
            }
          />,
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
            {myWorkType === MY_WORK_TYPE.DASHBOARDS && (
              <Box>
                <AppDataTable
                  requestParams={dashboardParams}
                  isInfiniteScroll
                  fetchData={fetchMyDashboards}
                  renderHeader={_renderHeader}
                  wrapperClassName="block-table"
                  renderBody={(data) =>
                    _renderBody(
                      data.map((item: any) => (
                        <ListItem
                          key={item.id}
                          item={item}
                          type={LIST_ITEM_TYPE.MYWORK}
                          myWorkType={MY_WORK_TYPE.DASHBOARDS}
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
                          type={LIST_ITEM_TYPE.MYWORK}
                          myWorkType={MY_WORK_TYPE.DASHBOARDS}
                          displayed={displayed}
                        />
                      )),
                    )
                  }
                />
              </Box>
            )}
            {myWorkType === MY_WORK_TYPE.QUERIES && (
              <Box>
                <AppDataTable
                  requestParams={queryParams}
                  fetchData={fetchMyQueries}
                  isInfiniteScroll
                  renderHeader={_renderHeader}
                  wrapperClassName="block-table"
                  renderBody={(data) =>
                    _renderBody(
                      data.map((item: any) => (
                        <ListItem
                          key={item.id}
                          item={item}
                          type={LIST_ITEM_TYPE.MYWORK}
                          myWorkType={MY_WORK_TYPE.QUERIES}
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
                          type={LIST_ITEM_TYPE.MYWORK}
                          myWorkType={MY_WORK_TYPE.QUERIES}
                          displayed={displayed}
                        />
                      )),
                    )
                  }
                />
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
    searchParams.delete(HOME_URL_PARAMS.MYWORK);
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
