import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { DashboardListIcon, IconMywork, QueriesIcon } from 'src/assets/icons';
import { AppDataTable, RequestParams } from 'src/components';
import AppTabs, { ITabs } from 'src/components/AppTabs';
import { VisibilityGridDashboardList } from 'src/constants';
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
import FilterSearch from './parts/FilterSearch';
import ListItem from './parts/ListItem';

export const LIST_ITEM_TYPE = {
  DASHBOARDS: 'DASHBOARDS',
  QUERIES: 'QUERIES',
  MYWORK: 'MYWORK',
};

interface IDashboardParams extends RequestParams, DashboardsParams {}
interface IQueriesParams extends RequestParams, QueriesParams {}

const DashboardsPage: React.FC = () => {
  const { search: searchUrl } = useLocation();
  const history = useHistory();

  const [tabType, setTabType] = useState<string>(LIST_ITEM_TYPE.DASHBOARDS);
  const [dashboardParams, setDashboardParams] = useState<IDashboardParams>({});
  const [queryParams, setQueryParams] = useState<IQueriesParams>({});
  const [myWorkType, setMyWorkType] = useState<string>('dashboard');

  const [visibility, setVisibility] = useState<VisibilityGridDashboardList>(
    VisibilityGridDashboardList.COLUMN,
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(searchUrl);
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || '';
    const chain = searchParams.get('chain') || '';
    const tags = searchParams.get('tags') || '';

    switch (tabType) {
      case LIST_ITEM_TYPE.DASHBOARDS:
      case LIST_ITEM_TYPE.QUERIES:
        setDashboardParams(() =>
          _.omitBy(
            {
              search: search,
              sort: sort,
              chain: chain,
              tags: tags,
            },
            (param) => !param,
          ),
        );
        break;
      case LIST_ITEM_TYPE.MYWORK:
        setQueryParams(() =>
          _.omitBy(
            {
              search: search,
              sort: sort,
              tags: tags,
            },
            (param) => !param,
          ),
        );
        break;
      default:
        break;
    }
  }, [searchUrl, tabType]);

  const fetchDashboards: any = useCallback(
    async (params: any) => {
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getListBrowseDashboard(params);
        return { ...res, docs: res.data };
      } catch (error) {
        toastError({ message: getErrorMessage(error) });
      }
    },
    [dashboardParams],
  );

  const fetchQueries: any = useCallback(
    async (params: any) => {
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getListBrowseQueries(params);
        return { ...res, docs: res.data };
      } catch (error) {
        toastError({ message: getErrorMessage(error) });
      }
    },
    [queryParams, myWorkType],
  );

  const _renderContentTable = useCallback(
    (appTable: any) => {
      return (
        <>
          <div className="dashboard-filter">
            <FilterSearch
              type={tabType}
              typeVisiable={visibility}
              setVisibility={setVisibility}
              myWorkType={myWorkType}
              setMyWorkType={setMyWorkType}
            />
          </div>
          <Box mt={'34px'}>{appTable}</Box>
        </>
      );
    },
    [tabType, visibility, myWorkType],
  );

  const _renderBody = useCallback(
    (listItem: any) => {
      return (
        <>
          {visibility === VisibilityGridDashboardList.COLUMN ? (
            <SimpleGrid
              className="infos"
              columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
              gap="18px"
            >
              {listItem}
            </SimpleGrid>
          ) : (
            <>{listItem}</>
          )}
        </>
      );
    },
    [visibility],
  );

  const _renderHeader = useCallback(() => {
    return (
      <>
        {visibility === VisibilityGridDashboardList.ROW ? (
          <div className="dashboard-list__header">
            <div className="item-title">Name</div>
            <div className="item-creator">Creator</div>
            <div className="item-chain">chain</div>
            <div className="item-date">date</div>
            <div className="item-tag">tag</div>
            {/* <div className="item-like">like</div> */}
            <div className="item-btn"></div>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }, [visibility]);

  const tabs: ITabs[] = [
    {
      id: LIST_ITEM_TYPE.DASHBOARDS,
      name: 'Dashboards',
      icon: <DashboardListIcon />,
      content: _renderContentTable(
        <AppDataTable
          requestParams={dashboardParams}
          fetchData={fetchDashboards}
          limit={12}
          renderHeader={_renderHeader}
          renderBody={(data) => (
            <>
              {_renderBody(
                data.map((item: any) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    type={LIST_ITEM_TYPE.DASHBOARDS}
                    typeVisiable={visibility}
                    myWorkType={myWorkType}
                  />
                )),
              )}
            </>
          )}
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
          fetchData={fetchQueries}
          limit={15}
          renderHeader={_renderHeader}
          renderBody={(data) => (
            <>
              {_renderBody(
                data.map((item: any) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    type={LIST_ITEM_TYPE.QUERIES}
                    typeVisiable={visibility}
                    myWorkType={myWorkType}
                  />
                )),
              )}
            </>
          )}
        />,
      ),
    },
    {
      id: LIST_ITEM_TYPE.MYWORK,
      name: 'My Work',
      icon: <IconMywork />,
      content: _renderContentTable(
        <AppDataTable
          requestParams={queryParams}
          fetchData={fetchQueries}
          limit={15}
          renderHeader={_renderHeader}
          renderBody={(data) => (
            <>
              {_renderBody(
                data.map((item: any) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    type={LIST_ITEM_TYPE.MYWORK}
                    typeVisiable={visibility}
                    myWorkType={myWorkType}
                  />
                )),
              )}
            </>
          )}
        />,
      ),
    },
  ];

  const onChangeTab = (tabId: string) => {
    history.push(ROUTES.HOME);
    setTabType(tabId);
  };

  return (
    <BasePage>
      <Flex
        flexDirection="column"
        className="dashboards-page"
        justifyContent={'space-between'}
      >
        <div className="dashboard-list">
          <AppTabs tabs={tabs} onChange={onChangeTab} />
        </div>
      </Flex>
    </BasePage>
  );
};

export default DashboardsPage;
