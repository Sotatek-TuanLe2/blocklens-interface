import { FC, useEffect, useRef, useState } from 'react';
import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import 'src/styles/pages/ProfilePage.scss';
import { AppLink, AppButton, AppInput } from 'src/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { createValidator } from 'src/utils/utils-validator';
import { getInfoUser } from 'src/store/auth';
import ChangePasswordModal from 'src/modals/ChangePasswordModal';

interface IDataForm {
  firstName?: string;
  lastName?: string;
}

const MyProfile: FC = () => {
  const initDataUpDate = {
    firstName: '',
    lastName: '',
  };

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [dataForm, setDataForm] = useState<IDataForm>(initDataUpDate);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    const data = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
    };
    setDataForm(data);
  }, [userInfo, isEdit]);

  const validator = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="text-error">{message}</Text>
      ),
    }),
  );
  const _renderButtonEdit = () => {
    return (
      <Box onClick={() => setIsEdit(true)} cursor="pointer">
        Edit
      </Box>
    );
  };

  const _renderButtonSave = () => {
    const onSave = async () => {
      if (!validator.current.allValid()) return;
      try {
        await rf.getRequest('UserRequest').editInfoUser(dataForm);
        dispatch(getInfoUser());
        toastSuccess({ message: 'Edit successfully!' });
        setIsEdit(false);
      } catch (e: any) {
        toastError({ message: e?.message || 'Oops. Something went wrong!' });
      }
    };

    return (
      <Flex>
        <Box onClick={onSave} cursor="pointer">
          Save
        </Box>
        <Box onClick={() => setIsEdit(false)} ml={5} cursor="pointer">
          Cancel
        </Box>
      </Flex>
    );
  };

  return (
    <Box className="my-profile">
      <Box className="title">
        {userInfo.firstName + ' ' + userInfo.lastName}
      </Box>
      <Flex justifyContent={'flex-end'} mt={5} mb={2} mr={8}>
        {isEdit ? _renderButtonSave() : _renderButtonEdit()}
      </Flex>
      <Box className="profile-detail">
        <Flex className="info-item" borderBottom="1px solid #CACED4">
          <Flex alignItems={'center'}>
            <Box className="info-title">Email</Box>
            <Box>{userInfo.email}</Box>
          </Flex>
        </Flex>
        <Flex className="info-item">
          <Flex alignItems={'center'}>
            <Box className="info-title">First Name</Box>
            <Box>
              {isEdit ? (
                <AppInput
                  className="input-field"
                  size={'sm'}
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
              ) : (
                <Box>{userInfo.firstName}</Box>
              )}
            </Box>
          </Flex>
        </Flex>
        <Flex className="info-item">
          <Flex alignItems={'center'}>
            <Box className="info-title">Last Name</Box>
            <Box>
              {isEdit ? (
                <AppInput
                  className="input-field"
                  size={'sm'}
                  value={dataForm.lastName}
                  onChange={(e) =>
                    setDataForm({
                      ...dataForm,
                      lastName: e.target.value,
                    })
                  }
                  validate={{
                    name: `firstName`,
                    validator: validator.current,
                    rule: ['required'],
                  }}
                />
              ) : (
                <Box>{userInfo.lastName}</Box>
              )}
            </Box>
          </Flex>
        </Flex>
      </Box>

      <AppLink
        to={'#'}
        className="link-change-password"
        onClick={() => setIsOpenModal(true)}
      >
        Change password
      </AppLink>

      {isOpenModal && (
        <ChangePasswordModal
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
        />
      )}
    </Box>
  );
};

export default MyProfile;
