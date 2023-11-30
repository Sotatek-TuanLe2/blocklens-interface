import { APP_STATUS } from 'src/utils/utils-app';
import { WEBHOOK_STATUS } from 'src/utils/utils-webhook';
import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import 'src/styles/components/AppStatus.scss';

interface IAppStatus {
  status?: APP_STATUS | WEBHOOK_STATUS;
  activeText?: string;
  inactiveText?: string;
}

const AppStatus: FC<IAppStatus> = ({
  status,
  activeText = 'Active',
  inactiveText = 'Inactive',
}) => {
  const isActive = status === 1;

  return (
    <Box
      className={`app-status-tag ${
        isActive ? 'app-status-tag--active' : 'app-status-tag--inactive'
      }`}
    >
      {isActive ? activeText : inactiveText}
    </Box>
  );
};

export default AppStatus;
