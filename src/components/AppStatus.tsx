import { APP_STATUS } from 'src/utils/utils-app';
import { WEBHOOK_STATUS } from 'src/utils/utils-webhook';
import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

interface IAppStatus {
  status?: APP_STATUS | WEBHOOK_STATUS;
}

const AppStatus: FC<IAppStatus> = ({ status }) => {
  const isActive = status === 1;

  return (
    <Box className={`status ${isActive ? 'active' : 'inactive'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </Box>
  );
};

export default AppStatus;
