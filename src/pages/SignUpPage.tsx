import { FC, useEffect, useRef, useState } from 'react';
import React from 'react';
import { Box, Flex, useColorModeValue, Text } from '@chakra-ui/react';
import {
  AppField,
  AppCard,
  AppInput,
  AppButton,
  AppLink,
} from 'src/components';
import Footer from 'src/layouts/Footer';
import { Sotalabs } from 'src/assets/icons';
import { createValidator } from 'src/utils/utils-validator';
import 'src/styles/pages/LoginPage.scss';

interface IDataForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignUpPage: FC = () => {
  const initDataSignUp = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataSignUp);
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

      <Flex className="box-login">
        <AppCard className="box-form">
          <Box className="title">Sign up</Box>

          <AppButton
            onClick={() => console.log('sdsd')}
            variant={'outline'}
            size={'lg'}
            width={'full'}
            mt={6}
            mb={3}
          >
            Sign up with Google
          </AppButton>

          <Flex className="divider">
            <Box className="border" />
            <Box color={colorText}>or</Box>
            <Box className="border" />
          </Flex>

          <Box color={colorText}>
            <AppField label={'FIRST NAME'}>
              <AppInput
                placeholder="Gavin"
                value={dataForm.firstName}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    firstName: e.target.value,
                  })
                }
                validate={{
                  name: `firstName`,
                  validator: validator.current,
                  rule: ['required'],
                }}
              />
            </AppField>
            <AppField label={'LAST NAME'}>
              <AppInput
                placeholder="Belson"
                value={dataForm.lastName}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    lastName: e.target.value,
                  })
                }
                validate={{
                  name: `lastName`,
                  validator: validator.current,
                  rule: ['required'],
                }}
              />
            </AppField>

            <AppField label={'EMAIL'}>
              <AppInput
                value={dataForm.email}
                placeholder="gavin@sotatek.com"
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    email: e.target.value,
                  })
                }
                validate={{
                  name: `email`,
                  validator: validator.current,
                  rule: ['required', 'email'],
                }}
              />
            </AppField>

            <AppField label={'PASSWORD'}>
              <AppInput
                value={dataForm.password}
                type="password"
                placeholder={'••••••••'}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    password: e.target.value,
                  })
                }
                validate={{
                  name: `password`,
                  validator: validator.current,
                  rule: 'required|min:8',
                }}
              />
            </AppField>

            <AppButton
              mt={5}
              onClick={() => console.log(dataForm, 'dataForm')}
              size={'lg'}
              width={'full'}
              disabled={isDisableSubmit}
            >
              Sign up
            </AppButton>

            <Flex className="link-back">
              <AppLink to={'/login'} fontWeight={500}>
                Return to Login
              </AppLink>
            </Flex>
          </Box>
        </AppCard>
      </Flex>
      <Footer />
    </Box>
  );
};

export default SignUpPage;
