import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { keyStats } from 'src/components/AppStatistical';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import { ListStat } from 'src/pages/HomePage/parts/PartUserStats';
import moment from 'moment';
import { formatLargeNumber } from '../../../utils/utils-helper';

interface IWebhookStats {
  message?: number;
  activities?: number;
  successRate?: number;
  webhooks?: number;
  messagesSuccess: number;
  messagesFailed: number;
}

export const listStats = [
  {
    key: 'message',
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
    label: 'Active Webhook',
  },
];

const PartWebhookStats = () => {
  const [webhookStats, setWebhookStats] = useState<IWebhookStats | any>({});
  const [dataChart, setDataChart] = useState<IWebhookStats[] | any>([]);
  const { id: webhookId } = useParams<{ id: string }>();

  const getWebhookStatsToday = useCallback(async () => {
    try {
      const res: IWebhookStats = await rf
        .getRequest('NotificationRequest')
        .getWebhookStatsToday(webhookId);
      setWebhookStats(res);
    } catch (error: any) {
      setWebhookStats({});
    }
  }, []);

  const getWebhookStats = useCallback(async () => {
    try {
      const res: IWebhookStats[] = await rf
        .getRequest('NotificationRequest')
        .getWebhookStats(webhookId, {
          from: moment().utc().startOf('day').valueOf(),
          to: moment().utc().valueOf(),
          period: 'hour',
        });
      setDataChart(res);
    } catch (error: any) {
      setDataChart([]);
    }
  }, []);

  useEffect(() => {
    getWebhookStatsToday().then();
    getWebhookStats().then();
  }, []);

  const dataWebhookStats = useMemo(() => {
    return listStats.map((item) => {
      if (item.key === 'message') {
        return {
          ...item,
          value: `${formatLargeNumber(webhookStats.message)}`,
        };
      }

      if (item.key === 'activities') {
        return {
          ...item,
          value: `${formatLargeNumber(webhookStats.activities)}`,
        };
      }

      if (item.key === 'successRate') {
        if (
          webhookStats.messagesFailed > 1 &&
          webhookStats.messagesFailed === webhookStats.messagesSuccess
        ) {
          return {
            ...item,
            value: '0',
          };
        }

        return {
          ...item,
          value: +webhookStats.successRate || '--',
        };
      }

      return {
        ...item,
        value: webhookStats[item.key as keyStats],
      };
    });
  }, [webhookStats]);

  return <ListStat dataStats={dataWebhookStats} dataChart={dataChart} />;
};

export default PartWebhookStats;
