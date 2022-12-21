import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from './BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { getInfoUser } from 'src/store/auth';

interface IModalEditBillingEmail {
  open: boolean;
  onClose: () => void;
}

const ModalEditBillingEmail: React.FC<IModalEditBillingEmail> = ({
  open,
  onClose,
}) => {
  const [email, setEmail] = useState<string>('');
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<any>();

  const validators = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="text-error">{message}</Text>
      ),
    }),
  );

  useEffect(() => {
    setEmail(userInfo.billingEmail || '');
  }, [userInfo]);

  const handleOnSubmit = async () => {
    if (!validators.current.allValid()) {
      validators.current.showMessages();
      return forceUpdate();
    }

    try {
      await rf.getRequest('UserRequest').updateBillingEmail({
        billingEmail: email,
      });
      onClose();
      dispatch(getInfoUser());
      toastSuccess({ message: 'Update successfully' });
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
      });
    }
  };

  useEffect(() => {
    const statusSubmitBtn = setTimeout(() => {
      const isDisable = !validators.current.allValid();
      setIsDisableSubmit(isDisable);
    }, 0);
    return () => clearTimeout(statusSubmitBtn);
  }, [email]);

  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      size="md"
      title="Edit Billing Email"
    >
      <AppField label={'Billing Email'} customWidth={'100%'} isRequired>
        <AppInput
          value={email}
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          validate={{
            name: `billingEmail`,
            validator: validators.current,
            rule: 'required|email',
          }}
        />
      </AppField>

      <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={10}>
        <AppButton
          width={'49%'}
          size={'lg'}
          variant={'cancel'}
          onClick={onClose}
        >
          Cancel
        </AppButton>
        <AppButton
          w={'49%'}
          size="lg"
          disabled={isDisableSubmit}
          onClick={handleOnSubmit}
        >
          Save
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalEditBillingEmail;
