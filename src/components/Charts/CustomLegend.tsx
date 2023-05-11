import React from 'react';

const CustomLegend = (props: any) => {
  const { payload, onToggleLegend, hiddenKeys } = props;

  return (
    <div>
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="custom-legend">
          <span style={{ backgroundColor: `${entry.color}` }}></span>

          <span
            className={hiddenKeys.includes(entry.dataKey) ? 'hide-legend' : ''}
            onClick={() => onToggleLegend(entry.dataKey)}
            style={{ color: `${entry.color}` }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
