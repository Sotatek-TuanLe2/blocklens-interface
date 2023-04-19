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

type ChartConfigType = VisualizationOptionsType;
type Props = {
  data: unknown[];
  nameKey?: string;
  dataKey: string[];
  configs?: Partial<ChartConfigType>;
};

const VisualizationPieChart = ({ data, dataKey, nameKey, configs }: Props) => {
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
  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      {dataKey.length === 1 ? (
        <PieChart className="pie-chart">
          <Pie
            data={data}
            dataKey={dataKey?.[0]}
            label={chartOptionsConfigs?.showDataLabels && renderCustomizedLabel}
            nameKey={nameKey}
            innerRadius={100}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
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
