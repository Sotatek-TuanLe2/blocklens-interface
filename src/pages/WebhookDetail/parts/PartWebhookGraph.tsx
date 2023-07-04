import { Box, Flex } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppCard, AppFilterGraph, AppGraph } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import {
  SAMPLE_DATA_CHART,
  IDataChart,
  getParamsChart,
  isChartEmpty,
  fillFullResolution,
} from 'src/utils/utils-app';

const PartWebhookGraph = () => {
  const [duration, setDuration] = useState<string>('24h');
  const [dataChart, setDataChart] = useState<IDataChart[]>([]);
  const { id: webhookId } = useParams<{ id: string }>();

  const params = useMemo(() => {
    return getParamsChart(duration);
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
        SAMPLE_DATA_CHART,
      );

      setDataChart(dataFill);
    } catch (error: any) {
      setDataChart([]);
    }
  }, [params]);

  useEffect(() => {
    getWebhookStats().then();
  }, [params]);

  if (isChartEmpty(dataChart)) return <></>;

  return (
    <AppCard p={0}>
      <Flex className={'title-list-app'}>
        <Box className={'text-title'}>Webhook's Graph</Box>
        <AppFilterGraph duration={duration} setDuration={setDuration} />
      </Flex>

      <AppGraph data={dataChart} duration={duration} />
    </AppCard>
  );
};

export default PartWebhookGraph;
