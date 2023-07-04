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

interface IAppStats {
  message?: number;
  activities?: number;
  successRate?: number;
  webhooks?: number;
  messagesSuccess: number;
  messagesFailed: number;
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
  const { id: appId } = useParams<{ id: string }>();

  const getAppStats = useCallback(async () => {
    const formTime = moment().utc().subtract(24, 'hour').valueOf();
    const toTime = moment().utc().valueOf();

    try {
      const res: IAppStats[] = await rf
        .getRequest('NotificationRequest')
        .getAppStats(appId, {
          from: formTime,
          to: toTime,
          resolution: RESOLUTION_TIME.HOUR,
        });

      if (!res?.length) return;

      const totalMessage = _.sumBy(res, 'message');
      const totalActivity = _.sumBy(res, 'activities');
      const totalMessagesFailed = _.sumBy(res, 'messagesFailed');
      const totalMessagesSuccess = _.sumBy(res, 'messagesSuccess');
      const successRate = ((totalMessagesSuccess / totalMessage) * 100).toFixed(
        2,
      );

      setAppStats({
        ...appStats,
        messagesFailed: totalMessagesFailed,
        messagesSuccess: totalMessagesSuccess,
        message: totalMessage,
        activities: totalActivity,
        successRate: successRate,
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
    return formatDataStatistics(appStats, totalWebhookActive, totalWebhook)
  }, [appStats]);

  return <AppListStatistics dataStats={dataAppStats} dataChart={dataChart} />;
};

export default PartAppStats;
