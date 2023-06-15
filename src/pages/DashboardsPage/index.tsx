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
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import FilterSearch, { TYPE_MYWORK } from './parts/FilterSearch';
import ListItem from './parts/ListItem';

export const LIST_ITEM_TYPE = {
  DASHBOARDS: 'DASHBOARDS',
  QUERIES: 'QUERIES',
  MYWORK: 'MYWORK',
};

export const HOME_URL_PARAMS = {
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

  const [tab, setTab] = useState<string>(LIST_ITEM_TYPE.DASHBOARDS);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [dashboardParams, setDashboardParams] = useState<IDashboardParams>({});
  const [queryParams, setQueryParams] = useState<IQueriesParams>({});
  const [myWorkType, setMyWorkType] = useState<string>(TYPE_MYWORK.DASHBOARDS);

  const [displayed, setDisplayed] = useState<string>(DisplayType.Grid);

  useEffect(() => {
    const searchParams = new URLSearchParams(searchUrl);
    const search = searchParams.get(HOME_URL_PARAMS.SEARCH) || '';
    const sort = searchParams.get(HOME_URL_PARAMS.SORT) || '';
    const chain = searchParams.get(HOME_URL_PARAMS.CHAIN) || '';
    const tag = searchParams.get(HOME_URL_PARAMS.TAG) || '';

    switch (tab) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        setDashboardParams(() =>
          _.omitBy(
            {
              search: search,
              sort: sort,
              chain: chain,
              tags: tag,
            },
            (param) => !param,
          ),
        );
        break;
      case LIST_ITEM_TYPE.QUERIES:
        setQueryParams(() =>
          _.omitBy(
            {
              search: search,
              sort: sort,
              chain: chain,
              tags: tag,
            },
            (param) => !param,
          ),
        );
        break;
      case LIST_ITEM_TYPE.MYWORK:
        myWorkType === TYPE_MYWORK.DASHBOARDS
          ? setDashboardParams(() =>
              _.omitBy(
                {
                  search: search,
                  sort: sort,
                  tags: tag,
                },
                (param) => !param,
              ),
            )
          : setQueryParams(() =>
              _.omitBy(
                {
                  search: search,
                  sort: sort,
                  tags: tag,
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
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getAllDashboards(params);
        return { ...res, docs: res.data };
      } catch (error) {
        toastError({ message: getErrorMessage(error) });
      }
    },
    [dashboardParams],
  );

  const fetchMyDashboards: any = useCallback(
    async (params: any) => {
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getMyListDashboards(params);
        return { ...res, docs: res.data };
      } catch (error) {
        toastError({ message: getErrorMessage(error) });
      }
    },
    [dashboardParams],
  );

  const fetchAllQueries: any = useCallback(
    async (params: any) => {
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getAllQueries(params);
        return { ...res, docs: res.data };
      } catch (error) {
        toastError({ message: getErrorMessage(error) });
      }
    },
    [queryParams],
  );

  const fetchMyQueries: any = useCallback(
    async (params: any) => {
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getMyListQueries(params);
        return { ...res, docs: res.data };
      } catch (error) {
        toastError({ message: getErrorMessage(error) });
      }
    },
    [queryParams],
  );

  const _renderContentTable = useCallback(
    (appTable: any) => {
      return (
        <>
          <Box
            mt={'0 !important'}
            pb={{ base: '28px', lg: '34px' }}
            className="dashboard-filter"
          >
            <FilterSearch
              type={tab}
              displayed={displayed}
              setDisplayed={setDisplayed}
              myWorkType={myWorkType}
              changeMyWorkType={setMyWorkType}
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
          <Flex
            px={'26px'}
            mb={'6px'}
            display={{ base: 'none', lg: 'flex' }}
            className="table-header"
          >
            <Box w={'22%'} overflow={'hidden'} pr={2.5}>
              Name
            </Box>
            <Box w={'22%'} overflow={'hidden'} pr={2.5}>
              Creator
            </Box>
            <Box w={'15%'} overflow={'hidden'} pr={2.5}>
              chain
            </Box>
            <Box w={'15%'} overflow={'hidden'} pr={2.5}>
              date
            </Box>
            <Box w={'calc(26% - 24px)'} overflow={'hidden'} pr={2.5}>
              tag
            </Box>
            <Box w={'24px'}></Box>
          </Flex>
        ) : (
          <></>
        )}
      </>
    );
  }, [displayed]);

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
            limit={12}
            renderHeader={_renderHeader}
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
            fetchData={fetchAllQueries}
            limit={15}
            renderHeader={_renderHeader}
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
            {myWorkType === TYPE_MYWORK.DASHBOARDS && (
              <Box>
                <AppDataTable
                  requestParams={dashboardParams}
                  fetchData={fetchMyDashboards}
                  limit={12}
                  renderHeader={_renderHeader}
                  renderBody={(data) =>
                    _renderBody(
                      data.map((item: any) => (
                        <ListItem
                          key={item.id}
                          item={item}
                          type={LIST_ITEM_TYPE.MYWORK}
                          myWorkType={TYPE_MYWORK.DASHBOARDS}
                          displayed={displayed}
                        />
                      )),
                    )
                  }
                />
              </Box>
            )}
            {myWorkType === TYPE_MYWORK.QUERIES && (
              <Box>
                <AppDataTable
                  requestParams={queryParams}
                  fetchData={fetchMyQueries}
                  limit={15}
                  renderHeader={_renderHeader}
                  renderBody={(data) =>
                    _renderBody(
                      data.map((item: any) => (
                        <ListItem
                          key={item.id}
                          item={item}
                          type={LIST_ITEM_TYPE.MYWORK}
                          myWorkType={TYPE_MYWORK.QUERIES}
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

  const onChangeTab = (tabId: string, tabIndex: number) => {
    history.push(ROUTES.HOME);
    setTab(tabId);
    setTabIndex(tabIndex);
    setMyWorkType(TYPE_MYWORK.DASHBOARDS);
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
