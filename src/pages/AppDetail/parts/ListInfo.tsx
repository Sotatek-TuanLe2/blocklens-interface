import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { FC } from 'react';
import { AppCard } from 'src/components';
import { IAppInfo } from '../index';

interface IListInfo {
  appInfo: IAppInfo;
}

const ListInfo:FC<IListInfo> = ({ appInfo }) => {
  return (
    <SimpleGrid
      className="infos"
      columns={{ base: 1, sm: 2, lg: 4 }}
      gap="20px"
    >
      <AppCard p={4} className="box-info">
        <Box className="label">Number of webhooks</Box>
        <Box className="value">--</Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">Number of Notifications</Box>
        <Box className="value">--</Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">
          Number of Notifications <br /> This Month
        </Box>
        <Box className="value">--</Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">Success % (Last 1 h)</Box>
        <Box className="value">--</Box>
      </AppCard>
    </SimpleGrid>
  );
};

export default ListInfo;
