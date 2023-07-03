import { Box, Flex } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppCard, AppGraph, AppSelect2 } from 'src/components';
import { isMobile } from 'react-device-detect';
import ModalFilterGraph from 'src/modals/ModalFilterGraph';
import rf from 'src/requests/RequestFactory';
import moment from 'moment';
import { fillFullResolution, SAMPLE_DATA } from './PartUserStats';
import { RESOLUTION_TIME, optionsFilterByDuration } from 'src/utils/utils-webhook';

interface IDataChart {
  activities: number;
  apps: number;
  message: number;
  messagesFailed: number;
  messagesSuccess: number;
  resolution: number;
  successRate: string;
  time: number;
  webhooks: number;
}

export const getParams = (duration: string) => {
  if (duration === '24h') {
    return {
      from: moment().utc().subtract(24, 'hour').valueOf(),
      to: moment().utc().valueOf(),
      resolution: RESOLUTION_TIME.HOUR,
    };
  }

  if (duration === '7d') {
    return {
      from: moment().utc().subtract(7, 'days').valueOf(),
      to: moment().utc().valueOf(),
      resolution: RESOLUTION_TIME.DAY,
    };
  }

  return {
    from: moment().utc().subtract(30, 'days').valueOf(),
    to: moment().utc().valueOf(),
    resolution: RESOLUTION_TIME.DAY,
  };
};

const sampleData = {
  message: 0,
  activities: 0,
  successRate: 0,
  webhooks: 0,
  messagesSuccess: 0,
  messagesFailed: 0,
};

const PartUserGraph = () => {
  const [duration, setDuration] = useState<string>('24h');
  const [isOpenFilterGraphModal, setIsOpenFilterGraphModal] =
    useState<boolean>(false);
  const [dataChart, setDataChart] = useState<IDataChart[]>([]);

  const params = useMemo(() => {
    return getParams(duration);
  }, [duration]);

  const getUserStats = useCallback(async () => {
    try {
      const res = await rf
        .getRequest('NotificationRequest')
        .getUserStats(params);

      if (!res?.length) return;

      const dataFilled = fillFullResolution(
        params.from,
        params.to,
        params.resolution,
        res,
        SAMPLE_DATA,
      );

      setDataChart(dataFilled);
    } catch (error: any) {
      setDataChart([]);
    }
  }, [params]);

  useEffect(() => {
    getUserStats().then();
  }, [params]);

  const _renderFilter = () => {
    if (isMobile) {
      return (
        <Box
          className="icon-filter-mobile"
          onClick={() => setIsOpenFilterGraphModal(true)}
        />
      );
    }

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

  if (
    !dataChart.length ||
    (dataChart.every((item: IDataChart) => item.message === 0) &&
      dataChart.every((item: IDataChart) => item.activities === 0))
  )
    return <></>;

  return (
    <AppCard p={0}>
      <Flex className={'title-list-app'}>
        <Box className={'text-title'}>User's Graph</Box>
        {_renderFilter()}
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
