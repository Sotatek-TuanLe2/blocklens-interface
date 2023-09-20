import { Box, Flex, Heading, Stack } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AppButton } from 'src/components';
import { GuestPage } from 'src/layouts';
import { clearUser } from 'src/store/user';
import 'src/styles/pages/ErrorPages.scss';
import { ROUTES } from 'src/utils/common';

const Error403Page = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(clearUser());
    history.push(ROUTES.LOGIN);
  };

  return (
    <GuestPage>
      <Flex justifyContent={'center'} className={`base-page-container`}>
        <Box
          marginTop={{ base: '30px', lg: '40px' }}
          className="base-page-container__content base-page-container__content--full"
        >
          <Flex
            justifyContent={'center'}
            alignItems={'center'}
            className="error-page"
          >
            <Stack textAlign={'center'} spacing={'20px'} alignItems="center">
              <img src="/images/403_forbidden.png" alt="403 forbidden" />
              <Heading size={'lg'}>You don't have access to this page</Heading>
              <AppButton
                onClick={onLogout}
                width={'fit-content'}
                borderRadius={20}
              >
                Go to Log-in page
              </AppButton>
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </GuestPage>
  );
};

export default Error403Page;
