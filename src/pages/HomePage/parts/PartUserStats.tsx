import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState, FC } from 'react';
import { isMobile } from 'react-device-detect';
import AppStatistical, { keyStats } from 'src/components/AppStatistical';
import rf from 'src/requests/RequestFactory';

interface IUserStats {
  messages?: number;
  activities?: number;
  successRate?: number;
  webhooks?: number;
  messagesSuccess: number;
  messagesFailed: number;
}

export const data = [
  {
    name: 'Page A',
    pv: 2400,
  },
  {
    name: 'Page B',
    pv: 1398,
  },
  {
    name: 'Page C',
    pv: 9800,
  },
  {
    name: 'Page D',
    pv: 3908,
  },
  {
    name: 'Page E',
    pv: 4800,
  },
  {
    name: 'Page F',
    pv: 3800,
  },
  {
    name: 'Page G',
    pv: 4300,
  },
];

export const listStats = [
  {
    key: 'messages',
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
    label: 'Total Webhook',
  },
];

interface IStat {
  label: string;
  value: string | number;
  key: string;
}

interface IListStat {
  dataStats: IStat[];
}

export const ListStat: FC<IListStat> = ({ dataStats }) => {
  const _renderStatsDesktop = () => {
    return (
      <SimpleGrid
        className="infos"
        columns={{ base: 1, sm: 2, lg: 4 }}
        gap="20px"
      >
        {dataStats.map((stats, index: number) => {
          return (
            <Box key={`${index} stats`}>
              <AppStatistical
                label={stats.label}
                value={stats.value}
                dataChart={data}
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
                  dataChart={data}
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
  const [userStats, setUserStats] = useState<IUserStats | any>({});

  const getUserStats = useCallback(async () => {
    try {
      const res: IUserStats = await rf
        .getRequest('NotificationRequest')
        .getUserStats();
      setUserStats(res);
    } catch (error: any) {
      setUserStats({});
    }
  }, []);

  useEffect(() => {
    getUserStats().then();
  }, []);

  const dataUserStats = useMemo(() => {
    return listStats.map((item) => {
      if (item.key === 'messages')
        return {
          ...item,
          value: userStats.messagesFailed + userStats.messagesSuccess,
        };

      return {
        ...item,
        value: userStats[item.key as keyStats],
      };
    });
  }, [userStats]);

  return <ListStat dataStats={dataUserStats} />;
};

export default PartUserStats;
