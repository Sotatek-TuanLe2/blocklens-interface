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
} from 'recharts';
import { getHourAndMinute, randomColor } from '../../utils/common';
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

  const tickFormatTime = (value: string) => {
    return getHourAndMinute(new Date(value));
  };

  const logarithmicProps: any = yAxisConfigs?.logarithmic
    ? {
        scale: 'log',
        domain: ['auto', 'auto'],
      }
    : {};

  return (
    <ResponsiveContainer className="visual-container__visualization__linechart">
      <LineChart height={500} data={data} className="line-chart">
        <CartesianGrid vertical={false} strokeDasharray="4" />
        <XAxis
          tickFormatter={xAxisKey === 'time' ? tickFormatTime : undefined}
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
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
export default VisualizationLineChart;
