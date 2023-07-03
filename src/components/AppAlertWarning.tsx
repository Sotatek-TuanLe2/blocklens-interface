import { FC, ReactNode } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { WarningIcon } from 'src/assets/icons';
import 'src/styles/components/AppAlertWarning.scss';

interface IAppAlertWarning {
  children: ReactNode;
}

const AppAlertWarning: FC<IAppAlertWarning> = ({ children }) => {
  return (
    <Flex className="app-alert" my={3}>
      <WarningIcon />
      <Box>{children}</Box>
    </Flex>
  );
};

export default AppAlertWarning;
