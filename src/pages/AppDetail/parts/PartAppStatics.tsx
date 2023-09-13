import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

export interface IAppStats {
  message: number;
  activities?: number;
  successRate?: number;
  webhooks?: number;
  messagesSuccess: number;
  messagesFailed: number;
  projectId: string;
}

const PartAppStats = ({
  totalWebhookActive,
  totalWebhook,
}: {
  totalWebhookActive?: number;
  totalWebhook?: number;
}) => {
  const [appStats, setAppStats] = useState<IAppStats | any>({});
  const [dataChart, setDataChart] = useState<IAppStats[] | any>([]);
  const { id: projectId } = useParams<{ id: string }>();

  const getAppStats = useCallback(async () => {
    const formTime = moment().utc().subtract(24, 'hour').valueOf();
    const toTime = moment().utc().valueOf();

    try {
      const responses = await Promise.allSettled([
        rf.getRequest('NotificationRequest').getAppStats24h([projectId]),
        rf.getRequest('NotificationRequest').getAppStats(projectId, {
          from: formTime,
          to: toTime,
          resolution: RESOLUTION_TIME.HOUR,
        }),
      ]);

      const [appStats24h, appStatsChart] = responses;

      if (appStats24h.status === 'fulfilled' && !!appStats24h.value.length) {
        const [{ messagesSuccess, messagesFailed, message, activities }] =
          appStats24h.value;

        setAppStats({
          ...appStats,
          messagesFailed,
          messagesSuccess,
          message,
          activities,
          successRate: formatToPercent(messagesSuccess / message),
        });
      }

      if (
        appStatsChart.status === 'fulfilled' &&
        !!appStatsChart.value.length
      ) {
        const dataFilled = fillFullResolution(
          formTime,
          toTime,
          RESOLUTION_TIME.HOUR,
          appStatsChart.value,
          SAMPLE_DATA_CHART,
        );

        setDataChart(dataFilled);
      }
    } catch (error: any) {
      setDataChart([]);
    }
  }, []);

  useEffect(() => {
    getAppStats().then();
  }, []);

  const dataAppStats = useMemo(() => {
    return formatDataStatistics(appStats, totalWebhookActive, totalWebhook);
  }, [appStats, totalWebhookActive, totalWebhook]);

  return <AppListStatistics dataStats={dataAppStats} dataChart={dataChart} />;
};

export default PartAppStats;
