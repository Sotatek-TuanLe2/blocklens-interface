import React from 'react';
import {
  CartesianGrid,
  Label,
  LabelList,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartProps } from './LineChart';
import { VisualizationOptionsType } from 'src/utils/query.type';
import { formatVisualizationValue } from 'src/utils/utils-format';
import { COLORS, getHourAndMinute } from 'src/utils/common';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';
import moment from 'moment';

type ChartConfigType = VisualizationOptionsType;
type Props = ChartProps & {
  configs?: Partial<ChartConfigType>;
};

const VisualizationScatterChart = (props: Props) => {
  const { xAxisKey, yAxisKeys, data, configs } = props;
  const chartOptionsConfigs = configs?.chartOptionsConfigs;
  const xAxisConfigs = configs?.xAxisConfigs;
  const yAxisConfigs = configs?.yAxisConfigs;

  const tickFormatAxis = (axis: string) => (value: string) => {
    if (moment(new Date(value)).isValid() && isNaN(+value)) {
      return getHourAndMinute(value);
    }
    if (axis === 'x' && configs?.xAxisConfigs?.tickFormat) {
      return formatVisualizationValue(configs?.xAxisConfigs?.tickFormat, value);
    }
    if (axis === 'y' && configs?.yAxisConfigs?.tickFormat) {
      return formatVisualizationValue(configs?.yAxisConfigs?.tickFormat, value);
    }
    return value;
  };

  const labelFormat = (value: string) => {
    if (configs?.yAxisConfigs?.labelFormat) {
      return formatVisualizationValue(
        configs?.yAxisConfigs?.labelFormat,
        value,
      );
    }
    return value;
  };

  const logarithmicProps: any = yAxisConfigs?.logarithmic
    ? {
        scale: 'log',
        domain: ['auto', 'auto'],
      }
    : {};

  return (
    <>
      <ResponsiveContainer width={'96%'} height={'92%'}>
        <ScatterChart
          data={data}
          className="scatter-chart"
          margin={{
            top: 20,
            bottom: 20,
            left: 10,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="4" />
          <XAxis
            dataKey={xAxisKey}
            tickFormatter={tickFormatAxis('x')}
            fill={'#ccc'}
          >
            <Label
              offset={0}
              position="insideBottom"
              value={xAxisConfigs?.title}
              fill={'#ccc'}
            />
          </XAxis>

          {yAxisKeys && !!yAxisKeys.length && (
            <YAxis
              label={{
                value: yAxisConfigs?.title,
                angle: -90,
                position: 'insideLeft',
                fill: '#ccc',
              }}
              tickFormatter={tickFormatAxis('y')}
              {...logarithmicProps}
            />
          )}

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
              content={<CustomLegend />}
            />
          )}
          {yAxisKeys?.map((yAxisKey, index) => (
            <Scatter
              key={yAxisKey}
              dataKey={yAxisKey}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              name={yAxisKey}
            >
              {!configs?.chartOptionsConfigs?.stacking &&
                configs?.chartOptionsConfigs?.showDataLabels && (
                  <LabelList
                    dataKey={yAxisKey}
                    position="top"
                    formatter={labelFormat}
                  />
                )}
            </Scatter>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </>
  );
};

export default VisualizationScatterChart;
