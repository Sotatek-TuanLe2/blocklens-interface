import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState, FC } from 'react';
import { isMobile } from 'react-device-detect';
import AppStatistical, { keyStats } from 'src/components/AppStatistical';
import rf from 'src/requests/RequestFactory';
import moment from 'moment';

interface IUserStats {
  message?: number;
  activities?: number;
  successRate?: number;
  webhooks?: number;
  messagesSuccess: number;
  messagesFailed: number;
}

export const listStats = [
  {
    key: 'message',
    label: 'Total Messages (today)',
  },
  {
    key: 'activities',
    label: 'Total Activities (today)',
  },
  {
    key: 'successRate',
    label: 'Success Rate (today)',
  },
  {
    key: 'webhooks',
    label: 'Active Webhook',
  },
];

interface IStat {
  label: string;
  value: string | number;
  key: string;
}

interface IListStat {
  dataStats: IStat[];
  dataChart: any[];
}

export const ListStat: FC<IListStat> = ({ dataStats, dataChart }) => {
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

const PartUserStats = () => {
  const [userStatsToday, setUserStatsToday] = useState<IUserStats | any>({});
  const [dataChart, setDataChart] = useState<IUserStats[] | any>([]);

  const getUserStatsToday = useCallback(async () => {
    try {
      const res: IUserStats = await rf
        .getRequest('NotificationRequest')
        .getUserStatsToday();
      setUserStatsToday(res);
    } catch (error: any) {
      setUserStatsToday({});
    }
  }, []);

  const getUserStats = useCallback(async () => {
    try {
      const res: IUserStats = await rf
        .getRequest('NotificationRequest')
        .getUserStats({
          from: moment().utc().startOf('day').valueOf(),
          to: moment().utc().valueOf(),
          period: 'hour',
        });
      setDataChart(res);
    } catch (error: any) {
      setDataChart([]);
    }
  }, []);

  useEffect(() => {
    getUserStats().then();
    getUserStatsToday().then();
  }, []);

  const dataUserStatsToday = useMemo(() => {
    return listStats.map((item) => {
      return {
        ...item,
        value: userStatsToday[item.key as keyStats],
      };
    });
  }, [userStatsToday]);

  return <ListStat dataStats={dataUserStatsToday} dataChart={dataChart} />;
};

export default PartUserStats;
