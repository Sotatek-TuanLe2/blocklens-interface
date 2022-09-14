import { FC, useRef, useState, useEffect } from 'react';
import React from 'react';
import { Box, Flex, useColorModeValue, Text } from '@chakra-ui/react';
import Card from 'src/components/Card';
import Field from 'src/components/Field';
import AppInput from 'src/components/AppInput';
import AppButton from 'src/components/AppButton';
import AppLink from 'src/components/AppLink';
import { Sotalabs } from 'src/assets/icons';
import Footer from 'src/layouts/Footer';
import { createValidator } from 'src/utils/utils-validator';
import GoogleLoginButton from 'src/components/GoogleLoginButton';

interface IDataForm {
  email: string;
  password: string;
}

const LoginPage: FC = () => {
  const initDataLogin = {
    email: '',
    password: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataLogin);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const colorText = useColorModeValue('gray.500', 'white');

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.500'}>{message}</Text>,
    }),
  );

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  return (
    <Box>
      <Flex justifyContent={'center'} my={5}>
        <Sotalabs width={'200px'} />
      </Flex>

      <Flex justifyContent={'center'} minH={'calc(100vh - 160px)'} mt={8}>
        <Card
          width={['100%', '550px']}
          p={'30px'}
          mx={['15px', 0]}
          height={'max-content'}
        >
          <Box
            textAlign={'center'}
            pb={6}
            fontSize={'24px'}
            borderBottom={'1px solid #E9EDF7'}
            margin={'0 -30px'}
            fontWeight={500}
          >
            Login
          </Box>

          <GoogleLoginButton />

          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Box borderBottom={'1px solid #E9EDF7'} width={'45%'} />
            <Box color={colorText}>or</Box>
            <Box borderBottom={'1px solid #E9EDF7'} width={'45%'} />
          </Flex>

          <Box mt={4} color={colorText}>
            <Field label={'EMAIL'}>
              <AppInput
                fontSize={'16px'}
                placeholder="gavin@sotatek.com"
                value={dataForm.email}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    email: e.target.value,
                  })
                }
                size="lg"
                validate={{
                  name: `email`,
                  validator: validator.current,
                  rule: 'required|email',
                }}
              />
            </Field>

            <Field label={'PASSWORD'}>
              <AppInput
                fontSize={'16px'}
                type="password"
                value={dataForm.password}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    password: e.target.value,
                  })
                }
                size="lg"
                placeholder={'••••••••'}
                validate={{
                  name: `password`,
                  validator: validator.current,
                  rule: ['required'],
                }}
              />
              <AppLink to={'/reset-password'}>Forgot your password?</AppLink>
            </Field>

            <AppButton
              onClick={() => console.log(dataForm, 'dataForm')}
              borderRadius={'4px'}
              size={'lg'}
              width={'full'}
              disabled={isDisableSubmit}
            >
              Log in
            </AppButton>

            <Box mt={2}>
              Don't have an account?
              <AppLink to={'/sign-up'} fontWeight={500}>
                Sign up
              </AppLink>
            </Box>

            <Box mt={4} fontSize={'13px'}>
              This site is protected by reCAPTCHA and the Google{' '}
              <AppLink to={'#'}>Privacy Policy </AppLink> and{' '}
              <AppLink to={'#'}>Terms of Service</AppLink> apply.
            </Box>
          </Box>
        </Card>
      </Flex>
      <Footer />
    </Box>
  );
};

export default LoginPage;
