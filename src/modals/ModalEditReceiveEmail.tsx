import { Flex, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppButton, AppField, AppInput } from 'src/components';
import useUser from 'src/hooks/useUser';
import rf from 'src/requests/RequestFactory';
import { getUserProfile } from 'src/store/user';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from './BaseModal';

interface IModalEditReceiveEmail {
  open: boolean;
  onClose: () => void;
}

const ModalEditReceiveEmail: React.FC<IModalEditReceiveEmail> = ({
  open,
  onClose,
}) => {
  const [email, setEmail] = useState<string>('');
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const dispatch = useDispatch<any>();
  const { user } = useUser();

  const validators = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="text-error">{message}</Text>
      ),
    }),
  );

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
      dispatch(getUserProfile());
      toastSuccess({ message: 'Update successfully' });
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
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
      title="Edit Receive Email"
    >
      <AppField label={'Current Email'} customWidth={'100%'}>
        <AppInput
          value={user?.getBillingEmail()}
          type="text"
          isDisabled={true}
        />
      </AppField>
      <AppField label={'New Email'} customWidth={'100%'} isRequired>
        <AppInput
          value={email}
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          validate={{
            name: `receiveEmail`,
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

export default ModalEditReceiveEmail;
