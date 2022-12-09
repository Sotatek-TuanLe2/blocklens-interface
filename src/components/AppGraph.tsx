import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useMemo } from 'react';
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
  const dataChart = useMemo(() => {
    if (duration === '24h') {
      return data.map((item: any) => {
        return {
          ...item,
          label: formatTimestamp(item.time, 'HH'),
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
          <XAxis dataKey="label" tick={{ fill: '#B4B7BD' }} />
          <YAxis tick={{ fill: '#B4B7BD' }} axisLine={false} />
          <Tooltip />
          <Line
            name="Numbers of messages"
            dataKey="message"
            stroke="#FFB547"
            strokeWidth={2}
            dot={{ r: isMobile ? 6 : 8 }}
          />
          <Line
            dot={{ r: isMobile ? 6 : 8 }}
            strokeWidth={2}
            dataKey="activities"
            stroke="#3A95FF"
            name="Numbers of activities"
          />
          <CartesianGrid vertical={false} horizontal stroke="#41495F" />
        </LineChart>
      </ResponsiveContainer>

      <Flex my={5} className={'legend'}>
        <Box>Numbers of messages</Box>
        <Box>Numbers of activities</Box>
      </Flex>
    </Box>
  );
};

export default AppGraph;
