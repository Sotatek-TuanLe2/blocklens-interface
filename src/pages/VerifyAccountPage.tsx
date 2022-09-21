import { FC } from 'react';
import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { AppCard, AppButton } from 'src/components';
import BasePage from 'src/layouts/BasePage';
import 'src/styles/pages/LoginPage.scss';
import { useLocation } from 'react-router';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { useHistory } from 'react-router';

const VerifyAccountPage: FC = () => {
  const { search } = useLocation();
  const history = useHistory();

  const useQuery = () => {
    return new URLSearchParams(search);
  };
  const query = useQuery();
  const uid = query.get('uid');
  const vid = query.get('vid');

  const onVerify = async () => {
    if (!uid || !vid) return;
    try {
      await rf.getRequest('AuthRequest').verifyMail(+uid, vid);
      toastSuccess({ message: 'Verify Successfully!' });
      history.push('/login');
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  return (
    <BasePage>
      <Flex className="box-login">
        <AppCard className="box-form" borderRadius={'4px'}>
          <Box textAlign={'center'}>Click Verify to create your account.</Box>
          <AppButton mt={5} onClick={onVerify} size={'lg'} width={'full'}>
            Verify
          </AppButton>
        </AppCard>
      </Flex>
    </BasePage>
  );
};

export default VerifyAccountPage;
