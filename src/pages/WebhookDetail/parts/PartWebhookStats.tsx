import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { keyStats } from 'src/components/AppStatistical';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import { ListStat } from 'src/pages/HomePage/parts/PartUserStats';

interface IWebhookStats {
  messages?: number;
  activities?: number;
  successRate?: number;
  webhooks?: number;
  messagesSuccess: number;
  messagesFailed: number;
}

export const data = [
  {
    name: 'Page A',
    pv: 2400,
  },
  {
    name: 'Page B',
    pv: 1398,
  },
  {
    name: 'Page C',
    pv: 9800,
  },
  {
    name: 'Page D',
    pv: 3908,
  },
  {
    name: 'Page E',
    pv: 4800,
  },
  {
    name: 'Page F',
    pv: 3800,
  },
  {
    name: 'Page G',
    pv: 4300,
  },
];

export const listStats = [
  {
    key: 'messages',
    label: 'Total Messages (today)',
  },
  {
    key: 'activities',
    label: 'Total Activities (today)',
  },
  {
    key: 'successRate',
    label: 'Success Rate (today)',
  },
  {
    key: 'webhooks',
    label: 'Total Webhook',
  },
];

const PartWebhookStats = () => {
  const [webhookStats, setWebhookStats] = useState<IWebhookStats | any>({});
  const { id: webhookId } = useParams<{ id: string }>();

  const getWebhookStats = useCallback(async () => {
    try {
      const res: IWebhookStats = await rf
        .getRequest('NotificationRequest')
        .getWebhookStats(webhookId);
      setWebhookStats(res);
    } catch (error: any) {
      setWebhookStats({});
    }
  }, []);

  useEffect(() => {
    getWebhookStats().then();
  }, []);

  const dataWebhookStats = useMemo(() => {
    return listStats.map((item) => {
      if (item.key === 'messages')
        return {
          ...item,
          value: webhookStats.messagesFailed + webhookStats.messagesSuccess,
        };

      return {
        ...item,
        value: webhookStats[item.key as keyStats],
      };
    });
  }, [webhookStats]);

  return <ListStat dataStats={dataWebhookStats} />;
};

export default PartWebhookStats;
