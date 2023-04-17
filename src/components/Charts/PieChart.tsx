import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { COLORS } from 'src/utils/common';
import { CustomTooltip, renderLegend } from './BarChart';

type Props = {
  data: unknown[];
  dataKey: string;
  nameKey?: string;
};
const VisualizationPieChart = ({ data, dataKey, nameKey }: Props) => {
  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <PieChart className="pie-chart">
        <Pie data={data} dataKey={dataKey} nameKey={nameKey} innerRadius={100}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
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
      </PieChart>
    </ResponsiveContainer>
  );
};

export default VisualizationPieChart;
