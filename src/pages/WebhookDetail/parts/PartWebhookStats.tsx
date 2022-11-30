import React, { useCallback, useEffect, useState } from 'react';
import rf from 'src/requests/RequestFactory';
import AppStatics from 'src/components/AppStats';
import { useParams } from 'react-router';

interface IUserStats {
  totalThisMonth?: number;
  totalToday?: number;
  totalSuccessToday?: number;
}

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

  return <AppStatics type="WEBHOOK" stats={userStats} />;
};

export default PartWebhookStats;
