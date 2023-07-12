import { Box } from '@chakra-ui/react';
import { formatVisualizationValue } from 'src/utils/utils-format';

const CustomTooltip = (props: any) => {
  const { active, payload, label, numberFormat, showLabel = true } = props;

  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip__desc">
        {showLabel && (
          <div className="custom-tooltip__desc__detail">
            <span>{label}</span>
          </div>
        )}
        {payload.map((entry: any, index: number) => (
          <TooltipContent
            key={index}
            name={entry.name}
            value={entry.value || 'null'}
            numberFormat={numberFormat}
          />
        ))}
      </div>
    </div>
  );
};

const TooltipContent = ({
  name,
  value,
  numberFormat,
}: {
  name: string;
  value: string;
  numberFormat?: string;
}) => {
  const _renderTooltipValue = (value: any) => {
    if (numberFormat) {
      return formatVisualizationValue(numberFormat, value);
    }
    return value;
  };

  return (
    <Box as={'div'} className="custom-tooltip__desc__detail">
      <span>
        {`${name}: `}
        <span className="tooltip-value">
          {_renderTooltipValue(value.toString())}
        </span>
      </span>
      <br />
    </Box>
  );
};

export default CustomTooltip;
