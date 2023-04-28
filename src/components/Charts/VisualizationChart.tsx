import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  TYPE_VISUALIZATION,
  VisualizationOptionsType,
} from 'src/utils/query.type';
import { formatVisualizationValue } from 'src/utils/utils-format';
import { COLORS, getHourAndMinute } from '../../utils/common';
import CustomLegend from './CustomLegend';
import CustomTooltip from './CustomTooltip';

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

  const [hiddenCharts, setHiddenCharts] = useState<string[]>([]);

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

  const onToggleLegend = (dataKey: string) => {
    // check dataKey in hiddenCharts
    const newHideChart = hiddenCharts.includes(dataKey)
      ? hiddenCharts.filter((value) => {
          return value !== dataKey;
        })
      : [...hiddenCharts, dataKey];

    setHiddenCharts(newHideChart);
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

  const _renderLabelList = (yAxisKey: string) => {
    return (
      !configs?.chartOptionsConfigs?.stacking &&
      configs?.chartOptionsConfigs?.showDataLabels && (
        <LabelList dataKey={yAxisKey} position="top" formatter={labelFormat} />
      )
    );
  };

  const _renderChartType = (yAxisKey: string, index: number) => {
    switch (type) {
      case TYPE_VISUALIZATION.line:
        return (
          <Line
            key={yAxisKey}
            type="monotone"
            dataKey={yAxisKey}
            stroke={COLORS[index % COLORS.length]}
            dot={false}
            hide={hiddenCharts.includes(yAxisKey)}
          >
            {_renderLabelList(yAxisKey)}
          </Line>
        );

      case TYPE_VISUALIZATION.area:
        return (
          <Area
            key={yAxisKey}
            dataKey={yAxisKey}
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
            stackId={chartOptionsConfigs?.stacking ? 'area' : undefined}
            hide={hiddenCharts.includes(yAxisKey)}
          >
            {_renderLabelList(yAxisKey)}
          </Area>
        );
      case TYPE_VISUALIZATION.bar:
        return (
          <Bar
            key={yAxisKey}
            dataKey={yAxisKey}
            fill={COLORS[index % COLORS.length]}
            stackId={chartOptionsConfigs?.stacking ? 'bar' : undefined}
            hide={hiddenCharts.includes(yAxisKey)}
          >
            {_renderLabelList(yAxisKey)}
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
            hide={hiddenCharts.includes(yAxisKey)}
          >
            {_renderLabelList(yAxisKey)}
          </Scatter>
        );
    }
  };

  const containerClassName = useMemo(() => {
    switch (type) {
      case TYPE_VISUALIZATION.bar:
        return 'visual-container__visualization--bar';
      case TYPE_VISUALIZATION.line:
        return 'visual-container__visualization--line';
      case TYPE_VISUALIZATION.scatter:
        return 'visual-container__visualization--scatter';
      default:
        return 'visual-container__visualization--area';
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

  const sortData = () => {
    if (!data) {
      return [];
    }
    if (!xAxisKey || !xAxisConfigs) {
      return data;
    }

    let result = [...data];
    // sorting
    if (xAxisConfigs?.sortX) {
      result = result.sort((a: any, b: any) => {
        if (moment(a[xAxisKey]).isValid()) {
          return moment.utc(a[xAxisKey]).diff(moment.utc(b[xAxisKey]));
        }
        return a[xAxisKey] - b[xAxisKey];
      });
    }
    // reverse
    if (xAxisConfigs?.reverseX) {
      result = result.reverse();
    }
    return result;
  };

  return (
    <ResponsiveContainer className={containerClassName}>
      <ChartComponent
        height={500}
        data={sortData()}
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
            content={
              <CustomLegend
                onToggleLegend={onToggleLegend}
                hiddenCharts={hiddenCharts}
              />
            }
          />
        )}
        {yAxisKeys?.map((yAxisKey, index) => (
          <React.Fragment key={yAxisKey}>
            {_renderChartType(yAxisKey, index)}
          </React.Fragment>
        ))}
      </ChartComponent>
    </ResponsiveContainer>
  );
};

export default VisualizationChart;
