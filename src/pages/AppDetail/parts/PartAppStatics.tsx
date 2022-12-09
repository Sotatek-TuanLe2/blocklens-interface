import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { keyStats } from 'src/components/AppStatistical';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import { ListStat } from 'src/pages/HomePage/parts/PartUserStats';

interface IAppStats {
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

const PartAppStats = () => {
  const [appStats, setAppStats] = useState<IAppStats | any>({});
  const { id: appId } = useParams<{ id: string }>();

  const getAppStats = useCallback(async () => {
    try {
      const res: IAppStats = await rf
        .getRequest('NotificationRequest')
        .getAppStats(appId);
      setAppStats(res);
    } catch (error: any) {
      setAppStats({});
    }
  }, []);

  useEffect(() => {
    getAppStats().then();
  }, []);

  const dataAppStats = useMemo(() => {
    return listStats.map((item) => {
      if (item.key === 'messages')
        return {
          ...item,
          value: appStats.messagesFailed + appStats.messagesSuccess,
        };

      return {
        ...item,
        value: appStats[item.key as keyStats],
      };
    });
  }, [appStats]);

  return <ListStat dataStats={dataAppStats} />;
};

export default PartAppStats;
