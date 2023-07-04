import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
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

interface IWebhookStats {
  message?: number;
  activities?: number;
  successRate?: number;
  webhooks?: number;
  messagesSuccess: number;
  messagesFailed: number;
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
      const res: IWebhookStats[] = await rf
        .getRequest('NotificationRequest')
        .getWebhookStats(webhookId, {
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

      setWebhookStats({
        ...webhookStats,
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
    getWebhookStats().then();
  }, []);

  const dataWebhookStats = useMemo(() => {
    return formatDataStatistics(webhookStats, totalWebhookActive, 1);
  }, [webhookStats]);

  return (
    <AppListStatistics dataStats={dataWebhookStats} dataChart={dataChart} />
  );
};

export default PartWebhookStats;
