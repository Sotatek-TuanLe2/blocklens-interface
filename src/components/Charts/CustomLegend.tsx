import React from 'react';

const CustomLegend = (props: any) => {
  const { payload, onHideChart, hideChart } = props;

  return (
    <div>
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="custom-legend">
          <span
            className={hideChart.includes(entry.dataKey) && 'hide-legend'}
            onClick={() => onHideChart(entry.dataKey)}
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
