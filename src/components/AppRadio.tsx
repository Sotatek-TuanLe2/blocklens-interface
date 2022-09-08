import { Radio, RadioProps } from '@chakra-ui/react';
import { FC } from 'react';

interface AppRadioProps extends RadioProps {
  size?: 'md' | 'lg' | 'sm';
}

const AppRadio: FC<AppRadioProps> = ({ children, size = 'md', ...props }) => {
  return (
    <Radio {...props} size={size}>
      {children}
    </Radio>
  );
};

export default AppRadio;
