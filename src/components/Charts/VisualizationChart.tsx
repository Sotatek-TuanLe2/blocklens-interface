import {
  CartesianGrid,
  Legend,
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Scatter,
  ScatterChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from 'recharts';
import { COLORS, getHourAndMinute } from '../../utils/common';
import {
  TYPE_VISUALIZATION,
  VisualizationOptionsType,
} from 'src/utils/query.type';
import { formatVisualizationValue } from 'src/utils/utils-format';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import CustomLabelList from './CustomLabelList';

type ChartConfigType = VisualizationOptionsType;
export type ChartProps = {
  data?: unknown[];
  xAxisKey?: string;
  yAxisKeys?: string[];
};
type Props = ChartProps & {
  type: typeof TYPE_VISUALIZATION[keyof typeof TYPE_VISUALIZATION];
  configs?: Partial<ChartConfigType>;
};

const VisualizationChart: React.FC<Props> = (props) => {
  const { type, xAxisKey, yAxisKeys, data, configs } = props;
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

  const logarithmicProps: any = yAxisConfigs?.logarithmic
    ? {
        scale: 'log',
        domain: ['auto', 'auto'],
      }
    : {};

  const _renderChartType = useCallback(
    (yAxisKey: string, index: number) => {
      switch (type) {
        case TYPE_VISUALIZATION.line:
          return (
            <Line
              key={yAxisKey}
              type="monotone"
              dataKey={yAxisKey}
              stroke={COLORS[index % COLORS.length]}
              dot={false}
            >
              <CustomLabelList configs={configs} yAxisKey={yAxisKey} />
            </Line>
          );

        case TYPE_VISUALIZATION.area:
          return (
            <Area
              key={yAxisKey}
              dataKey={yAxisKey}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              stackId={chartOptionsConfigs?.stacking ? 'a' : undefined}
            >
              <CustomLabelList configs={configs} yAxisKey={yAxisKey} />
            </Area>
          );
        case TYPE_VISUALIZATION.bar:
          return (
            <Bar
              key={yAxisKey}
              dataKey={yAxisKey}
              fill={COLORS[index % COLORS.length]}
              stackId={chartOptionsConfigs?.stacking ? 'a' : undefined}
            >
              <CustomLabelList configs={configs} yAxisKey={yAxisKey} />
            </Bar>
          );
        default:
          return (
            <Scatter
              key={yAxisKey}
              dataKey={yAxisKey}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              name={yAxisKey}
            >
              <CustomLabelList configs={configs} yAxisKey={yAxisKey} />
            </Scatter>
          );
      }
    },
    [type],
  );

  const containerClassName = useMemo(() => {
    switch (type) {
      case TYPE_VISUALIZATION.bar:
        return 'visual-container__visualization__bar';
      case TYPE_VISUALIZATION.line:
        return 'visual-container__visualization__line';
      case TYPE_VISUALIZATION.scatter:
        return 'visual-container__visualization__scatter';
      default:
        return 'visual-container__visualization__area';
    }
  }, [type]);

  const ChartComponent = useMemo(() => {
    switch (type) {
      case TYPE_VISUALIZATION.bar:
        return BarChart;
      case TYPE_VISUALIZATION.line:
        return LineChart;
      case TYPE_VISUALIZATION.scatter:
        return ScatterChart;
      default:
        return AreaChart;
    }
  }, [type]);

  return (
    <ResponsiveContainer className={containerClassName}>
      <ChartComponent
        height={500}
        data={data}
        className={`${type}-chart`}
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
          <>{_renderChartType(yAxisKey, index)}</>
        ))}
      </ChartComponent>
    </ResponsiveContainer>
  );
};

export default VisualizationChart;
