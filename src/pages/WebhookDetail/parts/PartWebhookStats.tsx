import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import moment from 'moment';
import { RESOLUTION_TIME } from 'src/utils/utils-webhook';
import {
  SAMPLE_DATA_CHART,
  fillFullResolution,
  formatDataStatistics,
} from 'src/utils/utils-app';
import AppListStatistics from 'src/components/AppListStatistics';
import { formatToPercent } from 'src/utils/utils-format';

export interface IWebhookStats {
  message: number;
  activities?: number;
  successRate?: number;
  webhooks?: number;
  messagesSuccess: number;
  messagesFailed: number;
  registrationId: string;
}

interface IPartWebhookStats {
  totalWebhookActive: number;
}

const PartWebhookStats: FC<IPartWebhookStats> = ({ totalWebhookActive }) => {
  const [webhookStats, setWebhookStats] = useState<IWebhookStats | any>({});
  const [dataChart, setDataChart] = useState<IWebhookStats[] | any>([]);
  const { id: webhookId } = useParams<{ id: string }>();

  const getWebhookStats = useCallback(async () => {
    const formTime = moment().utc().subtract(24, 'hour').valueOf();
    const toTime = moment().utc().valueOf();

    try {
      const responses = await Promise.allSettled([
        rf.getRequest('NotificationRequest').getWebhookStats24h([webhookId]),
        rf.getRequest('NotificationRequest').getWebhookStats(webhookId, {
          from: formTime,
          to: toTime,
          resolution: RESOLUTION_TIME.HOUR,
        }),
      ]);

      const [webhookStats24h, webhookStatsChart] = responses;

      if (
        webhookStats24h.status === 'fulfilled' &&
        !!webhookStats24h.value.length
      ) {
        const [{ messagesSuccess, messagesFailed, message, activities }] =
          webhookStats24h.value;

        setWebhookStats({
          ...webhookStats,
          messagesFailed,
          messagesSuccess,
          message,
          activities,
          successRate: formatToPercent(messagesSuccess / message),
        });
      }

      if (
        webhookStatsChart.status === 'fulfilled' &&
        !!webhookStatsChart.value.length
      ) {
        const dataFilled = fillFullResolution(
          formTime,
          toTime,
          RESOLUTION_TIME.HOUR,
          webhookStatsChart.value,
          SAMPLE_DATA_CHART,
        );

        setDataChart(dataFilled);
      }
    } catch (error: any) {
      setDataChart([]);
    }
  }, []);

  useEffect(() => {
    getWebhookStats().then();
  }, []);

  const dataWebhookStats = useMemo(() => {
    return formatDataStatistics(webhookStats, totalWebhookActive, 1);
  }, [webhookStats, totalWebhookActive]);

  return (
    <AppListStatistics dataStats={dataWebhookStats} dataChart={dataChart} />
  );
};

export default PartWebhookStats;
