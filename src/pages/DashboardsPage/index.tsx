import { Flex, Tbody } from '@chakra-ui/react';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { DashboardsIcon, QueriesIcon } from 'src/assets/icons';
import { AppDataTable, RequestParams } from 'src/components';
import AppTabs, { ITabs } from 'src/components/AppTabs';
import { BasePage } from 'src/layouts';
import {
  DashboardsParams,
  QueriesParams,
} from 'src/requests/DashboardsRequest';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/DashboardsPage.scss';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import FilterSearch from './parts/FilterSearch';
import FilterTags from './parts/FilterTags';
import ListItem from './parts/ListItem';

export const LIST_ITEM_TYPE = {
  DASHBOARDS: 'DASHBOARDS',
  QUERIES: 'QUERIES',
};

interface IDashboardParams extends RequestParams, DashboardsParams {}
interface IQueriesParams extends RequestParams, QueriesParams {}

const DashboardsPage: React.FC = () => {
  const { search: searchUrl } = useLocation();
  const history = useHistory();

  const [tabType, setTabType] = useState<string>(LIST_ITEM_TYPE.DASHBOARDS);
  const [dashboardParams, setDashboardParams] = useState<IDashboardParams>({});
  const [queryParams, setQueryParams] = useState<IQueriesParams>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(searchUrl);
    const search = searchParams.get('search') || '';

    switch (tabType) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        setDashboardParams(() =>
          _.omitBy(
            {
              search: search,
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
    [queryParams],
  );

  const _renderContentTable = useCallback(
    (appTable: any) => {
      return (
        <>
          <div className="dashboard-filter dashboard-filter--mobile">
            <FilterSearch type={tabType} />
          </div>
          {appTable}

          <div className="dashboard-filter dashboard-filter--mobile">
            <FilterTags type={tabType} />
          </div>
        </>
      );
    },
    [tabType],
  );

  const tabs: ITabs[] = [
    {
      id: LIST_ITEM_TYPE.DASHBOARDS,
      name: 'Dashboards',
      icon: <DashboardsIcon />,
      content: _renderContentTable(
        <AppDataTable
          requestParams={dashboardParams}
          fetchData={fetchDashboards}
          limit={10}
          renderBody={(data) => (
            <Tbody>
              {data.map((item: any) => (
                <ListItem
                  key={item.id}
                  id={item.id}
                  author={item.name}
                  createdAt={item.createdAt}
                  title={item.name}
                  type={LIST_ITEM_TYPE.DASHBOARDS}
                  tags={item.tags}
                />
              ))}
            </Tbody>
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
          limit={10}
          renderBody={(data) =>
            data.map((item: any) => (
              <ListItem
                key={item.id}
                id={item.id}
                author={item.user}
                createdAt={item.createdAt}
                title={item.name}
                type={LIST_ITEM_TYPE.QUERIES}
                tags={item.tags}
              />
            ))
          }
        />,
      ),
    },
  ];

  const onChangeTab = (tabId: string) => {
    history.push('/dashboards');
    setTabType(tabId);
  };

  return (
    <BasePage>
      <Flex className="dashboards-page" justifyContent={'space-between'}>
        <div className="dashboard-list">
          <AppTabs tabs={tabs} onChange={onChangeTab} />
        </div>
        <div className="dashboard-filter">
          <FilterSearch type={tabType} />
        </div>
      </Flex>
    </BasePage>
  );
};

export default DashboardsPage;
