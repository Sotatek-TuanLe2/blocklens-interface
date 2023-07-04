import React, { FC } from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import AppStatistical from './AppStatistical';
import { isMobile } from 'react-device-detect';

interface IStat {
  label: string;
  value: string | number;
  key: string;
}

interface IAppListStatistics {
  dataStats: IStat[];
  dataChart: any[];
}

const AppListStatistics: FC<IAppListStatistics> = ({
  dataStats,
  dataChart,
}) => {

  const _renderStatsDesktop = () => {
    return (
      <SimpleGrid
        className="infos"
        columns={{ base: 1, sm: 2, lg: 4 }}
        gap="18px"
      >
        {dataStats.map((stats, index: number) => {
          return (
            <Box key={`${index} stats`}>
              <AppStatistical
                label={stats.label}
                value={stats.value}
                keyStat={stats.key}
                dataChart={dataChart}
                isPercent={stats.key === 'successRate'}
              />
            </Box>
          );
        })}
      </SimpleGrid>
    );
  };

  const _renderStatsMobile = () => {
    return (
      <div className="infos">
        <Box className="statsMobile">
          {dataStats.map((stats, index: number) => {
            return (
              <Box key={`${index} stats`} className="statsItemMobile">
                <AppStatistical
                  label={stats.label}
                  value={stats.value}
                  dataChart={dataChart}
                  keyStat={stats.key}
                  isPercent={stats.key === 'successRate'}
                />
              </Box>
            );
          })}
        </Box>
      </div>
    );
  };
  return <>{isMobile ? _renderStatsMobile() : _renderStatsDesktop()}</>;
};

export default AppListStatistics;
