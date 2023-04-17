import React from 'react';
import { CounterIcon } from 'src/assets/icons';
import 'src/styles/components/CounterConfigurations.scss';

const VisualizationCounter = () => {
  return (
    <div className="main-counter">
      <div className="counter-result">
        <div className="background-counter">
          <CounterIcon />
        </div>
        <div className="text-result">sss</div>
      </div>
    </div>
  );
};

export default VisualizationCounter;
