import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { isMobile } from 'react-device-detect';
import { formatTimestamp } from 'src/utils/utils-helper';
import { formatNumber } from 'src/utils/utils-format';
import { RadioChecked, RadioNoCheckedIcon } from 'src/assets/icons';

interface IChart {
  data: any[];
  duration: string;
}

const AppGraph: FC<IChart> = ({ data, duration }) => {
  const [lineHide, setLineHide] = useState<string>('activities');
  const dataChart = useMemo(() => {
    if (duration === '24h') {
      return data.map((item: any) => {
        return {
          ...item,
          label: formatTimestamp(item.time, 'hh:mm A'),
        };
      });
    }

    return data.map((item: any) => {
      return {
        ...item,
        label: formatTimestamp(item.time, 'MMM DD'),
      };
    });
  }, [duration, data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box p={2}>{`${label} : ${formatNumber(
          payload[0].value,
          4,
          '0',
        )}`}</Box>
      );
    }

    return null;
  };

  return (
    <Box height={isMobile ? '400px' : '500px'} px={isMobile ? 0 : 5}>
      <ResponsiveContainer width="100%" height={isMobile ? '75%' : '85%'}>
        <LineChart
          width={500}
          height={300}
          data={dataChart}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="label"
            interval={isMobile ? undefined : 3}
            tick={{ fill: '#B4B7BD' }}
          />
          <YAxis
            tick={{ fill: '#B4B7BD' }}
            tickFormatter={(value: any) => formatNumber(value, 4, '0')}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {lineHide === 'message' && (
            <Line
              name="Numbers of messages"
              dataKey="message"
              stroke="#3A95FF"
              strokeWidth={2}
              dot={{ r: isMobile ? 2 : 4 }}
            />
          )}

          {lineHide === 'activities' && (
            <Line
              dot={{ r: isMobile ? 2 : 4 }}
              strokeWidth={2}
              dataKey="activities"
              stroke="#FFB547"
              name="Numbers of activities"
            />
          )}
          <CartesianGrid vertical={false} horizontal stroke="#41495F" />
        </LineChart>
      </ResponsiveContainer>

      <Flex my={isMobile ? 3 : 5} className={'legend'}>
        <Flex
          onClick={() => {
            if (lineHide === 'message') {
              setLineHide('activities');
              return;
            }
            setLineHide('message');
          }}
        >
          {lineHide === 'activities' ? (
            <RadioChecked />
          ) : (
            <RadioNoCheckedIcon />
          )}
          <Box className={`activities`}>Numbers of activities</Box>
        </Flex>

        <Flex
          onClick={() => {
            if (lineHide === 'activities') {
              setLineHide('message');
              return;
            }
            setLineHide('activities');
          }}
        >
          {lineHide === 'message' ? <RadioChecked /> : <RadioNoCheckedIcon />}
          <Box className={`message`}>Numbers of messages</Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default AppGraph;
