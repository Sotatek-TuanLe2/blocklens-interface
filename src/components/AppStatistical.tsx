import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { isMobile } from 'react-device-detect';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { AppCard } from 'src/components';

interface IAppStatics {
  label: string | number;
  value?: string | number;
  dataChart?: any[];
  isPercent?: boolean;
}

export type keyStats = 'messages' | 'activities' | 'successRate' | 'webhooks';

export const ChartStatics: FC<{ dataChart?: any[] }> = ({ dataChart }) => {
  if (dataChart?.length) {
    return (
      <Box
        height={'50px'}
        width={'40%'}
        px={5}
        className={isMobile ? 'chartMobile' : 'chart'}
      >
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

const AppStatistical: FC<IAppStatics> = ({
  label,
  isPercent,
  value,
  dataChart,
}) => {
  return (
    <>
      <AppCard className="box-info">
        <Box className="label">{label}</Box>
        <Box className="value">
          {value || 0}
          {isPercent ? '%' : ''}
        </Box>
        <ChartStatics dataChart={dataChart} />
      </AppCard>
    </>
  );
};

export default AppStatistical;
