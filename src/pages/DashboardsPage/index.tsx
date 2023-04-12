import { Flex, Tbody } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  AccountIcon,
  DashboardsIcon,
  QueriesIcon,
  TeamsIcon,
} from 'src/assets/icons';
import { AppDataTable, RequestParams } from 'src/components';
import AppTabs, { ITabs } from 'src/components/AppTabs';
import { BasePage } from 'src/layouts';
import {
  DashboardsParams,
  QueriesParams,
  TeamsParams,
  WizardsParams,
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
  WIZARDS: 'WIZARDS',
  TEAMS: 'TEAMS',
};

interface IDashboardParams extends RequestParams, DashboardsParams {}
interface IQueriesParams extends RequestParams, QueriesParams {}
interface IWizardsParams extends RequestParams, WizardsParams {}
interface ITeamsParams extends RequestParams, TeamsParams {}

const DashboardsPage: React.FC = () => {
  const { search: searchUrl } = useLocation();
  const history = useHistory();

  const [tabType, setTabType] = useState<string>(LIST_ITEM_TYPE.DASHBOARDS);
  const [dashboardParams, setDashboardParams] = useState<IDashboardParams>({});
  const [queryParams, setQueryParams] = useState<IQueriesParams>({});
  const [wizardParams, setWizardParams] = useState<IWizardsParams>({});
  const [teamParams, setTeamParams] = useState<ITeamsParams>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(searchUrl);
    const order = searchParams.get('order') || '';
    const timeRange = searchParams.get('timeRange') || '';
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags') || '';

    switch (tabType) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        setDashboardParams((prevState) => ({
          order: order || prevState.order,
          timeRange: timeRange || prevState.timeRange,
          search: search || prevState.search,
          tags: tags || prevState.tags,
        }));
        break;
      case LIST_ITEM_TYPE.QUERIES:
        setQueryParams((prevState) => ({
          order: order || prevState.order,
          search: search || prevState.search,
        }));
        break;
      case LIST_ITEM_TYPE.WIZARDS:
        setWizardParams((prevState) => ({
          search: search || prevState.search,
        }));
        break;
      case LIST_ITEM_TYPE.TEAMS:
        setTeamParams((prevState) => ({
          search: search || prevState.search,
        }));
        break;
      default:
        break;
    }
  }, [searchUrl]);

  const fetchDashboards: any = useCallback(
    async (params: any) => {
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getDashboards(params);
        return { docs: res, totalPages: Math.ceil(res.length / params.limit) };
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
          .getQueries(params);
        return { docs: res, totalPages: Math.ceil(res.length / params.limit) };
      } catch (error) {
        toastError({ message: getErrorMessage(error) });
      }
    },
    [queryParams],
  );

  const fetchWizards: any = useCallback(
    async (params: any) => {
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getWizards(params);
        return { docs: res, totalPages: Math.ceil(res.length / params.limit) };
      } catch (error) {
        toastError({ message: getErrorMessage(error) });
      }
    },
    [wizardParams],
  );

  const fetchTeams: any = useCallback(
    async (params: any) => {
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getTeams(params);
        return { docs: res, totalPages: Math.ceil(res.length / params.limit) };
      } catch (error) {
        toastError({ message: getErrorMessage(error) });
      }
    },
    [teamParams],
  );

  const appDataTableDashboard = () => {
    return (
      <AppDataTable
        requestParams={dashboardParams}
        fetchData={fetchDashboards}
        renderBody={(data) => (
          <Tbody>
            {data.map((item: any) => (
              <ListItem
                key={item.id}
                id={item.id}
                author={item.user.name}
                avatarUrl={item.user.avatarUrl}
                createdAt={item.createdAt}
                starCount={item.favoriteCount}
                title={item.name}
                type={LIST_ITEM_TYPE.DASHBOARDS}
                tags={item.tags}
              />
            ))}
          </Tbody>
        )}
      />
    );
  };

  const appDataTableQueries = () => {
    return (
      <AppDataTable
        requestParams={queryParams}
        fetchData={fetchQueries}
        renderBody={(data) =>
          data.map((item: any) => (
            <ListItem
              key={item.id}
              id={item.id}
              author={item.user ? item.user.name : item.team.name}
              avatarUrl={item.user ? item.user.avatarUrl : item.team.avatarUrl}
              createdAt={item.createdAt}
              starCount={item.favoriteCount}
              title={item.name}
              type={LIST_ITEM_TYPE.DASHBOARDS}
              tags={item.tags}
            />
          ))
        }
      />
    );
  };

  const appDataTableWizards = () => {
    return (
      <AppDataTable
        requestParams={wizardParams}
        fetchData={fetchWizards}
        renderBody={(data) =>
          data.map((item: any) => {
            return (
              <ListItem
                key={item.id}
                id={item.id}
                author={item.name}
                avatarUrl={item.profile_image_url}
                starCount={item.dashboards.list
                  .map((item: any) => item.favoriteCount)
                  .reduce((a: number, b: number) => a + b)}
                title={item.name}
                type={LIST_ITEM_TYPE.WIZARDS}
              />
            );
          })
        }
      />
    );
  };

  const appDataTableTeams = () => {
    return (
      <AppDataTable
        requestParams={teamParams}
        fetchData={fetchTeams}
        renderBody={(data) =>
          data.map((item: any) => (
            <ListItem
              key={item.id}
              id={item.id}
              author={item.name}
              avatarUrl={item.profile_image_url}
              starCount={item.received_stars}
              title={item.name}
              type={LIST_ITEM_TYPE.TEAMS}
              members={item.members.map((member: any) => ({
                id: member.id,
                name: member.name,
                avatar: member.profile_image_url,
              }))}
            />
          ))
        }
      />
    );
  };

  const _renderContentTable = useCallback(
    (appTable: any) => {
      return (
        <>
          <div className="dashboard-filter-mobile">
            <FilterSearch type={tabType} />
          </div>
          {appTable()}

          <div className="dashboard-filter-mobile">
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
      content: _renderContentTable(appDataTableDashboard),
    },
    {
      id: LIST_ITEM_TYPE.QUERIES,
      name: 'Queries',
      icon: <QueriesIcon />,
      content: _renderContentTable(appDataTableQueries),
    },
    {
      id: LIST_ITEM_TYPE.WIZARDS,
      name: 'Wizards',
      icon: <AccountIcon />,
      content: _renderContentTable(appDataTableWizards),
    },
    {
      id: LIST_ITEM_TYPE.TEAMS,
      name: 'Teams',
      icon: <TeamsIcon />,
      content: _renderContentTable(appDataTableTeams),
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
          <FilterTags type={tabType} />
        </div>
      </Flex>
    </BasePage>
  );
};

export default DashboardsPage;
