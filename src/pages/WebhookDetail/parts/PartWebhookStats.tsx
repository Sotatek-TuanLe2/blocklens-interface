import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { keyStats } from 'src/components/AppStatistical';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import {
  fillFullResolution,
  ListStat,
  SAMPLE_DATA,
  listStats,
} from 'src/pages/HomePage/parts/PartUserStats';
import moment from 'moment';
import { formatLargeNumber } from 'src/utils/utils-helper';
import { RESOLUTION_TIME } from 'src/utils/utils-webhook';
import _ from 'lodash';

interface IWebhookStats {
  message?: number;
  activities?: number;
  successRate?: number;
  webhooks?: number;
  messagesSuccess: number;
  messagesFailed: number;
}

const PartWebhookStats = () => {
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
        SAMPLE_DATA,
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
        value: webhookStats[item.key as keyStats] || '--',
      };
    });
  }, [webhookStats]);

  return <ListStat dataStats={dataWebhookStats} dataChart={dataChart} />;
};

export default PartWebhookStats;
