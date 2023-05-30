import { Flex } from '@chakra-ui/react';
import React from 'react';
import { TYPE_VISUALIZATION } from 'src/utils/query.type';

const CustomLegend = (props: any) => {
  const { payload, onToggleLegend, hiddenKeys, type } = props;

  return (
    <Flex flexDirection={'row'}>
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="custom-legend">
          <span
            className={type === TYPE_VISUALIZATION.line ? 'line-chart' : ''}
            style={{ backgroundColor: `${entry.color}` }}
          ></span>

          <span
            className={hiddenKeys.includes(entry.dataKey) ? 'hide-legend' : ''}
            onClick={() => onToggleLegend(entry.dataKey)}
            style={{ color: `${entry.color}` }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </Flex>
  );
};

export default CustomLegend;
