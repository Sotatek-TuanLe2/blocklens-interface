import { Box } from '@chakra-ui/react';
import { formatVisualizationValue } from 'src/utils/utils-format';

const CustomTooltip = (props: any) => {
  const { active, payload, label, numberFormat } = props;

  const _renderTooltipValue = (value: any) => {
    if (numberFormat) {
      return formatVisualizationValue(numberFormat, value);
    }
    return value;
  };

  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="custom-tooltip__desc">
          {payload.map((entry: any, index: number) => (
            <Box
              as={'div'}
              key={index}
              className="custom-tooltip__desc__detail"
            >
              <span>
                {`${entry.name}:`}
                <span className="tooltip-value">
                  {' '}
                  {_renderTooltipValue(entry.value)}
                </span>
              </span>
              <br />
            </Box>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
