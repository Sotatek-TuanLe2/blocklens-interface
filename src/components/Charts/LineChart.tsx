import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from 'recharts';
import { randomColor } from '../../utils/common';
import { VisualizationOptionsType } from 'src/utils/query.type';
import { Box } from '@chakra-ui/react';

type ChartConfigType = VisualizationOptionsType;
export type ChartProps = {
  data?: unknown[];
  xAxisKey?: string;
  yAxisKeys?: string[];
};
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
          {payload.map((entry: any, index: number) => (
            <Box as={'div'} key={index}>
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
        <div key={`item-${index}`} className="custom-legend">
          <span style={{ color: `${entry.color}` }}>{entry.value}</span>
          <span style={{ backgroundColor: `${entry.color}` }}></span>
        </div>
      ))}
    </div>
  );
};

const VisualizationLineChart = (props: Props) => {
  const { xAxisKey, yAxisKeys, data, configs } = props;
  const chartOptionsConfigs = configs?.chartOptionsConfigs;
  const xAxisConfigs = configs?.xAxisConfigs;
  const yAxisConfigs = configs?.yAxisConfigs;

  const logarithmicProps: any = yAxisConfigs?.logarithmic
    ? {
        scale: 'log',
        domain: ['auto', 'auto'],
      }
    : {};

  return (
    <ResponsiveContainer className="visual-container__visualization__linechart">
      <LineChart height={500} data={data} className={'bar-chart'}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} fill={'#ccc'}>
          <Label
            offset={0}
            position="insideBottom"
            value={xAxisConfigs?.title}
            fill={'#ccc'}
          />
        </XAxis>
        {yAxisKeys?.map((yAxisKey) => (
          <YAxis
            key={yAxisKey}
            dataKey={yAxisKey}
            label={{
              value: yAxisConfigs?.title,
              angle: -90,
              position: 'insideLeft',
              fill: '#ccc',
            }}
            {...logarithmicProps}
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
        {yAxisKeys?.map((yAxisKey) => (
          <Line
            key={yAxisKey}
            type="monotone"
            dataKey={yAxisKey}
            stroke={randomColor}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
export default VisualizationLineChart;
