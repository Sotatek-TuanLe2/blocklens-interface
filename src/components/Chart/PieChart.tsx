import React from 'react';
import { Pie, PieChart, Tooltip } from 'recharts';

type Props = {
  data: unknown[];
  dataKey: string;
  nameKey?: string;
};
const VisualizationPieChart = ({ data, dataKey, nameKey }: Props) => {
  return (
    <PieChart width={730} height={250}>
      <Pie data={data} dataKey={dataKey} nameKey={nameKey} fill="#8884d8" />
      <Tooltip />
    </PieChart>
  );
};

export default VisualizationPieChart;
