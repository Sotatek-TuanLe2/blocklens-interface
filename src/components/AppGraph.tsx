import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
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
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import { isMobile } from 'react-device-detect';
import ModalFilterGraph from 'src/modals/ModalFilterGraph';

const optionsFilterByType = [
  {
    label: 'NFT Activity',
    value: WEBHOOK_TYPES.NFT_ACTIVITY,
  },
  {
    label: 'Address Activity',
    value: WEBHOOK_TYPES.ADDRESS_ACTIVITY,
  },
  {
    label: 'Contract Activity',
    value: WEBHOOK_TYPES.CONTRACT_ACTIVITY,
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
    <Box height={isMobile ? '400px' : '500px'} px={isMobile ? 0 : 5}>
      <ResponsiveContainer width="100%" height={isMobile ? '75%' : '85%'}>
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
          <XAxis dataKey="name" tick={{ fill: '#B4B7BD' }} />
          <YAxis tick={{ fill: '#B4B7BD' }} axisLine={false} />
          <Tooltip />
          <Line
            name="Numbers of messages"
            dataKey="average"
            stroke="#FFB547"
            strokeWidth={2}
            dot={{ r: isMobile ? 6 : 8 }}
          />
          <Line
            dot={{ r: isMobile ? 6 : 8 }}
            strokeWidth={2}
            dataKey="daily"
            stroke="#3A95FF"
            name="Numbers of events"
          />
          <CartesianGrid vertical={false} horizontal stroke="#41495F" />
        </LineChart>
      </ResponsiveContainer>

      <Flex my={5} className={'legend'}>
        <Box>Numbers of messages</Box>
        <Box>Numbers of events</Box>
      </Flex>
    </Box>
  );
};

interface IAppGraph {
  type: 'user' | 'app' | 'webhook';
}

const AppGraph: FC<IAppGraph> = ({ type }) => {
  const [typeData, setTypeData] = useState<string>(WEBHOOK_TYPES.NFT_ACTIVITY);
  const [duration, setDuration] = useState<string>('24h');
  const [isOpenFilterGraphModal, setIsOpenFilterGraphModal] =
    useState<boolean>(false);

  const _renderFilter = () => {
    return (
      <Flex>
        {type === 'app' && (
          <Box mr={3}>
            <AppSelect2
              width={'200px'}
              value={typeData}
              onChange={setTypeData}
              options={optionsFilterByType}
            />
          </Box>
        )}

        <AppSelect2
          width={'170px'}
          value={duration}
          onChange={setDuration}
          options={optionsFilterByDuration}
        />
      </Flex>
    );
  };

  return (
    <AppCard className="user-graph" p={0}>
      <Flex className={'title-list-app'}>
        <Box className={'text-title'}>{type}'s Graph</Box>
        {isMobile ? (
          <Box
            className="icon-filter-mobile"
            onClick={() => setIsOpenFilterGraphModal(true)}
          />
        ) : (
          _renderFilter()
        )}
      </Flex>
      <Chart />

      <ModalFilterGraph
        optionTypes={optionsFilterByType}
        optionTimes={optionsFilterByDuration}
        open={isOpenFilterGraphModal}
        typeData={typeData}
        type={type}
        time={duration}
        onChangeType={setTypeData}
        onChangeTime={setDuration}
        onClose={() => setIsOpenFilterGraphModal(false)}
      />
    </AppCard>
  );
};

export default AppGraph;
