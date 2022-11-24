import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { FC } from 'react';
import { AppCard } from 'src/components';
import { formatLargeNumber } from 'src/utils/utils-helper';

interface IAppStats {
  stats: {
    totalThisMonth?: number;
    totalToday?: number;
    totalSuccessToday?: number;
  };
  type: 'WEBHOOK' | 'APP' | 'User';
}

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
        <Box className="label">Total Messages (24h)</Box>
        <Box className="value">{formatLargeNumber(stats.totalToday)}</Box>
      </AppCard>

      <AppCard className="box-info">
        <Box className="label">Total Activities (24h)</Box>
        <Box className="value">{formatLargeNumber(stats.totalToday)}</Box>
      </AppCard>

      <AppCard className="box-info">
        <Box className="label">Success Rate (24h)</Box>
        <Box className="value">{getPercentNotificationSuccess()}</Box>
      </AppCard>

      <AppCard className="box-info">
        <Box className="label">Total Webhook</Box>
        <Box className="value">{formatLargeNumber(stats.totalThisMonth)}</Box>
      </AppCard>
    </SimpleGrid>
  );
};

export default AppStatics;
