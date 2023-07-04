import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useEffect, useMemo, useState } from 'react';
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
import { formatNumber } from 'src/utils/utils-format';
import { RadioChecked, RadioNoCheckedIcon } from 'src/assets/icons';
import moment from 'moment';
import ModalFilterGraph from '../modals/ModalFilterGraph';
import { optionsFilterByDuration } from '../utils/utils-webhook';
import { AppSelect2 } from './index';
import { IDataChart } from '../pages/HomePage/parts/PartUserGraph';

interface IChart {
  data: IDataChart[];
  duration: string;
}

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <Box
        bg={'rgba(0,0,0,0.5)'}
        color={'white'}
        borderRadius={5}
        p={2}
      >{`${label} :${formatNumber(payload[0]?.value, 4, '0')}`}</Box>
    );
  }

  return null;
};

interface IAppFilterGraph {
  duration: string;
  setDuration: (value: string) => void;
}

export const AppFilterGraph: FC<IAppFilterGraph> = ({
  duration,
  setDuration,
}) => {
  const [isOpenFilterGraphModal, setIsOpenFilterGraphModal] =
    useState<boolean>(false);

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
      {isOpenFilterGraphModal && (
        <ModalFilterGraph
          optionTimes={optionsFilterByDuration}
          open={isOpenFilterGraphModal}
          time={duration}
          onChangeTime={setDuration}
          onClose={() => setIsOpenFilterGraphModal(false)}
        />
      )}
    </Flex>
  );
};

const AppGraph: FC<IChart> = ({ data, duration }) => {
  const [key, setKey] = useState(0);
  const [lineHide, setLineHide] = useState<string>('activities');
  const dataChart = useMemo(() => {
    if (duration === '24h') {
      return data.map((item: IDataChart) => {
        return {
          ...item,
          label: moment(item?.time).format('HH:mm MMM DD'),
        };
      });
    }

    return data.map((item: IDataChart) => {
      return {
        ...item,
        label: moment(item?.time).format('MMM DD'),
      };
    });
  }, [duration, data]);

  useEffect(() => {
    setKey((pre) => pre + 1);
  }, [data]);

  return (
    <Box height={isMobile ? '400px' : '500px'} px={isMobile ? 0 : 5}>
      <ResponsiveContainer width="100%" height={isMobile ? '75%' : '85%'}>
        <LineChart
          width={500}
          height={300}
          data={dataChart}
          margin={{
            top: 15,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} horizontal stroke="#E8EAED" />
          {lineHide === 'message' && (
            <Line
              key={key}
              name="Numbers of messages"
              dataKey="message"
              stroke="#3A95FF"
              strokeWidth={2}
              dot={{
                r: isMobile ? 6 : 8,
                stroke: 'white',
                strokeWidth: isMobile ? 2 : 3,
                fill: '#3A95FF',
              }}
            />
          )}
          {lineHide === 'activities' && (
            <Line
              key={key}
              dot={{
                r: isMobile ? 6 : 8,
                stroke: 'white',
                strokeWidth: isMobile ? 2 : 3,
                fill: '#FFB547',
              }}
              strokeWidth={2}
              dataKey="activities"
              stroke="#FFB547"
              name="Numbers of activities"
            />
          )}

          <XAxis
            dataKey="label"
            axisLine={false}
            dy={10}
            tickLine={false}
            domain={['auto', 'auto']}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            tickLine={false}
            tickFormatter={(value: any) => formatNumber(value, 4, '0')}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
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
