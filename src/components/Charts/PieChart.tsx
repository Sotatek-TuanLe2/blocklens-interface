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
import { Box, Flex } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import { isNumber } from 'src/utils/utils-helper';
import { ChartProps } from './VisualizationChart';
import { formatVisualizationValue } from 'src/utils/utils-format';

type ChartConfigType = VisualizationOptionsType;
type Props = ChartProps & {
  configs?: Partial<ChartConfigType>;
};

const VisualizationPieChart = ({
  data,
  yAxisKeys,
  xAxisKey = '0',
  configs,
}: Props) => {
  const chartOptionsConfigs = configs?.chartOptionsConfigs;
  const RADIAN = Math.PI / 180;

  const [hiddenKeys, setHiddenKeys] = useState<{ [key: string]: boolean }>({});

  const reducedData = useMemo(() => {
    if (!yAxisKeys || !yAxisKeys.length || !data) {
      return [];
    }

    const groupedData: any = [];
    const [yAxisKey] = yAxisKeys;
    data.forEach((item: any) => {
      const existedData = groupedData.find(
        (data: any) => data.key === item[xAxisKey],
      );
      if (!isNumber(item[yAxisKey])) {
        return;
      }

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

    return result;
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
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={'12px'}
      >
        {`${(percent * 100).toFixed(2)}%`}
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

  return (
    <ResponsiveContainer width={'100%'} height={'90%'}>
      {yAxisKeys?.length === 1 ? (
        <PieChart className="pie-chart">
          <Pie
            data={shownData}
            dataKey={yAxisKeys?.[0]}
            nameKey={xAxisKey}
            labelLine={false}
            label={
              chartOptionsConfigs?.showDataLabels && _renderCustomizedLabel
            }
            stroke="#101530"
          >
            {shownData &&
              shownData.map((entry: any) => (
                <Cell
                  style={{ outline: 'none', border: 'none' }}
                  key={`cell-${entry[xAxisKey]}`}
                  fill={pieSectionColor[entry[xAxisKey]]}
                />
              ))}
          </Pie>
          <Tooltip
            content={<CustomTooltip numberFormat={configs?.numberFormat} />}
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

  return (
    <div>
      {newData.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="custom-legend">
          <span
            style={{
              backgroundColor: `${entry.color}`,
              opacity: `${entry.type ? '1' : '0.5'}`,
            }}
          ></span>
          <span
            onClick={() => onToggleLegend(entry.value)}
            style={{
              opacity: `${entry.type ? '1' : '0.5'}`,
            }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomTooltip = (props: any) => {
  const { active, payload, numberFormat } = props;

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
          <>
            {/* <p className="custom-tooltip__label">{entry.name}</p> */}
            <div className="custom-tooltip__desc">
              <Box
                as={'div'}
                key={index}
                className="custom-tooltip__desc__detail"
                color={'white'}
              >
                <span style={{ backgroundColor: entry.fill }}></span>
                <span>{`${entry.name}: ${_renderTooltipValue(
                  entry.value,
                )}`}</span>
                <br />
              </Box>
            </div>
          </>
        ))}
      </div>
    );
  }
  return null;
};
