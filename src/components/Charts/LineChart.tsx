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
import { COLORS, getHourAndMinute } from '../../utils/common';
import { VisualizationOptionsType } from 'src/utils/query.type';
import { formatVisualizationValue } from 'src/utils/utils-format';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';
import moment from 'moment';

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
    <ResponsiveContainer className="visual-container__visualization__line">
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
          tickFormatter={tickFormatAxis('x')}
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
          <Line
            key={yAxisKey}
            type="monotone"
            dataKey={yAxisKey}
            stroke={COLORS[index % COLORS.length]}
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
