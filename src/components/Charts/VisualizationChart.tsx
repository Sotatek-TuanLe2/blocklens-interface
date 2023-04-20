import {
  CartesianGrid,
  Legend,
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Scatter,
  ScatterChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
  LabelList,
} from 'recharts';
import { COLORS, getHourAndMinute } from '../../utils/common';
import {
  TYPE_VISUALIZATION,
  VisualizationOptionsType,
} from 'src/utils/query.type';
import { formatVisualizationValue } from 'src/utils/utils-format';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';
import moment from 'moment';
import { useMemo } from 'react';

type ChartConfigType = VisualizationOptionsType;
export type ChartProps = {
  data?: unknown[];
  xAxisKey?: string;
  yAxisKeys?: string[];
};
type Props = ChartProps & {
  type: typeof TYPE_VISUALIZATION[keyof typeof TYPE_VISUALIZATION];
  configs?: Partial<ChartConfigType>;
};

const VisualizationChart: React.FC<Props> = (props) => {
  const { type, xAxisKey, yAxisKeys, data, configs } = props;
  const chartOptionsConfigs = configs?.chartOptionsConfigs;
  const xAxisConfigs = configs?.xAxisConfigs;
  const yAxisConfigs = configs?.yAxisConfigs;

  const tickFormatAxis = (axis: string) => (value: string) => {
    if (moment(new Date(value)).isValid() && isNaN(+value)) {
      return getHourAndMinute(value);
    }
    if (axis === 'x' && configs?.xAxisConfigs?.tickFormat) {
      return formatVisualizationValue(configs?.xAxisConfigs?.tickFormat, value);
    }
    if (axis === 'y' && configs?.yAxisConfigs?.tickFormat) {
      return formatVisualizationValue(configs?.yAxisConfigs?.tickFormat, value);
    }
    return value;
  };

  const labelFormat = (value: string) => {
    if (configs?.yAxisConfigs?.labelFormat) {
      return formatVisualizationValue(
        configs?.yAxisConfigs?.labelFormat,
        value,
      );
    }
    return value;
  };

  const logarithmicProps: any = yAxisConfigs?.logarithmic
    ? {
        scale: 'log',
        domain: ['auto', 'auto'],
      }
    : {};

  const containerClassName = useMemo(() => {
    switch (type) {
      case TYPE_VISUALIZATION.bar:
        return 'visual-container__visualization__bar';
      case TYPE_VISUALIZATION.line:
        return 'visual-container__visualization__line';
      case TYPE_VISUALIZATION.scatter:
        return 'visual-container__visualization__scatter';
      default:
        return 'visual-container__visualization__area';
    }
  }, [type]);

  const ChartComponent = useMemo(() => {
    switch (type) {
      case TYPE_VISUALIZATION.bar:
        return BarChart;
      case TYPE_VISUALIZATION.line:
        return LineChart;
      case TYPE_VISUALIZATION.scatter:
        return ScatterChart;
      default:
        return AreaChart;
    }
  }, [type]);

  const YAxisComponent = useMemo(() => {
    switch (type) {
      case TYPE_VISUALIZATION.bar:
        return Bar;
      case TYPE_VISUALIZATION.line:
        return Line;
      case TYPE_VISUALIZATION.scatter:
        return Scatter;
      default:
        return Area;
    }
  }, [type]);

  return (
    <ResponsiveContainer className={containerClassName}>
      <ChartComponent>
        <CartesianGrid vertical={false} strokeDasharray="4" />
      </ChartComponent>
    </ResponsiveContainer>
  );
};
