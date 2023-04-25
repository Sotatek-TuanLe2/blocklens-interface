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
import CustomLegend from './CustomLegend';
import { Flex } from '@chakra-ui/react';
import { ChartProps } from './LineChart';
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

  const renderCustomizedLabel = ({
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

  function reducedData(data: unknown[] | undefined) {
    if (!yAxisKeys || !data) {
      return [];
    }

    const groupedData = data.reduce(
      (acc: { [key: string]: number }, item: any) => {
        acc[item[xAxisKey || 0]] = item[yAxisKeys?.[0]];
        return acc;
      },
      {},
    );

    const reducedData = Object.keys(groupedData)
      .filter((name) => {
        const isNumber = !new BigNumber(groupedData[name]).isNaN();
        return isNumber && new BigNumber(groupedData[name]).isGreaterThan(0);
      })
      .map((name) => {
        return { [xAxisKey || 0]: name, [yAxisKeys?.[0]]: +groupedData[name] };
      });
    return reducedData;
  }

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      {yAxisKeys?.length === 1 ? (
        <PieChart className="pie-chart">
          <Pie
            data={reducedData(data)}
            dataKey={yAxisKeys?.[0]}
            label={chartOptionsConfigs?.showDataLabels && renderCustomizedLabel}
            nameKey={xAxisKey}
            innerRadius={100}
            labelLine={false}
          >
            {data &&
              data.map((entry, index) => (
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
              content={<CustomLegend />}
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
