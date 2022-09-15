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
import { Sotalabs } from 'src/assets/icons';
import Footer from 'src/layouts/Footer';
import { createValidator } from 'src/utils/utils-validator';
import 'src/styles/pages/LoginPage.scss';

interface IDataForm {
  email: string;
}

const RestPasswordPage: FC = () => {
  const initDataRestPassword = {
    email: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataRestPassword);
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
          <Box className="title">
            <Text pb={3}>Reset password.</Text>

            <Text color={colorText} className="sub-text">
              Enter your account's email address and we will send you password
              reset link.
            </Text>
          </Box>

          <Box mt={5} color={colorText}>
            <AppField label={'EMAIL'}>
              <AppInput
                placeholder="gavin@sotatek.com"
                value={dataForm.email}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    email: e.target.value,
                  })
                }
                validate={{
                  name: `email`,
                  validator: validator.current,
                  rule: 'required|email',
                }}
              />
            </AppField>

            <AppButton
              onClick={() => console.log(dataForm, 'dataForm')}
              size={'lg'}
              width={'full'}
              mt={3}
              disabled={isDisableSubmit}
            >
              Send reset email
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

export default RestPasswordPage;
