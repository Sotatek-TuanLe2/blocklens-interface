import { Box, Flex } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppCard, AppGraph, AppSelect2 } from 'src/components';
import { isMobile } from 'react-device-detect';
import ModalFilterGraph from 'src/modals/ModalFilterGraph';
import rf from 'src/requests/RequestFactory';
import moment from 'moment';

const optionsFilterByDuration = [
  {
    label: 'Last 24 hours',
    value: '24h',
  },
  {
    label: 'Last 7 days',
    value: '7d',
  },
  {
    label: 'Last 30 days',
    value: '30d',
  },
];

export const getParams = (duration: string) => {
  if (duration === '24h') {
    return {
      from: moment().utc().subtract(24, 'hour').valueOf(),
      to: moment().utc().valueOf(),
      period: 'hour',
    };
  }

  if (duration === '7d') {
    return {
      from: moment().utc().subtract(7, 'days').valueOf(),
      to: moment().utc().valueOf(),
      period: 'day',
    };
  }

  return {
    from: moment().utc().subtract(30, 'days').valueOf(),
    to: moment().utc().valueOf(),
    period: 'day',
  };
};

const PartUserGraph = () => {
  const [duration, setDuration] = useState<string>('24h');
  const [isOpenFilterGraphModal, setIsOpenFilterGraphModal] =
    useState<boolean>(false);
  const [dataChart, setDataChart] = useState<any[] | any>([]);

  const params = useMemo(() => {
    return getParams(duration);
  }, [duration]);

  const getUserStats = useCallback(async () => {
    try {
      const res = await rf
        .getRequest('NotificationRequest')
        .getUserStats(params);
      setDataChart(res);
    } catch (error: any) {
      setDataChart([]);
    }
  }, [params]);

  useEffect(() => {
    getUserStats().then();
  }, [params]);

  const _renderFilter = () => {
    return (
      <Flex>
        <AppSelect2
          width={'170px'}
          value={duration}
          onChange={setDuration}
          options={optionsFilterByDuration}
        />
      </Flex>
    );
  };

  if (!dataChart.length) return <></>;

  return (
    <AppCard className="user-graph" p={0}>
      <Flex className={'title-list-app'}>
        <Box className={'text-title'}>User's Graph</Box>
        {isMobile ? (
          <Box
            className="icon-filter-mobile"
            onClick={() => setIsOpenFilterGraphModal(true)}
          />
        ) : (
          _renderFilter()
        )}
      </Flex>

      <AppGraph data={dataChart} duration={duration} />

      <ModalFilterGraph
        optionTimes={optionsFilterByDuration}
        open={isOpenFilterGraphModal}
        time={duration}
        onChangeTime={setDuration}
        onClose={() => setIsOpenFilterGraphModal(false)}
      />
    </AppCard>
  );
};

export default PartUserGraph;