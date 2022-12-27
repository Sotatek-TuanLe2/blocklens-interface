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

  const formatDataChart = (number: number) => {
    if (number > 1000000000) {
      return (number / 1000000000).toString() + 'B';
    } else if (number > 1000000) {
      return (number / 1000000).toString() + 'M';
    } else if (number > 1000) {
      return (number / 1000).toString() + 'K';
    } else {
      return number.toString();
    }
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
          <XAxis dataKey="label" interval={3} tick={{ fill: '#B4B7BD' }} />
          <YAxis
            tick={{ fill: '#B4B7BD' }}
            tickFormatter={formatDataChart}
            axisLine={false}
          />
          <Tooltip />
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

      <Flex my={5} className={'legend'}>
        <Box
          className={`${lineHide === 'message' ? 'hide' : ''} activities`}
          onClick={() => {
            if (lineHide === 'message') {
              setLineHide('activities');
              return;
            }
            setLineHide('message');
          }}
        >
          Numbers of activities
        </Box>

        <Box
          className={`${lineHide === 'activities' ? 'hide' : ''} message`}
          onClick={() => {
            if (lineHide === 'activities') {
              setLineHide('message');
              return;
            }
            setLineHide('activities');
          }}
        >
          Numbers of messages
        </Box>
      </Flex>
    </Box>
  );
};

export default AppGraph;
