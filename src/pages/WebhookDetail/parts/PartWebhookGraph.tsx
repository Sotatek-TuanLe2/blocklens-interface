import { Box, Flex } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppCard, AppGraph, AppSelect2 } from 'src/components';
import { isMobile } from 'react-device-detect';
import ModalFilterGraph from 'src/modals/ModalFilterGraph';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import { getParams } from 'src/pages/HomePage/parts/PartUserGraph';
import {
  SAMPLE_DATA,
  fillFullResolution,
} from '../../HomePage/parts/PartUserStats';

interface IDataChart {
  activities: number;
  message: number;
  messagesFailed: number;
  messagesSuccess: number;
  registrationId: string;
  resolution: number;
  successRate: string;
  time: number;
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

const PartWebhookGraph = () => {
  const [duration, setDuration] = useState<string>('24h');
  const [isOpenFilterGraphModal, setIsOpenFilterGraphModal] =
    useState<boolean>(false);
  const [dataChart, setDataChart] = useState<IDataChart[]>([]);
  const { id: webhookId } = useParams<{ id: string }>();

  const params = useMemo(() => {
    return getParams(duration);
  }, [duration]);

  const getWebhookStats = useCallback(async () => {
    try {
      const res = await rf
        .getRequest('NotificationRequest')
        .getWebhookStats(webhookId, params);

      if (!res?.length) return;

      const dataFill = fillFullResolution(
        params.from,
        params.to,
        params.resolution,
        res,
        SAMPLE_DATA,
      );

      setDataChart(dataFill);
    } catch (error: any) {
      setDataChart([]);
    }
  }, [params]);

  useEffect(() => {
    getWebhookStats().then();
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
        <Box className={'text-title'}>Webhook's Graph</Box>
        {_renderFilter()}
      </Flex>

      <AppGraph data={dataChart} duration={duration} />

      {isOpenFilterGraphModal && (
        <ModalFilterGraph
          optionTimes={optionsFilterByDuration}
          open={isOpenFilterGraphModal}
          time={duration}
          onChangeTime={setDuration}
          onClose={() => setIsOpenFilterGraphModal(false)}
        />
      )}
    </AppCard>
  );
};

export default PartWebhookGraph;
