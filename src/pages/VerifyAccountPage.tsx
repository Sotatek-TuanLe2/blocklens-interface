import { FC, useEffect, useState } from 'react';
import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { AppCard, AppButton } from 'src/components';
import GuestPage from 'src/layouts/GuestPage';
import 'src/styles/pages/LoginPage.scss';
import { useLocation } from 'react-router';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { useHistory } from 'react-router';
import { ROUTES } from 'src/utils/common';
import { getErrorMessage } from 'src/utils/utils-helper';

const VerifyAccountPage: FC = () => {
  const { search } = useLocation();
  const history = useHistory();

  const useQuery = () => {
    return new URLSearchParams(search);
  };
  const query = useQuery();
  const token = query.get('token');
  const [isVerifyFail, setIsVerifyFail] = useState<boolean>(false);

  const onVerify = async () => {
    if (!token) {
      toastError({ message: 'Oops. Something went wrong!' });
      setIsVerifyFail(true);
      return;
    }
    try {
      await rf.getRequest('AuthRequest').verifyMail(token);
      setIsVerifyFail(false);
      toastSuccess({ message: 'Verify Successfully!' });
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
      setIsVerifyFail(true);
    }
  };
  useEffect(() => {
    onVerify();
  }, []);

  return (
    <GuestPage>
      <Flex className="box-login">
        <AppCard className="box-form" borderRadius={'4px'}>
          <Box textAlign={'center'}>
            {isVerifyFail
              ? 'Failed to complete verify email.'
              : 'Verify email is successfully'}{' '}
          </Box>
          <AppButton
            mt={5}
            onClick={() => history.push(ROUTES.LOGIN)}
            size={'lg'}
            width={'full'}
          >
            Return to login
          </AppButton>
        </AppCard>
      </Flex>
    </GuestPage>
  );
};

export default VerifyAccountPage;
