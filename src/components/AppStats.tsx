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
  type: 'WEBHOOK' | 'APP' | 'USER';
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
      <AppCard p={4} className="box-info">
        <Box className="label">
          {type}’s Messages <br />
          Today
        </Box>
        <Box className="value">{formatLargeNumber(stats.totalToday)}</Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">
          {type}’s Success % <br />
          Today
        </Box>
        <Box className="value">{getPercentNotificationSuccess()}</Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">
          {type}’s Messages <br />
          This Month
        </Box>
        <Box className="value">{formatLargeNumber(stats.totalThisMonth)}</Box>
      </AppCard>
    </SimpleGrid>
  );
};

export default AppStatics;
