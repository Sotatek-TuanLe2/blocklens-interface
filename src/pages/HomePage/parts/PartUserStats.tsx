import React, { useCallback, useEffect, useMemo, useState, FC } from 'react';
import rf from 'src/requests/RequestFactory';
import moment from 'moment';
import _ from 'lodash';
import { RESOLUTION_TIME } from 'src/utils/utils-webhook';

import {
  SAMPLE_DATA_CHART,
  fillFullResolution,
  formatDataStatistics,
} from 'src/utils/utils-app';
import AppListStatistics from '../../../components/AppListStatistics';
import { formatToPercent } from 'src/utils/utils-format';

interface IUserStats {
  message: number;
  activities?: number;
  successRate?: number;
  webhooks?: number;
  messagesSuccess: number;
  messagesFailed: number;
}

const PartUserStats = ({
  totalWebhookActive,
  totalWebhook,
}: {
  totalWebhookActive?: number;
  totalWebhook?: number;
}) => {
  const [userStatsToday, setUserStatsToday] = useState<IUserStats | any>({});
  const [dataChart, setDataChart] = useState<IUserStats[] | any>([]);

  const getUserStats = useCallback(async () => {
    const formTime = moment().utc().subtract(24, 'hour').valueOf();
    const toTime = moment().utc().valueOf();

    try {
      const responses = await Promise.allSettled([
        rf.getRequest('NotificationRequest').getUserStats24h(),
        rf.getRequest('NotificationRequest').getUserStats({
          from: formTime,
          to: toTime,
          resolution: RESOLUTION_TIME.HOUR,
        }),
      ]);

      const [userStats24h, userStatsChart] = responses;

      if (userStats24h.status === 'fulfilled') {
        const { messagesSuccess, messagesFailed, message, activities } =
          userStats24h.value;

        setUserStatsToday({
          ...userStatsToday,
          messagesFailed,
          messagesSuccess,
          message,
          activities,
          successRate: formatToPercent(messagesSuccess / message),
        });
      }

      if (
        userStatsChart.status === 'fulfilled' &&
        !!userStatsChart.value.length
      ) {
        const dataFilled = fillFullResolution(
          formTime,
          toTime,
          RESOLUTION_TIME.HOUR,
          userStatsChart.value,
          SAMPLE_DATA_CHART,
        );

        setDataChart(dataFilled);
      }
    } catch (error: any) {
      setDataChart([]);
    }
  }, []);

  useEffect(() => {
    getUserStats().then();
  }, []);

  const dataUserStatsToday = useMemo(() => {
    return formatDataStatistics(
      userStatsToday,
      totalWebhookActive,
      totalWebhook,
    );
  }, [userStatsToday, totalWebhookActive, totalWebhook]);

  return (
    <AppListStatistics dataStats={dataUserStatsToday} dataChart={dataChart} />
  );
};

export default PartUserStats;
