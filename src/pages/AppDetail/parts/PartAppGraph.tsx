import { Box, Flex } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppCard, AppFilterGraph, AppGraph } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import {
  SAMPLE_DATA_CHART,
  getParamsChart,
  IDataChart,
  isChartEmpty,
  fillFullResolution,
} from 'src/utils/utils-app';

const PartAppGraph = () => {
  const [duration, setDuration] = useState<string>('24h');
  const [dataChart, setDataChart] = useState<IDataChart[] | any>([]);
  const { id: appId } = useParams<{ id: string }>();

  const params = useMemo(() => {
    return getParamsChart(duration);
  }, [duration]);

  const getUserStats = useCallback(async () => {
    try {
      const res = await rf
        .getRequest('NotificationRequest')
        .getAppStats(appId, params);

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
  }, [appId, params]);

  if (isChartEmpty(dataChart)) return <></>;

  return (
    <AppCard p={0}>
      <Flex className={'title-list-app'}>
        <Box className={'text-title'}>Project's Graph</Box>
        <AppFilterGraph duration={duration} setDuration={setDuration} />
      </Flex>
      <AppGraph data={dataChart} duration={duration} />
    </AppCard>
  );
};

export default PartAppGraph;
