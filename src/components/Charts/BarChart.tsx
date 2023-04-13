import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LegendProps,
  LegendType,
} from 'recharts';
import { ChartProps } from './LineChart';
import { getHourAndMinute, randomColor } from '../../utils/common';
import moment from 'moment';

type Props = ChartProps;

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className=" custom-tooltip__label">{`${moment(label).format(
          'YYYY-MM-DD HH:mm',
        )}`}</p>
        <div className="custom-tooltip__desc">
          <span style={{ backgroundColor: `${payload[0].fill}` }}></span>
          <span>size</span>
          <span>{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
};

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <div>
      {payload.map((entry: any, index: number) => (
        <>
          <div key={`item-${index}`} className="custom-legend">
            <span style={{ color: '#8884d8' }}>{entry.value}</span>
            <span style={{ backgroundColor: '#8884d8' }}></span>
          </div>
        </>
      ))}
    </div>
  );
};

const VisualizationBarChart = ({ xAxisKey, yAxisKeys, data }: Props) => {
  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <BarChart height={500} data={data} className="bar-chart">
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          dataKey={xAxisKey}
          tickFormatter={(value) => {
            return getHourAndMinute(new Date(value));
          }}
        />
        {yAxisKeys?.map((yKey) => (
          <YAxis key={yKey} dataKey={yKey} />
        ))}
        <Tooltip
          content={<CustomTooltip />}
          animationDuration={200}
          animationEasing={'linear'}
        />
        <Legend
          verticalAlign="middle"
          align="right"
          layout="vertical"
          content={renderLegend}
        />
        {yAxisKeys?.map((yKey) => (
          <Bar key={yKey} dataKey={yKey} fill={randomColor} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VisualizationBarChart;
