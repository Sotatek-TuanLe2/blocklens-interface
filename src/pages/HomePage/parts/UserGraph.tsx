import { Box, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppCard, AppSelect2 } from 'src/components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const optionsFilterByType = [
  {
    label: 'Numbers of messages',
    value: 'messages',
  },
  {
    label: 'Numbers of events',
    value: 'events',
  },
];

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

export const Chart = () => {
  const data = [
    {
      name: 'Nov 11',
      daily: 4000,
      average: 2400,
    },
    {
      name: 'Nov 12',
      daily: 3000,
      average: 1398,
    },
    {
      name: 'Nov 13',
      daily: 2000,
      average: 9800,
    },
    {
      name: 'Nov 14',
      daily: 2780,
      average: 3908,
    },
    {
      name: 'Nov 15',
      daily: 1890,
      average: 4800,
    },
    {
      name: 'Nov 16',
      daily: 2390,
      average: 3800,
    },
    {
      name: 'Last 24h',
      daily: 3490,
      average: 4300,
    },
  ];

  return (
    <Box height={'500px'} px={5}>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: '#B4B7BD' }} />
          <YAxis tick={{ fill: '#B4B7BD' }} />
          <Tooltip />
          <Line
            name="Numbers of messages"
            dataKey="average"
            stroke="#FFB547"
            activeDot={{ r: 8 }}
          />
          <Line dataKey="daily" stroke="#3A95FF" name="Numbers of events" />
        </LineChart>
      </ResponsiveContainer>

      <Flex my={5} className={'legend'}>
        <Box>Numbers of messages</Box>
        <Box>Numbers of events</Box>
      </Flex>
    </Box>
  );
};

const UserGraph = () => {
  const [type, setType] = useState<string>('messages');
  const [duration, setDuration] = useState<string>('24h');

  return (
    <AppCard className="user-graph" p={0}>
      <Flex className={'title-list-app'}>
        <Box className={'text-title'}>User’s Graph</Box>
        <Flex>
          <Box mr={3}>
            <AppSelect2
              width={'230px'}
              value={type}
              onChange={setType}
              options={optionsFilterByType}
            />

          </Box>

          <AppSelect2
            width={'170px'}
            value={duration}
            onChange={setDuration}
            options={optionsFilterByDuration}
          />
        </Flex>
      </Flex>
      <Chart />
    </AppCard>
  );
};

export default UserGraph;
