import React from 'react';

const CustomLegend = (props: any) => {
  const { payload, onToggleLegend, hiddenCharts } = props;

  return (
    <div>
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="custom-legend">
          <span
            className={hiddenCharts.includes(entry.dataKey) && 'hide-legend'}
            onClick={() => onToggleLegend(entry.dataKey)}
            style={{ color: `${entry.color}` }}
          >
            {entry.value}
          </span>
          <span style={{ backgroundColor: `${entry.color}` }}></span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
