import React, { useCallback, useEffect, useState } from 'react';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import AppStatics from 'src/components/AppStats';
import { SimpleGrid } from '@chakra-ui/react';

interface IAppStats {
  totalThisMonth?: number;
  totalToday?: number;
  totalSuccessToday?: number;
  tottalActivities?: number;
}

const listUserStats = [
  {
    key: 'totalToday',
    label: 'Total Messages (today)',
  },
  {
    key: 'totalThisMonth',
    label: 'Total Webhook',
  },
  {
    key: 'totalSuccessToday',
    label: 'Success Rate (today)',
  },
  {
    key: 'tottalActivities',
    label: 'Total Activities (today)',
  },
];

const PartAppStatics = () => {
  const { id: appId } = useParams<{ id: string }>();
  const [appStats, setAppStats] = useState<IAppStats>({});

  const getAppStats = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('NotificationRequest')
        .getAppStats(appId)) as any;
      setAppStats(res);
    } catch (error: any) {
      setAppStats({});
    }
  }, [appId]);

  useEffect(() => {
    getAppStats().then();
  }, []);

  return (
    <SimpleGrid
      className="infos"
      columns={{ base: 1, sm: 2, lg: 4 }}
      gap="20px"
    >
      {listUserStats.map((stats, index: number) => {
        return (
          <React.Fragment key={`${index} stats`}>
            <AppStatics
              userStats={appStats}
              labelStats={listUserStats}
              stats={stats}
            />
          </React.Fragment>
        );
      })}
    </SimpleGrid>
  );
};

export default PartAppStatics;
