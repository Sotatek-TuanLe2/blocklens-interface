import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
  LabelList,
} from 'recharts';
import { getHourAndMinute, randomColor } from '../../utils/common';
import { VisualizationOptionsType } from 'src/utils/query.type';
import { checkFormatValue } from 'src/utils/utils-format';
import { CustomTooltip, renderLegend } from './BarChart';

type ChartConfigType = VisualizationOptionsType;
export type ChartProps = {
  data?: unknown[];
  xAxisKey?: string;
  yAxisKeys?: string[];
};
type Props = ChartProps & {
  configs?: Partial<ChartConfigType>;
};

const VisualizationLineChart = (props: Props) => {
  const { xAxisKey, yAxisKeys, data, configs } = props;
  const chartOptionsConfigs = configs?.chartOptionsConfigs;
  const xAxisConfigs = configs?.xAxisConfigs;
  const yAxisConfigs = configs?.yAxisConfigs;

  const tickFormatTime = (value: string) => {
    return getHourAndMinute(new Date(value));
  };

  const tickFormatAxis = (axis: string) => (value: string) => {
    if (axis === 'x' && configs?.xAxisConfigs?.tickFormat) {
      return checkFormatValue(configs?.xAxisConfigs?.tickFormat, value);
    }
    if (axis === 'y' && configs?.yAxisConfigs?.tickFormat) {
      return checkFormatValue(configs?.yAxisConfigs?.tickFormat, value);
    }
    return value;
  };

  const labelFormat = (value: string) => {
    if (configs?.yAxisConfigs?.labelFormat) {
      return checkFormatValue(configs?.yAxisConfigs?.labelFormat, value);
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
    <ResponsiveContainer className="visual-container__visualization__linechart">
      <LineChart
        height={500}
        data={data}
        className="line-chart"
        margin={{
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="4" />
        <XAxis
          tickFormatter={
            xAxisKey === 'time' ? tickFormatTime : tickFormatAxis('x')
          }
          dataKey={xAxisKey}
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
            content={renderLegend}
          />
        )}
        {yAxisKeys?.map((yAxisKey) => (
          <Line
            key={yAxisKey}
            type="monotone"
            dataKey={yAxisKey}
            stroke={randomColor}
            dot={false}
          >
            {!configs?.chartOptionsConfigs?.stacking &&
              configs?.chartOptionsConfigs?.showDataLabels && (
                <LabelList
                  dataKey={yAxisKey}
                  position="top"
                  formatter={labelFormat}
                />
              )}
          </Line>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
export default VisualizationLineChart;
