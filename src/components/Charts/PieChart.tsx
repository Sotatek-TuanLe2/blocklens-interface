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
import CustomTooltip from './CustomTooltip';
import { Flex } from '@chakra-ui/react';
import { ChartProps } from './LineChart';
import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import BigNumber from 'bignumber.js';

type ChartConfigType = VisualizationOptionsType;
type Props = ChartProps & {
  configs?: Partial<ChartConfigType>;
};

const VisualizationPieChart = ({
  data,
  yAxisKeys,
  xAxisKey,
  configs,
}: Props) => {
  const chartOptionsConfigs = configs?.chartOptionsConfigs;
  const RADIAN = Math.PI / 180;

  const [dataCharts, setDataCharts] = useState<any>(data);
  const [hiddenCharts, setHiddenCharts] = useState<any>([]);

  useEffect(() => {
    setDataCharts(data);
  }, [data]);

  const reducedData = useMemo(() => {
    if (!yAxisKeys || !dataCharts) {
      return [];
    }

    const groupedData = dataCharts.reduce(
      (acc: { [key: string]: number }, item: any) => {
        acc[item[xAxisKey || 0]] = item[yAxisKeys?.[0]];
        return acc;
      },
      {},
    );

    const result = Object.keys(groupedData)
      .filter((name) => {
        const isNumber = !new BigNumber(groupedData[name]).isNaN();
        return isNumber && new BigNumber(groupedData[name]).isGreaterThan(0);
      })
      .map((name) => {
        return { [xAxisKey || 0]: name, [yAxisKeys?.[0]]: +groupedData[name] };
      });
    return result;
  }, [dataCharts, yAxisKeys]);

  const onToggleLegend = (dataKey: string) => {
    // check if length hidden chart and check datakey is added to hidden chart
    const isRemoveHiddenChart =
      !!hiddenCharts?.find((value: any) => {
        return value[xAxisKey || 0] === dataKey;
      }) && !!hiddenCharts.length;

    // logic add and remove hidden chart depend on isRemoveHiddenChart
    const newHiddenChart = isRemoveHiddenChart
      ? hiddenCharts.filter((value: any) => {
          return value[xAxisKey || 0] !== dataKey;
        })
      : [...hiddenCharts, { [xAxisKey || 0]: dataKey }];

    setHiddenCharts([...newHiddenChart]);

    // creates an array of unique xAxiskey
    const newHideChart = _.xorBy(data, newHiddenChart, xAxisKey as string);

    setDataCharts(newHideChart);
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
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      {yAxisKeys?.length === 1 ? (
        <PieChart className="pie-chart">
          <Pie
            data={reducedData}
            dataKey={yAxisKeys?.[0]}
            label={
              chartOptionsConfigs?.showDataLabels && _renderCustomizedLabel
            }
            nameKey={xAxisKey}
            innerRadius={100}
            labelLine={false}
          >
            {dataCharts &&
              dataCharts.map((entry: string, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
          </Pie>
          <Tooltip
            content={
              <CustomTooltip type="pie" numberFormat={configs?.numberFormat} />
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
                  data={data}
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
      value: item[xAxisKey || 0],
    };
  });

  const newData = [];
  for (const item of dataClone) {
    const index = payload.findIndex(
      (legendItem: any) => legendItem.value === item.value,
    );
    if (index !== -1) {
      newData.push(payload[index]);
    } else {
      newData.push(item);
    }
  }

  return (
    <div>
      {newData.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="custom-legend">
          <span
            onClick={() => onToggleLegend(entry.value)}
            style={{
              color: `${entry.color || '#e9ebee'}`,
              opacity: `${entry.color ? '1' : '0.5'}`,
            }}
          >
            {entry.value}
          </span>
          <span
            style={{
              backgroundColor: `${entry.color}`,
              opacity: `${entry.color ? '1' : '0.5'}`,
            }}
          ></span>
        </div>
      ))}
    </div>
  );
};
