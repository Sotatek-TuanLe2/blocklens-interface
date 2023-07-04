import { Box, Flex } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppCard, AppFilterGraph, AppGraph } from 'src/components';
import rf from 'src/requests/RequestFactory';
import {
  SAMPLE_DATA_CHART,
  getParamsChart,
  IDataChart,
  isChartEmpty,
  fillFullResolution,
} from 'src/utils/utils-app';

const PartUserGraph = () => {
  const [duration, setDuration] = useState<string>('24h');
  const [dataChart, setDataChart] = useState<IDataChart[]>([]);

  const params = useMemo(() => {
    return getParamsChart(duration);
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
        SAMPLE_DATA_CHART,
      );

      setDataChart(dataFilled);
    } catch (error: any) {
      setDataChart([]);
    }
  }, [params]);

  useEffect(() => {
    getUserStats().then();
  }, [params]);

  if (isChartEmpty(dataChart)) return <></>;

  return (
    <AppCard p={0}>
      <Flex className={'title-list-app'}>
        <Box className={'text-title'}>User's Graph</Box>
        <AppFilterGraph duration={duration} setDuration={setDuration} />
      </Flex>

      <AppGraph data={dataChart} duration={duration} />
    </AppCard>
  );
};

export default PartUserGraph;
