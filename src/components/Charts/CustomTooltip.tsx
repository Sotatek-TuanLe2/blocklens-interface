import { Box } from '@chakra-ui/react';
import { TYPE_VISUALIZATION } from 'src/utils/query.type';
import { formatVisualizationValue } from 'src/utils/utils-format';
import { formatNumber } from 'src/utils/utils-format';
import { isNumber } from 'src/utils/utils-helper';

const CustomTooltip = (props: any) => {
  const { active, payload, label, type, numberFormat } = props;

  const _renderTooltipValue = (value: any) => {
    if (type === TYPE_VISUALIZATION.pie && numberFormat) {
      return formatVisualizationValue(numberFormat, Number(value));
    }
    if (isNumber(value)) {
      return formatNumber(value);
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
                {`${entry.payload.name}:`}
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
