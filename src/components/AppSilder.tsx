import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const AppSlider = ({ handleChange, value, ...props }: any) => {
  const [sliderValue, setSliderValue] = useState(value);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => setSliderValue(value), [value]);

  return (
    <Slider
      id="slider"
      value={sliderValue}
      colorScheme="pink"
      onChange={(v) => {
        setSliderValue(v);
        handleChange(v);
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      {...props}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip
        hasArrow
        color="white"
        placement="top"
        isOpen={showTooltip}
        label={`${sliderValue}%`}
      >
        <SliderThumb />
      </Tooltip>
    </Slider>
  );
};

export default AppSlider;
