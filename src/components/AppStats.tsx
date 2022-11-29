import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { FC } from 'react';
import { AppCard } from 'src/components';
import { formatLargeNumber } from 'src/utils/utils-helper';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface IAppStats {
  stats: {
    totalThisMonth?: number;
    totalToday?: number;
    totalSuccessToday?: number;
  };
  type: 'WEBHOOK' | 'APP' | 'User';
}

const data = [
  {
    name: 'Page A',
    pv: 2400,
  },
  {
    name: 'Page B',
    pv: 1398,
  },
  {
    name: 'Page C',
    pv: 9800,
  },
  {
    name: 'Page D',
    pv: 3908,
  },
  {
    name: 'Page E',
    pv: 4800,
  },
  {
    name: 'Page F',
    pv: 3800,
  },
  {
    name: 'Page G',
    pv: 4300,
  },
];

export const ChartStatics = () => {
  return (
    <Box height={'50px'} width={'40%'} px={5} className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={300} data={data}>
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#05CD99"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

const AppStatics: FC<IAppStats> = ({ stats, type }) => {
  const getPercentNotificationSuccess = () => {
    if (!stats?.totalToday || !stats?.totalSuccessToday) {
      return '--';
    }

    return ((stats?.totalSuccessToday / stats?.totalToday) * 100).toFixed(2);
  };

  return (
    <SimpleGrid
      className="infos"
      columns={{ base: 1, sm: 2, lg: 4 }}
      gap="20px"
    >
      <AppCard className="box-info">
        <Box className="label">Total Messages (today)</Box>
        <Box className="value">{formatLargeNumber(stats.totalToday)}</Box>
        <ChartStatics />
      </AppCard>

      <AppCard className="box-info">
        <Box className="label">Total Activities (today)</Box>
        <Box className="value">{formatLargeNumber(stats.totalToday)}</Box>
        <ChartStatics />
      </AppCard>

      <AppCard className="box-info">
        <Box className="label">Success Rate (today)</Box>
        <Box className="value">{getPercentNotificationSuccess()}</Box>
        <ChartStatics />
      </AppCard>

      <AppCard className="box-info">
        <Box className="label">Total Webhook</Box>
        <Box className="value">{formatLargeNumber(stats.totalThisMonth)}</Box>
        <ChartStatics />
      </AppCard>
    </SimpleGrid>
  );
};

export default AppStatics;
