import {FC, useEffect, useRef, useState} from 'react';
import React from 'react';
import { Box, Flex, useColorModeValue, Text } from '@chakra-ui/react';
import Card from 'src/components/Card';
import Field from 'src/components/Field';
import AppInput from 'src/components/AppInput';
import AppButton from 'src/components/AppButton';
import { Sotalabs } from 'src/assets/icons';
import Footer from 'src/layouts/Footer';
import { createValidator } from 'src/utils/utils-validator';
import AppLink from '../components/AppLink';

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
            borderBottom={'1px solid #E9EDF7'}
            margin={'0 -30px'}
          >
            <Text fontSize={'24px'} fontWeight={500} pb={3}>
              Reset password.
            </Text>

            <Text
              color={colorText}
              fontSize={'16px'}
              maxW={'300px'}
              margin={'0 auto'}
            >
              Enter your account's email address and we will send you password
              reset link.
            </Text>
          </Box>

          <Box mt={5} color={colorText}>
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

            <AppButton
              onClick={() => console.log(dataForm, 'dataForm')}
              borderRadius={'4px'}
              size={'lg'}
              width={'full'}
              mt={3}
              disabled={isDisableSubmit}
            >
              Send reset email
            </AppButton>

            <Flex justifyContent={'center'} mt={5}>
              <AppLink to={'/login'} fontWeight={500}>
                Return to Login
              </AppLink>
            </Flex>
          </Box>
        </Card>
      </Flex>
      <Footer />
    </Box>
  );
};

export default RestPasswordPage;
