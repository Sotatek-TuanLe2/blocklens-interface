import { Flex, Heading, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { AppButton } from 'src/components';
import { BasePage } from 'src/layouts';
import 'src/styles/pages/ErrorPages.scss';
import { ROUTES } from 'src/utils/common';

const Error404Page = () => (
  <BasePage isFullWidth>
    <Flex
      justifyContent={'center'}
      alignItems={'center'}
      className="error-page"
    >
      <Stack textAlign={'center'} spacing={'20px'} alignItems="center">
        <img
          src="/images/img-not-found.png"
          alt="404 not found"
          width={'50%'}
        />
        <Heading size={'md'}>
          {
            'The page you are looking for might be removed\n or is temporarily unavailable'
          }
        </Heading>
        <Link to={ROUTES.HOME}>
          <AppButton width={'fit-content'} borderRadius={20}>
            Go back home
          </AppButton>
        </Link>
      </Stack>
    </Flex>
  </BasePage>
);

export default Error404Page;
