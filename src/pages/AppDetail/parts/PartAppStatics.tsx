import React, { useCallback, useEffect, useMemo, useState } from 'react';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import moment from 'moment';
import { RESOLUTION_TIME } from 'src/utils/utils-webhook';
import _ from 'lodash';
import {
  SAMPLE_DATA_CHART,
  fillFullResolution,
  formatDataStatistics,
} from 'src/utils/utils-app';
import AppListStatistics from 'src/components/AppListStatistics';

export interface IAppStats {
  message?: number;
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
      const res: IAppStats[] = await rf
        .getRequest('NotificationRequest')
        .getAppStats24h([projectId]);

      if (!res?.length) return;

      const [
        { messagesSuccess, messagesFailed, message, activities, successRate },
      ] = res;

      setAppStats({
        ...appStats,
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
    getAppStats().then();
  }, []);

  const dataAppStats = useMemo(() => {
    return formatDataStatistics(appStats, totalWebhookActive, totalWebhook);
  }, [appStats, totalWebhookActive, totalWebhook]);

  return <AppListStatistics dataStats={dataAppStats} dataChart={dataChart} />;
};

export default PartAppStats;
