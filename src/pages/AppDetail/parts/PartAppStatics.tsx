import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { FC } from 'react';
import { AppCard } from 'src/components';
import { IAppInfo } from '../index';

interface IListInfo {
  appInfo: IAppInfo;
}

const PartAppStatics:FC<IListInfo> = ({ appInfo }) => {
  return (
    <SimpleGrid
      className="infos"
      columns={{ base: 1, sm: 2, lg: 4 }}
      gap="20px"
    >
      <AppCard p={4} className="box-info">
        <Box className="label">User’s Notifications <br/>
          This Month</Box>
        <Box className="value">--</Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">App’s Notifications <br/>
          This Month</Box>
        <Box className="value">--</Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">
          App’s Notifications <br/>
          Last 24 Hour
        </Box>
        <Box className="value">--</Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">App’s Success % <br/>
          Last 24 hour</Box>
        <Box className="value">--</Box>
      </AppCard>
    </SimpleGrid>
  );
};

export default PartAppStatics;
