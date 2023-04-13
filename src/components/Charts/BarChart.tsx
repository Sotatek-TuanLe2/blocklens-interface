import React from 'react';
import { Text } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { ChartProps } from './LineChart';
import { getHourAndMinute, randomColor } from '../../utils/common';
import { VisualizationOptionsType } from '../../utils/visualization.type';
type ChartConfigType = VisualizationOptionsType;
type Props = ChartProps & {
  configs?: Partial<ChartConfigType>;
};
const VisualizationBarChart = (props: Props) => {
  const { xAxisKey, yAxisKeys, data, configs } = props;
  const chartOptionsConfigs = configs?.chartOptionsConfigs;
  const xAxisConfigs = configs?.xAxisConfigs;
  const yAxisConfigs = configs?.yAxisConfigs;

  return (
    <>
      <Text>{chartOptionsConfigs?.name}</Text>
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <BarChart height={500} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            tickFormatter={(value) => {
              return getHourAndMinute(new Date(value));
            }}
            fill={'#fff'}
          >
            <Label
              offset={0}
              position="insideBottom"
              value={xAxisConfigs?.title}
              fill={'#ccc'}
            />
          </XAxis>
          {yAxisKeys?.map((yKey) => (
            <YAxis
              key={yKey}
              dataKey={yKey}
              label={{
                value: yAxisConfigs?.title,
                angle: -90,
                position: 'insideLeft',
                fill: '#ccc',
              }}
            />
          ))}
          <Tooltip />
          {chartOptionsConfigs?.showLegend && <Legend />}
          {yAxisKeys?.map((yKey) => (
            <Bar
              key={yKey}
              dataKey={yKey}
              fill={randomColor}
              stackId={chartOptionsConfigs?.stacking ? 'a' : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default VisualizationBarChart;
