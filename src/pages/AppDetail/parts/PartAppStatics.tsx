import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useParams } from 'react-router';
import AppStatistical from 'src/components/AppStatistical';
import {
  data,
  LabelStats,
  listUserStats,
} from 'src/pages/HomePage/parts/PartUserStats';
import rf from 'src/requests/RequestFactory';
import { formatLargeNumber } from 'src/utils/utils-helper';

interface IAppStats {
  totalThisMonth?: number;
  totalToday?: number;
  totalSuccessToday?: number;
  tottalActivities?: number;
}

const formatPercent = (stats: any) => {
  if (!stats?.totalToday || !stats?.totalSuccessToday) {
    return '--';
  }

  return ((stats?.totalSuccessToday / stats?.totalToday) * 100).toFixed(2);
};

const PartAppStatics = () => {
  const { id: appId } = useParams<{ id: string }>();
  const [appStats, setAppStats] = useState<IAppStats>({});

  const getValueStats = useCallback(
    (
      appStats: IAppStats,
      value: number,
      stats: { key: string; label: string },
    ) => {
      if (stats.key === 'totalSuccessToday') {
        return formatPercent(appStats);
      }
      return formatLargeNumber(value);
    },
    [appStats],
  );

  const getAppStats = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('NotificationRequest')
        .getAppStats(appId)) as any;
      setAppStats(res);
    } catch (error: any) {
      setAppStats({});
    }
  }, [appId]);

  useEffect(() => {
    getAppStats().then();
  }, []);

  const _renderStatsDesktop = () => {
    return (
      <SimpleGrid
        className="infos"
        columns={{ base: 1, sm: 2, lg: 4 }}
        gap="20px"
      >
        {appStats &&
          listUserStats.map((stats, index: number) => {
            return (
              <React.Fragment key={`${index} stats`}>
                <AppStatistical
                  label={stats.label}
                  value={
                    getValueStats(
                      appStats,
                      appStats[stats.label as LabelStats] || 0,
                      stats,
                    ) || 0
                  }
                  dataChart={data}
                />
              </React.Fragment>
            );
          })}
      </SimpleGrid>
    );
  };

  const _renderStatsMobile = () => {
    return (
      <div className="infos">
        <Box className="statsMobile">
          {appStats &&
            listUserStats.map((stats, index: number) => {
              return (
                <Box key={`${index} stats`} className="statsItemMobile">
                  <AppStatistical
                    label={stats.label}
                    value={
                      getValueStats(
                        appStats,
                        appStats[stats.label as LabelStats] || 0,
                        stats,
                      ) || 0
                    }
                    dataChart={data}
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

export default PartAppStatics;
