import { FC, useRef, useState } from 'react';
import React from 'react';
import { Box, Flex, useColorModeValue,Text } from '@chakra-ui/react';
import Card from 'src/components/Card';
import Field from 'src/components/Field';
import AppInput from 'src/components/AppInput';
import AppButton from 'src/components/AppButton';
import AppLink from 'src/components/AppLink';
import Footer from 'src/layouts/Footer';
import { Sotalabs } from 'src/assets/icons';
import { createValidator } from 'src/utils/utils-validator';

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

  const colorText = useColorModeValue('gray.500', 'white');
  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.500'}>{message}</Text>,
    }),
  );

  return (
    <Box>
      <Flex justifyContent={'center'} my={5} >
        <Sotalabs width={"200px"} />
      </Flex>

      <Flex justifyContent={'center'} minH={'calc(100vh - 160px)'} mt={8}>
        <Card width={['100%', '550px']} p={'30px'} mx={['15px', 0]} height={'max-content'}>
          <Box
            textAlign={'center'}
            pb={6}
            fontSize={'24px'}
            borderBottom={"1px solid #E9EDF7"}
            margin={"0 -30px"}
            fontWeight={500}
          >
            Sign up
          </Box>

          <AppButton
            onClick={() => console.log('sdsd')}
            borderRadius={'4px'}
            variant={'outline'}
            size={'lg'}
            width={'full'}
            mt={6}
            mb={3}
          >
            Sign up with Google
          </AppButton>

          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Box borderBottom={"1px solid #E9EDF7"} width={'45%'}/>
            <Box color={colorText}>
              or
            </Box>
            <Box borderBottom={"1px solid #E9EDF7"} width={'45%'}/>
          </Flex>
          <Box mt={4} color={colorText}>
            <Field label={"FIRST NAME"}>
              <AppInput
                fontSize={'16px'}
                placeholder="Gavin"
                value={dataForm.firstName}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    firstName: e.target.value,
                  })
                }
                size="lg"
                validate={{
                  name: `firstName`,
                  validator: validator.current,
                  rule: [
                    'required',
                  ],
                }}
              />
            </Field>
            <Field label={"LAST NAME"}>
              <AppInput
                fontSize={'16px'}
                placeholder="Belson"
                value={dataForm.lastName}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    lastName: e.target.value,
                  })
                }
                size="lg"
                validate={{
                  name: `lastName`,
                  validator: validator.current,
                  rule: [
                    'required',
                  ],
                }}
              />
            </Field>

            <Field label={"EMAIL"}>
              <AppInput
                fontSize={'16px'}
                value={dataForm.email}
                placeholder="gavin@sotatek.com"
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
                  rule: [
                    'required',
                    'email'
                  ],
                }}
              />
            </Field>

            <Field label={"PASSWORD"}>
              <AppInput
                fontSize={'16px'}
                value={dataForm.password}
                type="password"
                placeholder={"••••••••"}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    password: e.target.value,
                  })
                }
                size="lg"
                validate={{
                  name: `password`,
                  validator: validator.current,
                  rule: 'required|min:8',
                }}
              />
            </Field>

            <AppButton
              mt={5}
              onClick={() => console.log(dataForm, "dataForm")}
              borderRadius={'4px'}
              size={'lg'}
              width={'full'}
            >
              Sign up
            </AppButton>

            <Flex justifyContent={'center'} mt={5}>
              <AppLink to={"/login"} fontWeight={500}>
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

export default SignUpPage;
