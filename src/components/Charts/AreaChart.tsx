import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { COLORS, getHourAndMinute } from '../../utils/common';
import { CustomTooltip, renderLegend } from './BarChart';
import { ChartProps } from './LineChart';
import { VisualizationOptionsType } from 'src/utils/query.type';
import { checkFormatValue } from 'src/utils/utils-format';

type ChartConfigType = VisualizationOptionsType;
type Props = ChartProps & {
  configs?: Partial<ChartConfigType>;
};
const VisualizationAreaChart = (props: Props) => {
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
    <ResponsiveContainer width={'96%'} height={'96%'}>
      <AreaChart
        className="area-chart"
        data={data}
        margin={{
          top: 20,
          bottom: 20,
          left: 10,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="4" />
        <XAxis
          dataKey={xAxisKey}
          tickFormatter={
            xAxisKey === 'time' ? tickFormatTime : tickFormatAxis('x')
          }
          fill={'#ccc'}
        >
          <Label
            offset={0}
            position="insideBottom"
            value={xAxisConfigs?.title}
            fill={'#ccc'}
          />
        </XAxis>
        {yAxisKeys && !!yAxisKeys.length && <YAxis dataKey={yAxisKeys[0]} />}
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
            tickFormatter={tickFormatAxis('y')}
            {...logarithmicProps}
          />
        ))}

        <Tooltip
          content={<CustomTooltip />}
          animationDuration={200}
          animationEasing={'linear'}
        />

        {yAxisKeys?.map((yAxisKey, index) => (
          <Area
            key={yAxisKey}
            dataKey={yAxisKey}
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
          >
            {!configs?.chartOptionsConfigs?.stacking &&
              configs?.chartOptionsConfigs?.showDataLabels && (
                <LabelList
                  dataKey={yAxisKey}
                  position="top"
                  formatter={labelFormat}
                />
              )}
          </Area>
        ))}

        {chartOptionsConfigs?.showLegend && (
          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            content={renderLegend}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default VisualizationAreaChart;
