import { SimpleGrid } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import AppStatistical from 'src/components/AppStatistical';
import rf from 'src/requests/RequestFactory';
import { formatLargeNumber } from 'src/utils/utils-helper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';

export interface IUserStats {
  totalThisMonth?: number;
  totalToday?: number;
  totalSuccessToday?: number;
  tottalActivities?: number;
}

export type LabelStats =
  | 'totalThisMonth'
  | 'totalToday'
  | 'totalSuccessToday'
  | 'tottalActivities';

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

export const listUserStats = [
  {
    key: 'totalToday',
    label: 'Total Messages (today)',
  },
  {
    key: 'totalThisMonth',
    label: 'Total Webhook',
  },
  {
    key: 'totalSuccessToday',
    label: 'Success Rate (today)',
  },
  {
    key: 'tottalActivities',
    label: 'Total Activities (today)',
  },
];

const formatPercent = (stats: any) => {
  if (!stats?.totalToday || !stats?.totalSuccessToday) {
    return '--';
  }

  return ((stats?.totalSuccessToday / stats?.totalToday) * 100).toFixed(2);
};

const PartUserStats = () => {
  const [userStats, setUserStats] = useState<IUserStats>({});

  const getUserStats = useCallback(async () => {
    try {
      const res: IUserStats = await rf
        .getRequest('NotificationRequest')
        .getUserStats();
      setUserStats({ ...res, tottalActivities: res.totalToday });
    } catch (error: any) {
      setUserStats({});
    }
  }, []);

  const getValueStats = useCallback(
    (
      userStats: IUserStats,
      value: number,
      stats: { key: string; label: string },
    ) => {
      if (stats.key === 'totalSuccessToday') {
        return formatPercent(userStats);
      }
      return formatLargeNumber(value);
    },
    [userStats],
  );

  useEffect(() => {
    getUserStats().then();
  }, []);

  const _renderStatsDesktop = () => {
    return (
      <SimpleGrid
        className="infos"
        columns={{ base: 1, sm: 2, lg: 4 }}
        gap="20px"
      >
        {userStats &&
          listUserStats.map((stats, index: number) => {
            return (
              <React.Fragment key={`${index} stats`}>
                <AppStatistical
                  label={stats.label}
                  value={
                    getValueStats(
                      userStats,
                      userStats[stats.label as LabelStats] || 0,
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
        <Swiper className="swiperMobile" slidesPerView={1.25}>
          {userStats &&
            listUserStats.map((stats, index: number) => {
              return (
                <SwiperSlide key={`${index} stats`}>
                  <AppStatistical
                    label={stats.label}
                    value={
                      getValueStats(
                        userStats,
                        userStats[stats.label as LabelStats] || 0,
                        stats,
                      ) || 0
                    }
                    dataChart={data}
                  />
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    );
  };
  return <>{isMobile ? _renderStatsMobile() : _renderStatsDesktop()}</>;
};

export default PartUserStats;
