import { Box, Flex } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppCard, AppGraph, AppSelect2 } from 'src/components';
import { isMobile } from 'react-device-detect';
import ModalFilterGraph from 'src/modals/ModalFilterGraph';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import { getParams } from 'src/pages/HomePage/parts/PartUserGraph';

interface IDataChart {
  activities: number;
  appId: string;
  message: number;
  messagesFailed: number;
  messagesSuccess: number;
  resolution: number;
  successRate: string;
  time: number;
  webhooks: number;
}

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

const PartAppGraph = () => {
  const [duration, setDuration] = useState<string>('24h');
  const [isOpenFilterGraphModal, setIsOpenFilterGraphModal] =
    useState<boolean>(false);
  const [dataChart, setDataChart] = useState<IDataChart[] | any>([]);
  const { id: appId } = useParams<{ id: string }>();

  const params = useMemo(() => {
    return getParams(duration);
  }, [duration]);

  const getUserStats = useCallback(async () => {
    try {
      const res = await rf
        .getRequest('NotificationRequest')
        .getAppStats(appId, params);
      setDataChart(res);
    } catch (error: any) {
      setDataChart([]);
    }
  }, [params]);

  useEffect(() => {
    getUserStats().then();
  }, [appId, params]);

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
        <Box className={'text-title'}>App's Graph</Box>
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

export default PartAppGraph;
