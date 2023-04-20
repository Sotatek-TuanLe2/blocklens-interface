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
  LabelList,
} from 'recharts';
import { COLORS, getHourAndMinute } from '../../utils/common';
import { ChartProps } from './LineChart';
import { VisualizationOptionsType } from '../../utils/query.type';
import { formatVisualizationValue } from 'src/utils/utils-format';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';
import moment from 'moment';
type ChartConfigType = VisualizationOptionsType;
type Props = ChartProps & {
  configs?: Partial<ChartConfigType>;
};

const VisualizationBarChart = (props: Props) => {
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
      <ResponsiveContainer className="visual-container__visualization__bar">
        <BarChart height={500} data={data} className={'bar-chart'}>
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
              dataKey={yAxisKeys[0]}
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
          {yAxisKeys?.map((yKey, index) => (
            <Bar
              key={yKey}
              dataKey={yKey}
              fill={COLORS[index % COLORS.length]}
              stackId={chartOptionsConfigs?.stacking ? 'a' : undefined}
            >
              {!configs?.chartOptionsConfigs?.stacking &&
                configs?.chartOptionsConfigs?.showDataLabels && (
                  <LabelList
                    dataKey={yKey}
                    position="top"
                    formatter={labelFormat}
                  />
                )}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default VisualizationBarChart;
