import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { FC } from 'react';
import { AppCard } from 'src/components';
import { IAppInfo } from '../index';

interface IListInfo {
  appInfo: IAppInfo;
}

const PartAppStatics: FC<IListInfo> = ({ appInfo }) => {
  const getPercentNotificationSuccess = () => {
    if (!appInfo.totalAppNotificationSuccessLast24Hours) {
      return '0';
    }

    return (
      (appInfo?.totalAppNotificationSuccessLast24Hours /
        appInfo?.totalAppNotificationSuccessLast24Hours) *
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
        <Box className="value">{appInfo.totalUserNotification}</Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">
          App’s Notifications <br />
          This Month
        </Box>
        <Box className="value">{appInfo.totalAppNotification}</Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">
          App’s Notifications <br />
          Last 24 Hour
        </Box>
        <Box className="value">{appInfo.totalAppNotificationLast24Hours}</Box>
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
