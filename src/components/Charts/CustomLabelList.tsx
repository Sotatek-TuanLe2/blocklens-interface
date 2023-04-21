import { LabelList } from 'recharts';
import { VisualizationOptionsType } from 'src/utils/query.type';
import { formatVisualizationValue } from 'src/utils/utils-format';

type ChartConfigType = VisualizationOptionsType;
type Props = {
  configs?: Partial<ChartConfigType>;
  yAxisKey: string;
};

const CustomLabelList: React.FC<Props> = (props) => {
  const { configs, yAxisKey } = props;

  const labelFormat = (value: string) => {
    if (configs?.yAxisConfigs?.labelFormat) {
      return formatVisualizationValue(
        configs?.yAxisConfigs?.labelFormat,
        value,
      );
    }
    return value;
  };
  return (
    <>
      {!configs?.chartOptionsConfigs?.stacking &&
        configs?.chartOptionsConfigs?.showDataLabels && (
          <LabelList
            dataKey={yAxisKey}
            position="top"
            formatter={labelFormat}
          />
        )}
    </>
  );
};

export default CustomLabelList;
