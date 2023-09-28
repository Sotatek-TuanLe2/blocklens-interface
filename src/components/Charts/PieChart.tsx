import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { COLORS } from 'src/utils/common';
import { VisualizationOptionsType } from 'src/utils/query.type';
import { Box, Flex, Tooltip as TooltipUI } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { isNull, isUndefined } from 'lodash';
import BigNumber from 'bignumber.js';
import { isNumber } from 'src/utils/utils-helper';
import { ChartProps } from './VisualizationChart';
import {
  formatDefaultValueChart,
  formatVisualizationValue,
} from 'src/utils/utils-format';
import { FadeLoader } from 'react-spinners';

type ChartConfigType = VisualizationOptionsType;
type Props = ChartProps & {
  isLoading?: boolean;
  configs?: Partial<ChartConfigType>;
};

const VisualizationPieChart = ({
  data,
  yAxisKeys,
  xAxisKey = '0',
  configs,
  isLoading,
}: Props) => {
  const chartOptionsConfigs = configs?.chartOptionsConfigs;
  const RADIAN = Math.PI / 180;

  const [hiddenKeys, setHiddenKeys] = useState<{ [key: string]: boolean }>({});

  const reducedData = useMemo(() => {
    if (!yAxisKeys || !yAxisKeys.length || !data || !data.length) {
      return [];
    }

    const groupedData: any = [];
    const [yAxisKey] = yAxisKeys;
    let hasNumberValues = false;
    data.forEach((item: any) => {
      const existedData = groupedData.find(
        (data: any) => data.key === item[xAxisKey],
      );

      if (isNull(item[yAxisKey]) || isUndefined(item[yAxisKey])) {
        return;
      }

      if (!hasNumberValues && !isNumber(item[yAxisKey])) {
        return;
      }

      hasNumberValues = true; // mark to not run isNumber again

      const addedValue = item[yAxisKey]
        ? new BigNumber(item[yAxisKey]).toNumber()
        : 0;
      if (!existedData) {
        groupedData.push({
          key: item[xAxisKey],
          value: addedValue,
        });
      } else {
        existedData.value = new BigNumber(existedData.value)
          .plus(new BigNumber(addedValue))
          .toNumber();
      }
    });

    const result = groupedData
      .filter((item: { key: string; value: any }) => {
        return new BigNumber(item.value).isGreaterThan(0);
      })
      .map((item: { key: string; value: any }) => {
        return { [xAxisKey]: item.key, [yAxisKeys?.[0]]: item.value };
      });

    return !result.length ? data : result;
  }, [data, yAxisKeys]);

  const onToggleLegend = (dataKey: string) => {
    setHiddenKeys((prevState) => {
      const newHiddenKeys = { ...prevState };
      if (!!newHiddenKeys[dataKey]) {
        delete newHiddenKeys[dataKey];
      } else {
        newHiddenKeys[dataKey] = true;
      }
      return newHiddenKeys;
    });
  };

  const _renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (!chartOptionsConfigs?.showDataLabels) {
      return null;
    }

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const percentage = percent * 100;
    if (percentage <= 5) {
      return null;
    }

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={'12px'}
      >
        {`${percentage.toFixed(2)}%`}
      </text>
    );
  };

  const pieSectionColor = useMemo(() => {
    const colors: { [key: string]: string } = {};

    if (!reducedData) {
      return colors;
    }

    for (let index = 0; index < reducedData.length; index++) {
      const item = reducedData[index];
      colors[item[xAxisKey]] = COLORS[index % COLORS.length];
    }

    return colors;
  }, [reducedData]);

  const shownData = useMemo(
    () => reducedData.filter((entry: any) => !hiddenKeys[entry[xAxisKey]]),
    [reducedData, hiddenKeys],
  );

  const totalValue = useMemo(() => {
    if (!yAxisKeys || !shownData.length) {
      return 0;
    }
    const [yAxisKey] = yAxisKeys;
    return shownData
      .map((item: any) => item[yAxisKey])
      .reduce((a: any, b: any) => {
        return new BigNumber(a).plus(new BigNumber(b)).toNumber();
      });
  }, [shownData]);

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

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      {yAxisKeys?.length === 1 ? (
        <PieChart
          className="pie-chart"
          style={{ '--bg-copyright': 'url(/images/copyright-logo-name.png)' }}
        >
          <Pie
            data={shownData}
            dataKey={yAxisKeys?.[0]}
            nameKey={xAxisKey}
            labelLine={false}
            label={_renderCustomizedLabel}
            strokeWidth={`${
              shownData.length > 100 ? 100 / shownData.length : 1
            }px`}
          >
            {!!shownData.length &&
              shownData.map((entry: any) => (
                <Cell
                  key={`cell-${entry[xAxisKey]}`}
                  fill={pieSectionColor[entry[xAxisKey]]}
                />
              ))}
          </Pie>
          <Tooltip
            content={
              <CustomTooltip
                numberFormat={configs?.numberFormat}
                totalValue={totalValue}
              />
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
                  data={reducedData}
                  xAxisKey={xAxisKey}
                />
              }
            />
          )}
        </PieChart>
      ) : (
        <Flex alignItems="center" justifyContent="center">
          Only one pie chart at a time please.
        </Flex>
      )}
    </ResponsiveContainer>
  );
};

export default VisualizationPieChart;

const CustomLegend = (props: any) => {
  const { payload, onToggleLegend, data, xAxisKey } = props;

  // create an array of xAisKey from data array
  const dataClone = (data as any).map((item: any) => {
    return {
      value: item[xAxisKey],
    };
  });

  const newData = [];
  for (let index = 0; index < dataClone.length; index++) {
    const item = dataClone[index];
    const i = payload.findIndex(
      (legendItem: any) => legendItem.value === item.value,
    );
    if (i !== -1) {
      newData.push({ ...payload[i], color: COLORS[index % COLORS.length] });
    } else {
      newData.push({ ...item, color: COLORS[index % COLORS.length] });
    }
  }

  console.log('newData', newData);

  return (
    <div>
      {newData.map((entry: any, index: number) => (
        <div
          key={`item-${index}`}
          className="custom-legend"
          onClick={() => onToggleLegend(entry.value)}
        >
          <span
            style={{
              backgroundColor: `${entry.color}`,
              opacity: `${entry.type ? '1' : '0.5'}`,
            }}
          ></span>
          <TooltipUI hasArrow placement="top" label={String(entry.value)}>
            <span
              style={{
                opacity: `${entry.type ? '1' : '0.5'}`,
              }}
            >
              {formatDefaultValueChart(String(entry.value))}
            </span>
          </TooltipUI>
        </div>
      ))}
    </div>
  );
};

const CustomTooltip = (props: any) => {
  const { active, payload, numberFormat, totalValue } = props;

  const _renderTooltipValue = (value: any) => {
    if (isNumber(value) && numberFormat) {
      return formatVisualizationValue(numberFormat, Number(value));
    }
    return value;
  };

  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        {payload.map((entry: any, index: number) => (
          <div key={index}>
            <p className="custom-tooltip__label">{entry.name}</p>
            <div className="custom-tooltip__desc">
              <Box as={'div'} className="custom-tooltip__desc__detail">
                <span style={{ backgroundColor: entry.fill }}></span>
                <span>
                  {entry.dataKey}:{' '}
                  <span className="tooltip-value">{`${_renderTooltipValue(
                    entry.value,
                  )} (${((entry.value / totalValue) * 100).toFixed(
                    2,
                  )}%)`}</span>
                </span>
                <br />
              </Box>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
