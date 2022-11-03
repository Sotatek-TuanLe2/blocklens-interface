import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { AppCard } from 'src/components';
import { formatLargeNumber } from 'src/utils/utils-helper';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';

interface IAppStatistics {
  totalOfUser?: number;
  totalOfApp?: number;
  totalLast24Hours?: number;
  totalSuccessLast24Hours?: number;
}

const PartAppStatics = () => {
  const { id: appId } = useParams<{ id: string }>();
  const [appStatistics, setAppStatistics] = useState<IAppStatistics>({});

  const getAppStatistics = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('NotificationRequest')
        .getAppStatistics(appId)) as any;
      setAppStatistics(res);
    } catch (error: any) {
      setAppStatistics({});
    }
  }, [appId]);

  useEffect(() => {
    getAppStatistics().then();
  }, []);

  const getPercentNotificationSuccess = () => {
    if (
      !appStatistics?.totalLast24Hours ||
      !appStatistics.totalSuccessLast24Hours
    ) {
      return '--';
    }

    return (
      (appStatistics?.totalSuccessLast24Hours /
        appStatistics?.totalLast24Hours) *
      100
    ).toFixed(2);
  };

  return (
    <SimpleGrid
      className="infos"
      columns={{ base: 1, sm: 2, lg: 4 }}
      gap="20px"
    >
      <AppCard p={4} className="box-info">
        <Box className="label">
          User’s Notifications <br />
          This Month
        </Box>
        <Box className="value">
          {formatLargeNumber(appStatistics.totalOfUser)}
        </Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">
          App’s Notifications <br />
          This Month
        </Box>
        <Box className="value">
          {formatLargeNumber(appStatistics.totalOfApp)}
        </Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">
          App’s Notifications <br />
          Last 24 Hour
        </Box>
        <Box className="value">
          {formatLargeNumber(appStatistics.totalLast24Hours)}
        </Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">
          App’s Success % <br />
          Last 24 hour
        </Box>
        <Box className="value">{getPercentNotificationSuccess()}</Box>
      </AppCard>
    </SimpleGrid>
  );
};

export default PartAppStatics;
