import { AppDataTable, RequestParams } from 'src/components';
import AppTabs, { ITabs } from 'src/components/AppTabs';
import 'src/styles/pages/DashboardsPage.scss';
import rf from 'src/requests/RequestFactory';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  DashboardsParams,
  QueriesParams,
  TeamsParams,
  WizardsParams,
} from 'src/requests/DashboardsRequest';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';
import ListItem from './parts/ListItem';
import { Flex, Tbody } from '@chakra-ui/react';
import { BasePage } from 'src/layouts';
import FilterSearch from './parts/FilterSearch';
import FilterTags from './parts/FilterTags';

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
    const time_range = searchParams.get('time_range') || '';
    const q = searchParams.get('q') || '';
    const tags = searchParams.get('tags') || '';

    switch (tabType) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        setDashboardParams((prevState) => ({
          order: order || prevState.order,
          time_range: time_range || prevState.time_range,
          q: q || prevState.q,
          tags: tags || prevState.tags,
        }));
        break;
      case LIST_ITEM_TYPE.QUERIES:
        setQueryParams((prevState) => ({
          order: order || prevState.order,
          q: q || prevState.q,
        }));
        break;
      case LIST_ITEM_TYPE.WIZARDS:
        setWizardParams((prevState) => ({
          q: q || prevState.q,
        }));
        break;
      case LIST_ITEM_TYPE.TEAMS:
        setTeamParams((prevState) => ({
          q: q || prevState.q,
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

  const tabs: ITabs[] = [
    {
      id: LIST_ITEM_TYPE.DASHBOARDS,
      name: 'Dashboards',
      content: (
        <AppDataTable
          requestParams={dashboardParams}
          fetchData={fetchDashboards}
          renderBody={(data) => (
            <Tbody>
              {data.map((item: any) => (
                <ListItem
                  author={item.user.name}
                  avatarUrl={item.user.profile_image_url}
                  createdAt={item.created_at}
                  starCount={item.dashboard_favorite_count_all.favorite_count}
                  title={item.name}
                  type={LIST_ITEM_TYPE.DASHBOARDS}
                  key={item.id}
                  tags={item.tags}
                />
              ))}
            </Tbody>
          )}
        />
      ),
    },
    {
      id: LIST_ITEM_TYPE.QUERIES,
      name: 'Queries',
      content: (
        <AppDataTable
          requestParams={queryParams}
          fetchData={fetchQueries}
          renderBody={(data) =>
            data.map((item: any) => (
              <ListItem
                author={item.user ? item.user.name : item.team.handle}
                avatarUrl={
                  item.user
                    ? item.user.profile_image_url
                    : item.team.profile_image_url
                }
                createdAt={item.created_at}
                starCount={item.query_favorite_count_last_7d.favorite_count}
                title={item.name}
                type={LIST_ITEM_TYPE.DASHBOARDS}
                key={item.id}
                tags={item.tags}
              />
            ))
          }
        />
      ),
    },
    {
      id: LIST_ITEM_TYPE.WIZARDS,
      name: 'Wizards',
      content: (
        <AppDataTable
          requestParams={wizardParams}
          fetchData={fetchWizards}
          renderBody={(data) =>
            data.map((item: any) => {
              return (
                <ListItem
                  author={item.name}
                  avatarUrl={item.profile_image_url}
                  starCount={item.dashboards.list
                    .map((item: any) => item.favoriteCount)
                    .reduce((a: number, b: number) => a + b)}
                  title={item.name}
                  type={LIST_ITEM_TYPE.WIZARDS}
                  key={item.id}
                />
              );
            })
          }
        />
      ),
    },
    {
      id: LIST_ITEM_TYPE.TEAMS,
      name: 'Teams',
      content: (
        <AppDataTable
          requestParams={teamParams}
          fetchData={fetchTeams}
          renderBody={(data) =>
            data.map((item: any) => (
              <ListItem
                author={item.name}
                avatarUrl={item.profile_image_url}
                starCount={item.received_stars}
                title={item.name}
                type={LIST_ITEM_TYPE.TEAMS}
                key={item.id}
                members={item.members.map((member: any) => ({
                  id: member.id,
                  name: member.name,
                  avatar: member.profile_image_url,
                }))}
              />
            ))
          }
        />
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
          <FilterTags type={tabType} />
        </div>
      </Flex>
    </BasePage>
  );
};

export default DashboardsPage;
