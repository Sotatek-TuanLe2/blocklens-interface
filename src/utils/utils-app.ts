import { ReactNode } from 'react';
import moment from 'moment';
import { RESOLUTION_TIME } from './utils-webhook';
import { formatLargeNumber } from './utils-helper';
import { keyStats } from '../components/AppStatistical';

export enum APP_STATUS {
  DISABLED = 0,
  ENABLE = 1,
}

export interface IAppResponse {
  appId: string;
  userId: string;
  name?: string;
  description?: string;
  chain: string;
  network: string;
  key: string;
  status: APP_STATUS;
  createdAt: number;
  totalWebhook?: number;
  messageToday?: number;
}

export interface IDataMenu {
  value: string;
  icon?: ReactNode;
  label: ReactNode;
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

export const SAMPLE_DATA_CHART = {
  message: 0,
  activities: 0,
  successRate: 0,
  webhooks: 0,
  messagesSuccess: 0,
  messagesFailed: 0,
};

export interface IDataChart {
  activities: number;
  message: number;
  time: number;
}

export const getParamsChart = (duration: string) => {
  if (duration === '24h') {
    return {
      from: moment().utc().subtract(24, 'hour').valueOf(),
      to: moment().utc().valueOf(),
      resolution: RESOLUTION_TIME.HOUR,
    };
  }

  if (duration === '7d') {
    return {
      from: moment().utc().subtract(7, 'days').valueOf(),
      to: moment().utc().valueOf(),
      resolution: RESOLUTION_TIME.DAY,
    };
  }

  return {
    from: moment().utc().subtract(30, 'days').valueOf(),
    to: moment().utc().valueOf(),
    resolution: RESOLUTION_TIME.DAY,
  };
};

export const isChartEmpty = (dataChart: IDataChart[]) => {
  return (
    !dataChart.length ||
    dataChart.every(
      (item: IDataChart) =>
        item.message === 0 &&
        dataChart.every((item: IDataChart) => item.activities === 0),
    )
  );
};

const getStartOfByResolution = (timestamp: number, resolution: number) => {
  return timestamp - (timestamp % resolution);
};

export const fillFullResolution = (
  from: number,
  to: number,
  resolution: number,
  data: any,
  sampleData: any,
) => {
  const dataByKey: any[] = [];
  data.map((e: any) => {
    dataByKey[e.time] = e;
  });

  const result = [];
  const convertedResolution = resolution * 1000;
  let fromStartOfByResolution = getStartOfByResolution(
    from,
    convertedResolution,
  );

  const toStartOfByResolution = getStartOfByResolution(to, convertedResolution);

  while (fromStartOfByResolution <= toStartOfByResolution) {
    if (!dataByKey[fromStartOfByResolution]) {
      result.push({
        ...sampleData,
        time: fromStartOfByResolution,
      });
    } else {
      result.push(dataByKey[fromStartOfByResolution]);
    }
    fromStartOfByResolution = fromStartOfByResolution + convertedResolution;
  }

  return result;
};

export const formatDataStatistics = (
  data: {
    message: number;
    activities: number;
    messagesFailed: number;
    messagesSuccess: number;
    successRate: string;
    webhooks: number;
  },
  totalWebhookActive?: number,
  totalWebhook?: number,
) => {
  return listStats.map((item) => {
    const getValue = (value?: number, total?: number) => {
      if (!total || !value) return '--';
      return `${formatLargeNumber(value)}/${formatLargeNumber(total)}`;
    };


    if (item.key === 'message') {
      return {
        ...item,
        value: `${formatLargeNumber(data.message)}`,
      };
    }

    if (item.key === 'activities') {
      return {
        ...item,
        value: `${formatLargeNumber(data.activities)}`,
      };
    }

    if (item.key === 'successRate') {
      if (
        data.messagesFailed > 1 &&
        data.messagesFailed === data.messagesSuccess
      ) {
        return {
          ...item,
          value: '--',
        };
      }

      return {
        ...item,
        value: +data.successRate || '--',
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
      value: data[item.key as keyStats] || '--',
    };
  });
};
