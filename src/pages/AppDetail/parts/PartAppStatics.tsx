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
        SAMPLE_DATA,
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
    return listStats.map((item) => {
      const getValue = (value?: number, total?: number) => {
        if (!total || !value) return '--';
        return `${formatLargeNumber(value)}/${formatLargeNumber(total)}`;
      };

      if (item.key === 'message') {
        return {
          ...item,
          value: `${formatLargeNumber(appStats.message)}`,
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
