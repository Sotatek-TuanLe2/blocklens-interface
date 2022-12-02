import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';
import { AppCard } from 'src/components';
import { formatLargeNumber } from 'src/utils/utils-helper';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { IUserStats } from 'src/pages/HomePage/parts/PartUserStats';

type LabelStats =
  | 'totalThisMonth'
  | 'totalToday'
  | 'totalSuccessToday'
  | 'tottalActivities';

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

const getPercentNotificationSuccess = (userStats: any) => {
  if (!userStats?.totalToday || !userStats?.totalSuccessToday) {
    return '--';
  }

  return ((userStats?.totalSuccessToday / userStats?.totalToday) * 100).toFixed(
    2,
  );
};

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

const AppStatics: FC<any> = ({ userStats, labelStats, stats }) => {
  const getValueStats = useCallback(
    (
      userStats: IUserStats,
      value: number,
      stats: { key: string; label: string },
    ) => {
      if (stats.key === 'totalSuccessToday') {
        return getPercentNotificationSuccess(userStats);
      }
      return formatLargeNumber(value);
    },
    [],
  );

  return (
    <>
      <AppCard className="box-info">
        <Box className="label">{stats.label}</Box>
        <Box className="value">
          {getValueStats(
            userStats,
            userStats[labelStats.key as LabelStats],
            stats,
          )}
        </Box>
        <ChartStatics />
      </AppCard>
    </>
  );
};

export default AppStatics;
