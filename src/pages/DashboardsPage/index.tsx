import { AppDataTable, RequestParams } from 'src/components';
import AppTabs, { ITabs } from 'src/components/AppTabs';
import 'src/styles/pages/DashboardsPage.scss';
import rf from 'src/requests/RequestFactory';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DashboardsParams } from 'src/requests/DashboardsRequest';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';
import ListItem, { LIST_ITEM_TYPE } from './parts/ListItem';
import { Flex } from '@chakra-ui/react';

interface IDashboardParams extends RequestParams, DashboardsParams {}

const DashboardsPage: React.FC = () => {
  const { pathname } = useLocation();
  const [dashboardParams, setDashboardParams] = useState<IDashboardParams>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(pathname);
    const order = searchParams.get('order') || '';
    const time_range = searchParams.get('time_range') || '';
    const q = searchParams.get('q') || '';
    const tags = searchParams.get('tags') || '';

    setDashboardParams((prevState) => ({
      order: order || prevState.order,
      time_range: time_range || prevState.time_range,
      q: q || prevState.q,
      tags: tags || prevState.tags,
    }));
  }, [pathname]);

  const fetchDashboards: any = useCallback(
    async (params: IDashboardParams) => {
      try {
        const res: any = await rf
          .getRequest('DashboardsRequest')
          .getDashboards(params);
        return { docs: res };
      } catch (error) {
        toastError({ message: getErrorMessage(error) });
      }
    },
    [dashboardParams],
  );

  const tabs: ITabs[] = [
    {
      id: 'Dashboards',
      name: 'Dashboards',
      content: (
        <AppDataTable
          requestParams={dashboardParams}
          fetchData={fetchDashboards}
          renderBody={(data) =>
            data.map((item: any) => (
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
            ))
          }
        />
      ),
    },
    {
      id: 'Queries',
      name: 'Queries',
      content: null,
    },
    {
      id: 'Wizards',
      name: 'Wizards',
      content: null,
    },
    {
      id: 'Teams',
      name: 'Teams',
      content: null,
    },
  ];

  return (
    <Flex className="dashboards-page" justifyContent={'space-between'}>
      <div className="dashboard-list">
        <AppTabs tabs={tabs} />
      </div>
      <div className="dashboard-filter">
        <div className="dashboard-filter__search"></div>
        <div className="dashboard-filter__tags"></div>
      </div>
    </Flex>
  );
};

export default DashboardsPage;
