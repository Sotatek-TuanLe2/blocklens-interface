import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { keyStats } from 'src/components/AppStatistical';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import { ListStat } from 'src/pages/HomePage/parts/PartUserStats';
import moment from 'moment';
import { formatLargeNumber } from 'src/utils/utils-helper';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

interface IAppStats {
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
    label: 'Total Messages (24hrs)',
  },
  {
    key: 'activities',
    label: 'Total Activities (24hrs)',
  },
  {
    key: 'successRate',
    label: 'Success Rate (24hrs)',
  },
  {
    key: 'webhooks',
    label: 'Active Webhook',
  },
];

const PartAppStats = ({
  totalWebhookActive,
  totalWebhook,
}: {
  totalWebhookActive?: number;
  totalWebhook?: number;
}) => {
  const [appStats, setAppStats] = useState<IAppStats | any>({});
  const [dataChart, setDataChart] = useState<IAppStats[] | any>([]);
  const { id: appId } = useParams<{ id: string }>();
  const { billing: { plan: currentPlan } } = useSelector(
    (state: RootState) => state.user2,
  );

  const getAppStatsToday = useCallback(async () => {
    try {
      const res: IAppStats = await rf
        .getRequest('NotificationRequest')
        .getAppStatsToday(appId);
      setAppStats(res);
    } catch (error: any) {
      setAppStats({});
    }
  }, []);

  const getAppStats = useCallback(async () => {
    try {
      const res: IAppStats[] = await rf
        .getRequest('NotificationRequest')
        .getAppStats(appId, {
          from: moment().utc().subtract(24, 'hour').valueOf(),
          to: moment().utc().valueOf(),
          period: 'hour',
        });
      setDataChart(res);
    } catch (error: any) {
      setDataChart([]);
    }
  }, []);

  useEffect(() => {
    getAppStats().then();
    getAppStatsToday().then();
  }, []);

  const dataAppStats = useMemo(() => {
    return listStats.map((item) => {
      const getValue = (value?: number, total?: number) => {
        if (!total || !value) return '--';
        return `${formatLargeNumber(value)}/${formatLargeNumber(total)}`;
      };

      if (item.key === 'message') {
        return {
          ...item,
          value: getValue(
            +appStats.message,
            currentPlan?.notificationLimitation,
          ),
        };
      }

      if (item.key === 'activities') {
        return {
          ...item,
          value: `${formatLargeNumber(appStats.activities)}`,
        };
      }

      if (item.key === 'successRate') {
        if (
          appStats.messagesFailed > 1 &&
          appStats.messagesFailed === appStats.messagesSuccess
        ) {
          return {
            ...item,
            value: '0',
          };
        }

        return {
          ...item,
          value: +appStats.successRate || '--',
        };
      }

      if (item.key === 'webhooks') {
        return {
          ...item,
          value: getValue(totalWebhookActive, totalWebhook),
        };
      }
      return {
        ...item,
        value: appStats[item.key as keyStats],
      };
    });
  }, [appStats]);

  return <ListStat dataStats={dataAppStats} dataChart={dataChart} />;
};

export default PartAppStats;
