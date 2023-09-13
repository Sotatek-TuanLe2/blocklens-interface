import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { isMobile } from 'react-device-detect';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { AppCard } from 'src/components';

interface IAppStatics {
  label: string | number;
  value?: string | number;
  dataChart: any[];
  isPercent?: boolean;
  keyStat: string;
}

interface IChartStatics {
  dataChart: any[];
  keyStat: string;
}

export type keyStats = 'message' | 'activities' | 'successRate' | 'webhooks';

const ChartStatics: FC<IChartStatics> = ({ dataChart, keyStat }) => {
  const dataFormat = dataChart.map((item) => {
    return {
      ...item,
      successRate: !!item.message ? item.messagesSuccess / item.message : 0,
    };
  });

  const getColorChart = () => {
    if (
      +dataFormat[dataFormat.length - 1][keyStat] >=
      +dataFormat[dataFormat.length - 2][keyStat]
    ) {
      return '#05CD99';
    } else {
      return '#EE5D50';
    }
  };

  if (!!dataChart?.length && !dataChart.every((item) => +item[keyStat] === 0)) {
    return (
      <Box
        height={'50px'}
        width={'35%'}
        px={5}
        className={isMobile ? 'chartMobile' : 'chart'}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500} height={300} data={dataFormat}>
            <Line
              type="monotone"
              dataKey={keyStat}
              stroke={getColorChart()}
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
  keyStat,
}) => {
  return (
    <>
      <AppCard className="box-info">
        <Box className="label">{label}</Box>
        <Box className="value">
          {value}
          {value && +value > 0 && isPercent ? '%' : ''}
        </Box>
        {keyStat !== 'webhooks' && (
          <ChartStatics dataChart={dataChart} keyStat={keyStat} />
        )}
      </AppCard>
    </>
  );
};

export default AppStatistical;
