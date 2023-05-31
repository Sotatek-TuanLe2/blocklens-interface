import BigNumber from 'bignumber.js';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
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
import { isNumber } from 'src/utils/utils-helper';
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

  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);

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
    // check dataKey in hiddenKeys
    const newHiddenKeys = hiddenKeys.includes(dataKey)
      ? hiddenKeys.filter((value) => {
          return value !== dataKey;
        })
      : [...hiddenKeys, dataKey];

    setHiddenKeys(newHiddenKeys);
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
        <LabelList
          dataKey={yAxisKey}
          position={yAxisConfigs?.logarithmic ? 'insideTop' : 'top'}
          formatter={labelFormat}
        />
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
            strokeWidth={3}
            dot={false}
            hide={hiddenKeys.includes(yAxisKey)}
          >
            {_renderLabelList(yAxisKey)}
          </Line>
        );

      case TYPE_VISUALIZATION.area:
        return (
          <>
            <Area
              type="monotone"
              key={yAxisKey}
              dataKey={yAxisKey}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={3}
              fill={`url(#${yAxisKey})`}
              stackId={chartOptionsConfigs?.stacking ? 'area' : undefined}
              hide={hiddenKeys.includes(yAxisKey)}
            >
              {_renderLabelList(yAxisKey)}
            </Area>
            <defs>
              <linearGradient id={yAxisKey} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={COLORS[index % COLORS.length]}
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor={COLORS[index % COLORS.length]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
          </>
        );
      case TYPE_VISUALIZATION.bar:
        return (
          <Bar
            key={yAxisKey}
            dataKey={yAxisKey}
            fill={COLORS[index % COLORS.length]}
            stackId={chartOptionsConfigs?.stacking ? 'bar' : undefined}
            hide={hiddenKeys.includes(yAxisKey)}
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
            hide={hiddenKeys.includes(yAxisKey)}
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
        if (isNumber(a[xAxisKey])) {
          return Number(a[xAxisKey]) - Number(b[xAxisKey]);
        }
        if (moment(a[xAxisKey]).isValid()) {
          return moment.utc(a[xAxisKey]).diff(moment.utc(b[xAxisKey]));
        }
        return a[xAxisKey] - b[xAxisKey];
      });
    }
    return result;
  };

  const yAxisDomain = useMemo(() => {
    let minValue: number | string = 'auto';
    let maxValue: number | string = 'auto';

    if (data && !!data.length && xAxisKey && !!yAxisKeys?.length) {
      const calculatedValues: any[] = [];
      let hasNumberValues = false;

      yAxisKeys
        .filter((yAxis: string) => !hiddenKeys.includes(yAxis))
        .forEach((yAxis: string) => {
          if (data.every((item: any) => isNumber(item[yAxis]))) {
            hasNumberValues = true;
            calculatedValues.push(data.map((item: any) => +item[yAxis]));
          }
        });

      if (hasNumberValues) {
        if (chartOptionsConfigs?.stacking) {
          const newCalculatedValues = [...calculatedValues];
          Array(data.length).forEach((_, index) => {
            newCalculatedValues[index] = calculatedValues.reduce((a, b) =>
              new BigNumber(a[index]).plus(new BigNumber(b[index])),
            );
          });
          minValue = BigNumber.min(...newCalculatedValues).toNumber();
          maxValue = BigNumber.max(...newCalculatedValues).toNumber();
        } else {
          const newCalculatedValues: any[] = [];
          calculatedValues.forEach((array) => {
            newCalculatedValues.push(...array);
          });
          minValue = BigNumber.minimum(...newCalculatedValues).toNumber();
          maxValue = BigNumber.maximum(...newCalculatedValues).toNumber();
        }
      }
    }

    if (minValue === 'auto' && maxValue === 'auto') {
      return [minValue, maxValue];
    }

    minValue = +minValue > 0 ? 0 : minValue;
    maxValue = Math.ceil(
      new BigNumber(maxValue).multipliedBy(new BigNumber(1.05)).toNumber(),
    );

    return [minValue, maxValue];
  }, [data, xAxisKey, yAxisKeys, hiddenKeys, chartOptionsConfigs]);

  return (
    <ResponsiveContainer className={containerClassName}>
      <ChartComponent
        height={500}
        data={sortData()}
        className={`${type}-chart`}
        margin={{
          left: 20,
          bottom: 30,
          right: 10,
        }}
      >
        <CartesianGrid
          vertical={false}
          stroke="#2F3B58"
          strokeDasharray="3 3"
        />
        <XAxis
          tickFormatter={tickFormatAxis('x')}
          dataKey={xAxisKey}
          fill={'#ccc'}
          reversed={xAxisConfigs?.reverseX}
          tick={{ fill: '#8D91A5', fontWeight: 400 }}
          tickLine={false}
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
            tick={{ fill: '#8D91A5', fontWeight: 400 }}
            tickLine={false}
            domain={yAxisDomain}
            {...logarithmicProps}
          />
        )}
        <Tooltip
          content={
            <CustomTooltip numberFormat={configs?.yAxisConfigs?.labelFormat} />
          }
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
                hiddenKeys={hiddenKeys}
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
