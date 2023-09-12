import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState, FC } from 'react';
import { isMobile } from 'react-device-detect';
import AppStatistical from 'src/components/AppStatistical';
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

interface IUserStats {
  message?: number;
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
      const res: IUserStats = await rf
        .getRequest('NotificationRequest')
        .getUserStats24h();

      if (!res) {
        return;
      }

      const {
        messagesSuccess,
        messagesFailed,
        message,
        activities,
        successRate,
      } = res;

      setUserStatsToday({
        ...userStatsToday,
        messagesFailed,
        messagesSuccess,
        message,
        activities,
        successRate,
      });

      const dataFilled = fillFullResolution(
        formTime,
        toTime,
        RESOLUTION_TIME.HOUR,
        res,
        SAMPLE_DATA_CHART,
      );

      setDataChart(dataFilled);
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
