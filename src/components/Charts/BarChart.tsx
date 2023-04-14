import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from 'recharts';
import { getHourAndMinute, randomColor } from '../../utils/common';
import { ChartProps } from './LineChart';
import { VisualizationOptionsType } from '../../utils/query.type';
import { Box } from '@chakra-ui/react';
type ChartConfigType = VisualizationOptionsType;
type Props = ChartProps & {
  configs?: Partial<ChartConfigType>;
};

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className=" custom-tooltip__label">{label}</p>
        <div className="custom-tooltip__desc">
          {payload.map((entry: any) => (
            <Box as={'div'}>
              <span style={{ backgroundColor: `${entry.fill}` }}></span>
              <span>{entry.name}</span>
              <span>{entry.value}</span>
              <br />
            </Box>
          ))}
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
            <span style={{ color: `${entry.color}` }}>{entry.value}</span>
            <span style={{ backgroundColor: `${entry.color}` }}></span>
          </div>
        </>
      ))}
    </div>
  );
};

const VisualizationBarChart = (props: Props) => {
  const { xAxisKey, yAxisKeys, data, configs } = props;
  const chartOptionsConfigs = configs?.chartOptionsConfigs;
  const xAxisConfigs = configs?.xAxisConfigs;
  const yAxisConfigs = configs?.yAxisConfigs;

  const tickFormatTime = (value: string) => {
    return getHourAndMinute(new Date(value));
  };

  return (
    <>
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <BarChart height={500} data={data} className={'bar-chart'}>
          <CartesianGrid vertical={false} strokeDasharray="4" />
          <XAxis
            dataKey={xAxisKey}
            tickFormatter={xAxisKey === 'time' ? tickFormatTime : undefined}
            fill={'#ccc'}
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
          <Tooltip
            content={<CustomTooltip />}
            animationDuration={200}
            animationEasing={'linear'}
          />
          {chartOptionsConfigs?.showLegend && (
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              content={renderLegend}
            />
          )}
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
