import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { COLORS } from '../../utils/common';
import { CustomTooltip, renderLegend, tickFormatTime } from './BarChart';
import { ChartProps } from './LineChart';

type Props = ChartProps;
const VisualizationAreaChart = ({ data, xAxisKey, yAxisKeys }: Props) => {
  return (
    <ResponsiveContainer width={'96%'} height={'96%'}>
      <AreaChart
        className="area-chart"
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <XAxis
          dataKey={xAxisKey}
          tickFormatter={xAxisKey === 'time' ? tickFormatTime : undefined}
        />
        {yAxisKeys && !!yAxisKeys.length && <YAxis dataKey={yAxisKeys[0]} />}
        {yAxisKeys?.map((yAxisKey, index) => (
          <Area
            key={yAxisKey}
            dataKey={yAxisKey}
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
          />
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
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default VisualizationAreaChart;
