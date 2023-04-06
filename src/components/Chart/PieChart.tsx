import React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type Props = {
  data: unknown[];
  dataKey: string;
  nameKey?: string;
};
const VisualizationPieChart = ({ data, dataKey, nameKey }: Props) => {
  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <PieChart>
        <Pie data={data} dataKey={dataKey} nameKey={nameKey} fill="#8884d8" />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default VisualizationPieChart;
