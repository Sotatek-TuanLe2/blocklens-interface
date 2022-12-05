import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { AppCard } from 'src/components';
interface IAppStatics {
  label: string | ((data?: any) => string);
  value: string | number | ((data?: any) => number | string);
  dataChart?: any[];
}

export const ChartStatics: FC<{ dataChart?: any[] }> = ({ dataChart }) => {
  if (dataChart?.length) {
    return (
      <Box height={'50px'} width={'40%'} px={5} className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500} height={300} data={dataChart}>
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#05CD99"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  }
  return <></>;
};

const AppStatistical: FC<IAppStatics> = ({ label, value, dataChart }) => {
  return (
    <>
      <AppCard className="box-info">
        <Box className="label">{label}</Box>
        <Box className="value">{value}</Box>
        <ChartStatics dataChart={dataChart} />
      </AppCard>
    </>
  );
};

export default AppStatistical;
