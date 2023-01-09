import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppButton,
  AppCard,
  AppField,
  AppInput,
  AppLink,
  AppSelect2,
  AppTextarea,
} from 'src/components';
import { COUNTRIES } from 'src/constants';
import { BasePage, BasePageContainer } from 'src/layouts';
import 'src/styles/pages/ContactUs.scss';
import { createValidator } from 'src/utils/utils-validator';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { isMobile } from 'react-device-detect';

interface IDataFormContact {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  country?: string;
  networkOrChain: string;
  telegram?: string;
  feedback?: string;
}

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  company: '',
  networkOrChain: '',
  feedback: '',
};

const listCountry = COUNTRIES.map((item: { name: string }) => {
  return {
    label: item.name,
    value: item.name,
  };
});

const ContactUs = () => {
  const [dataContact, setDataContact] = useState<IDataFormContact>(initialForm);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text className="text-error">{message}</Text>,
    }),
  );

  const handleSubmit = async () => {
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      return forceUpdate();
    }
    try {
      await rf.getRequest('UserRequest').contactToAdmin(dataContact);
      setDataContact({ ...initialForm });
      validator.current.visibleFields = [];
      toastSuccess({ message: 'Send email successfully' });
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
      });
    }
  };

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataContact]);

  return (
    <BasePageContainer className="contact-us">
      <>
        <Flex className={`title-wrap ${isMobile ? 'title-wrap-mobile' : ''}`}>
          <Box className="icon-arrow-wrap">
            <AppLink to={`/billing`}>
              <Box className="icon-arrow-left" mr={6} />
            </AppLink>
          </Box>
          <Box className="title-contact-us">Contact Our Team</Box>
        </Flex>
        <AppCard className={isMobile ? 'contact-form-mobile' : ''}>
          <AppField label="Email" isRequired>
            <AppInput
              value={dataContact.email}
              onChange={(e) => {
                setDataContact({
                  ...dataContact,
                  email: e.target.value,
                });
              }}
              validate={{
                name: `email`,
                validator: validator.current,
                rule: 'required|email|max:100',
              }}
            />
          </AppField>

          <Flex direction={'row'} justifyContent="space-between" wrap={'wrap'}>
            <AppField label="First Name" isRequired customWidth="49%">
              <AppInput
                value={dataContact.firstName}
                onChange={(e) => {
                  setDataContact({
                    ...dataContact,
                    firstName: e.target.value,
                  });
                }}
                validate={{
                  name: `firstName`,
                  validator: validator.current,
                  rule: ['required', 'max:100'],
                }}
              />
            </AppField>

            <AppField label="Last Name" isRequired customWidth="49%">
              <AppInput
                value={dataContact.lastName}
                onChange={(e) => {

                  setDataContact({
                    ...dataContact,
                    lastName: e.target.value,
                  });
                }}
                validate={{
                  name: `lastName`,
                  validator: validator.current,
                  rule: ['required', 'max:100'],
                }}
              />
            </AppField>
          </Flex>

          <Flex direction={'row'} justifyContent="space-between" wrap={'wrap'}>
            <AppField label="Company" customWidth="49%">
              <AppInput
                value={dataContact.company}
                onChange={(e) => {
                  setDataContact({
                    ...dataContact,
                    company: e.target.value,
                  });
                }}
                validate={{
                  name: `company`,
                  validator: validator.current,
                  rule: ['max:100'],
                }}
              />
            </AppField>

            <AppField label="Country" customWidth="49%">
              <AppSelect2
                hiddenLabelDefault
                size="large"
                onChange={(value: string) => {
                  setDataContact({
                    ...dataContact,
                    country: value,
                  });
                }}
                options={listCountry}
                value={dataContact.country || ''}
              />
            </AppField>
          </Flex>

          <Flex direction={'row'} justifyContent="space-between" wrap={'wrap'}>
            <AppField
              label="Network/Chains Of Interest"
              isRequired
              customWidth="49%"
            >
              <AppInput
                value={dataContact.networkOrChain}
                onChange={(e) => {
                  setDataContact({
                    ...dataContact,
                    networkOrChain: e.target.value,
                  });
                }}
                validate={{
                  name: `networkOrChain`,
                  validator: validator.current,
                  rule: ['required', 'max:100'],
                }}
              />
            </AppField>

            <AppField label="Telegram" customWidth="49%">
              <AppInput
                value={dataContact.telegram}
                onChange={(e) => {
                  setDataContact({
                    ...dataContact,
                    telegram: e.target.value,
                  });
                }}
                validate={{
                  name: `telegram`,
                  validator: validator.current,
                  rule: ['max:100'],
                }}
              />
            </AppField>
          </Flex>

          <Flex direction={'column'} marginBottom={isMobile ? '0px' : '26px'}>
            <Box className="labelArea">
              Tell Us More About What You Are Building
            </Box>
            <AppTextarea
              rows={6}
              value={dataContact.feedback}
              onChange={(e) => {
                setDataContact({
                  ...dataContact,
                  feedback: e.target.value,
                });
              }}
              validate={{
                name: `feedback`,
                validator: validator.current,
                rule: ['max:600'],
              }}
            />
          </Flex>

          {!isMobile && (
            <Flex justifyContent={'right'}>
              <AppButton
                size="lg"
                onClick={handleSubmit}
                isDisabled={isDisableSubmit}
                className="btn-submit"
                w={'auto'}
              >
                Submit
              </AppButton>
            </Flex>
          )}
        </AppCard>

        {isMobile && (
          <Flex justifyContent={'right'} pt="50px">
            <AppButton
              size="lg"
              onClick={handleSubmit}
              isDisabled={isDisableSubmit}
              className="btn-submit"
              w={'100%'}
            >
              Submit
            </AppButton>
          </Flex>
        )}
      </>
    </BasePageContainer>
  );
};

export default ContactUs;
