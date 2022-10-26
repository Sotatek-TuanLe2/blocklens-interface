import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { FC } from 'react';
import { AppCard } from 'src/components';
import { formatLargeNumber } from 'src/utils/utils-helper';
import { IAppResponse } from 'src/utils/utils-app';

interface IListInfo {
  appInfo: IAppResponse;
}

const PartAppStatics: FC<IListInfo> = ({ appInfo }) => {
  const getPercentNotificationSuccess = () => {
    if (!appInfo.totalAppNotificationSuccessLast24Hours) {
      return '--';
    }

    return (
      (appInfo?.totalAppNotificationSuccessLast24Hours /
        appInfo?.totalAppNotificationLast24Hours) *
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
          {formatLargeNumber(appInfo.totalUserNotification)}
        </Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">
          App’s Notifications <br />
          This Month
        </Box>
        <Box className="value">
          {formatLargeNumber(appInfo.totalAppNotification)}
        </Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">
          App’s Notifications <br />
          Last 24 Hour
        </Box>
        <Box className="value">
          {formatLargeNumber(appInfo.totalAppNotificationLast24Hours)}
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
