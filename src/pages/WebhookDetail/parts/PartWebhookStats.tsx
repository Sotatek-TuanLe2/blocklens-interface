import React, { useCallback, useEffect, useState } from 'react';
import rf from 'src/requests/RequestFactory';
import AppStatics from 'src/components/AppStats';
import { useParams } from 'react-router';
import { SimpleGrid } from '@chakra-ui/react';

interface IUserStats {
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

const PartWebhookStats = () => {
  const { id: webhookId } = useParams<{ id: string }>();
  const [userStats, setUserStats] = useState<IUserStats>({});

  const getWebhookStats = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('NotificationRequest')
        .getWebhookStats(webhookId)) as any;
      setUserStats(res);
    } catch (error: any) {
      setUserStats({});
    }
  }, [webhookId]);

  useEffect(() => {
    getWebhookStats().then();
  }, [webhookId]);

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

export default PartWebhookStats;
