import { Menu, MenuButton, Flex, MenuItem, MenuList } from '@chakra-ui/react';
import { AppSwitch } from 'src/components';
import {
  getActionWebhook,
  IAddressWebhook,
  IContractWebhook,
  INFTWebhook,
  WEBHOOK_STATUS,
} from 'src/utils/utils-webhook';
import React, { FC, useState } from 'react';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import ModalDeleteWebhook from 'src/modals/ModalDeleteWebhook';

interface IListActionWebhook {
  webhook: INFTWebhook | IContractWebhook | IAddressWebhook;
  reloadData: () => void;
}

const ListActionWebhook: FC<IListActionWebhook> = ({ webhook, reloadData }) => {
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);
  const onChangeStatus = async () => {
    const newStatus =
      webhook.status === WEBHOOK_STATUS.ENABLE
        ? WEBHOOK_STATUS.DISABLED
        : WEBHOOK_STATUS.ENABLE;
    try {
      await rf
        .getRequest('RegistrationRequest')
        .updateStatus(webhook.appId, webhook.registrationId, {
          status: newStatus,
        });
      toastSuccess({ message: 'Update Successfully!' });
      reloadData();
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  return (
    <>
      <Menu>
        <MenuButton ml={4} bg={'#EEF3F5'} px={4} py={2} borderRadius={'5px'}>
          •••
        </MenuButton>
        <MenuList
          fontWeight={600}
          fontSize={'16px'}
          color={'black'}
          maxW="200px"
        >
          <MenuItem>
            <AppSwitch
              mr={2}
              isChecked={webhook.status === WEBHOOK_STATUS.ENABLE}
              onChange={onChangeStatus}
            />
            {getActionWebhook(webhook.status)}
          </MenuItem>
          <MenuItem color={'red'} onClick={() => setIsOpenModalDelete(true)}>
            Delete
          </MenuItem>
        </MenuList>
      </Menu>

      <ModalDeleteWebhook
        onClose={() => setIsOpenModalDelete(false)}
        open={isOpenModalDelete}
        webhook={webhook}
        reloadData={reloadData}
      />
    </>
  );
};

export default ListActionWebhook;
