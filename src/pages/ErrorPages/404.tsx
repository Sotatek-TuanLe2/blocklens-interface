import { Flex, Heading, Stack, Box } from '@chakra-ui/react';
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
      <img src="/images/img-not-found.png" alt="404 not found" width={'35%'} />
      <Stack spacing={'40px'}>
        <Flex flexDirection={'column'} alignItems={'start'}>
          <Heading size={'4xl'}>Oops</Heading>
          <Heading size={'4xl'}>
            <span className="text-nothing">nothing</span> here...
          </Heading>
        </Flex>
        <Box>
          <Heading size={'sm'} color={'#c5c6ca'}>
            Uh oh, we can't seem to find the page you're looking for.
          </Heading>
          <Heading size={'sm'} color={'#c5c6ca'}>
            Try going back to previous page or Contact us for more information
          </Heading>
        </Box>

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
