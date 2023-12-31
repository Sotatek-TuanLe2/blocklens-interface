import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { isNull, isUndefined, uniq } from 'lodash';
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
  ReferenceLine,
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
import {
  formatDefaultValueChart,
  formatVisualizationValue,
} from 'src/utils/utils-format';
import { isNumber, isString } from 'src/utils/utils-helper';
import { COLORS, getMonthAndDate } from '../../utils/common';
import CustomLegend from './CustomLegend';
import CustomTooltip from './CustomTooltip';
import { FadeLoader } from 'react-spinners';

type ChartConfigType = VisualizationOptionsType;
export type ChartProps = {
  data?: unknown[];
  xAxisKey?: string;
  yAxisKeys?: string[];
};
type Props = ChartProps & {
  isLoading?: boolean;
  type: typeof TYPE_VISUALIZATION[keyof typeof TYPE_VISUALIZATION];
  configs?: Partial<ChartConfigType>;
};

const VisualizationChart: React.FC<Props> = (props) => {
  const { type, xAxisKey, yAxisKeys, data, configs, isLoading } = props;
  const chartOptionsConfigs = configs?.chartOptionsConfigs;
  const xAxisConfigs = configs?.xAxisConfigs;
  const yAxisConfigs = configs?.yAxisConfigs;

  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);

  const tickFormatAxis = (axis: string) => (value: string) => {
    if (moment(new Date(value)).isValid() && !isNumber(value)) {
      return getMonthAndDate(value);
    }
    if (axis === 'x' && xAxisConfigs?.tickFormat) {
      return formatVisualizationValue(xAxisConfigs?.tickFormat, value);
    }
    if (axis === 'y' && yAxisConfigs?.tickFormat) {
      return formatVisualizationValue(yAxisConfigs?.tickFormat, value);
    }
    return formatDefaultValueChart(value);
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
    if (yAxisConfigs?.labelFormat) {
      return formatVisualizationValue(yAxisConfigs?.labelFormat, value);
    }
    return formatDefaultValueChart(value);
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
            strokeWidth={2}
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
              key={yAxisKey}
              dataKey={yAxisKey}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              fill={`url(#${yAxisKey})`}
              stackId={chartOptionsConfigs?.stacking ? 'area' : undefined}
              hide={hiddenKeys.includes(yAxisKey)}
              dot={<CustomizedDot fill={COLORS[index % COLORS.length]} />}
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
            barSize={18}
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
            strokeOpacity={0.3}
            strokeWidth={6}
            hide={hiddenKeys.includes(yAxisKey)}
          >
            {_renderLabelList(yAxisKey)}
          </Scatter>
        );
    }
  };

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
        if (isString(a[xAxisKey])) {
          return a[xAxisKey].localeCompare(b[xAxisKey]);
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
          const filteredData = data.filter(
            (item: any) => !isNull(item[yAxis]) && !isUndefined(item[yAxis]),
          );
          if (filteredData.every((item: any) => isNumber(item[yAxis]))) {
            hasNumberValues = true;
            calculatedValues.push(
              filteredData.map((item: any) => +item[yAxis]),
            );
          }
        });

      if (hasNumberValues) {
        if (chartOptionsConfigs?.stacking) {
          let newCalculatedValues: any[] = [];
          if (calculatedValues.length > 1) {
            for (let index = 0; index < data.length; index++) {
              newCalculatedValues[index] = calculatedValues
                .reduce((a, b) =>
                  new BigNumber(a[index]).plus(new BigNumber(b[index])),
                )
                .toNumber();
            }
          } else if (calculatedValues.length === 1) {
            newCalculatedValues = calculatedValues[0];
          }
          newCalculatedValues = uniq(newCalculatedValues);
          minValue = BigNumber.min(...newCalculatedValues).toNumber();
          maxValue = BigNumber.max(...newCalculatedValues).toNumber();
        } else {
          let newCalculatedValues: any[] = [];
          calculatedValues.forEach((array) => {
            newCalculatedValues.push(...uniq(array));
            newCalculatedValues = uniq(newCalculatedValues);
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
    maxValue = +maxValue > 0 ? maxValue : 0;

    return [minValue, maxValue];
  }, [data, xAxisKey, yAxisKeys, hiddenKeys, chartOptionsConfigs]);

  if (isLoading) {
    return (
      <Flex align={'center'} justify={'center'} w={'full'} h={'full'}>
        <FadeLoader
          cssOverride={{
            transform: 'scale(0.4) translateY(-35px)',
            transformOrigin: 'center',
          }}
          color="rgba(0, 2, 36, 0.8)"
        />{' '}
        Loading
      </Flex>
    );
  }

  const _renderZeroValueLine = () => {
    const [minValue] = yAxisDomain;
    if (new BigNumber(minValue).isNegative()) {
      return (
        <ReferenceLine
          className="ref-line"
          y={0}
          stroke="rgba(232, 234, 237, 1)"
          strokeDasharray="8 6"
          label={({ offset, viewBox }) => (
            <text
              offset={offset}
              x="0"
              y={viewBox.y}
              className="recharts-text recharts-label"
              stroke="none"
              type="number"
              fontWeight={400}
            >
              <tspan x="47" dy="0.355em">
                0
              </tspan>
            </text>
          )}
        />
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer className={`visual-container__visualization--${type}`}>
      <ChartComponent
        height={500}
        data={sortData()}
        className={`${type}-chart`}
        margin={{
          // left: 10,
          bottom: 12,
          right: 20,
          top: 20,
        }}
        style={{ '--bg-copyright': 'url(/images/copyright-logo-name.png)' }}
      >
        <CartesianGrid
          vertical={false}
          stroke="rgba(232, 234, 237, 1)"
          strokeDasharray="8 6"
        />
        <XAxis
          tickFormatter={tickFormatAxis('x')}
          dataKey={xAxisKey}
          fill={'#ccc'}
          reversed={xAxisConfigs?.reverseX}
          tick={{ fill: '#8D91A5', fontWeight: 400 }}
          tickLine={false}
          height={50}
        >
          <Label
            offset={0}
            position="insideBottom"
            value={xAxisConfigs?.title}
            fill={'#ccc'}
          />
        </XAxis>
        {_renderZeroValueLine()}
        {yAxisKeys && !!yAxisKeys.length && (
          <YAxis
            tickFormatter={tickFormatAxis('y')}
            tick={{ fill: '#8D91A5', fontWeight: 400 }}
            tickLine={false}
            domain={yAxisDomain}
            tickCount={6}
            allowDataOverflow={false}
            className="y-axis"
            {...logarithmicProps}
          >
            <Label
              position="insideLeft"
              value={yAxisConfigs?.title}
              angle={-90}
              fill="#ccc"
            />
          </YAxis>
        )}

        <Tooltip
          content={
            <CustomTooltip
              numberFormat={yAxisConfigs?.labelFormat}
              showLabel={type !== TYPE_VISUALIZATION.scatter}
            />
          }
          animationDuration={200}
          animationEasing={'linear'}
          filterNull={false}
        />
        {chartOptionsConfigs?.showLegend && (
          <Legend
            layout="vertical"
            content={
              <CustomLegend
                onToggleLegend={onToggleLegend}
                hiddenKeys={hiddenKeys}
                type={type}
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

const CustomizedDot = (props: any) => {
  const { cx, cy, fill } = props;

  if (!cx || !cy || !fill) return null;
  return (
    <svg fill={fill} x={cx - 6.53516} y={cy - 6.53516}>
      <circle opacity="0.3" cx="6.53516" cy="6" r="6" fill={fill} />
      <circle cx="6.53516" cy="6" r="3" fill={fill} />
    </svg>
  );
};
