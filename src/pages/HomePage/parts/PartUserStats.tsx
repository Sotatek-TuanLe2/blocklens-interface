import { SimpleGrid } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import AppStatics from 'src/components/AppStats';
import rf from 'src/requests/RequestFactory';

export interface IUserStats {
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

const PartUserStats = () => {
  const [userStats, setUserStats] = useState<IUserStats>({});

  const getUserStats = useCallback(async () => {
    try {
      const res: IUserStats = await rf
        .getRequest('NotificationRequest')
        .getUserStats();
      setUserStats({ ...res, tottalActivities: res.totalToday });
    } catch (error: any) {
      setUserStats({});
    }
  }, []);

  useEffect(() => {
    getUserStats().then();
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
              userStats={userStats}
              labelStats={listUserStats}
              stats={stats}
            />
          </React.Fragment>
        );
      })}
    </SimpleGrid>
  );
};

export default PartUserStats;
