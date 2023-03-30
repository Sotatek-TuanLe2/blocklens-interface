import { Flex, Link, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ListIcon, SmallSuccessIcon } from 'src/assets/icons';
import { AppButton, AppInput } from 'src/components';
import 'src/styles/components/BaseModal.scss';
import BaseModal from './BaseModal';

interface IModalAddVisualization {
  open: boolean;
  onClose: () => void;
  getNameUser: string;
  setOpenModalFork: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddVisualization: React.FC<IModalAddVisualization> = ({
  open,
  onClose,
  getNameUser,
  setOpenModalFork,
}) => {
  const [add, setAdd] = useState<boolean>(false);
  const [myQuery, setMyQuery] = useState<boolean>(false);

  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      size="lg"
      className="modal-add-visualization"
    >
      <form className="main-modal-dashboard-details">
        <AppInput
          mt={'10px'}
          size="sm"
          placeholder={
            myQuery ? "Search everyone's queries" : 'Search your queries'
          }
        />
        <div className="main-queries">
          <Flex
            justifyContent={'space-between'}
            borderBottom={'1px solid white'}
          >
            {myQuery ? (
              <>
                <Flex alignItems={'center'} columnGap={'10px'} p={'10px'}>
                  <ListIcon />
                  <Link>@cypherpepe / Airdrops and Wallets</Link>
                  <Text fontWeight={'bold'}>Airdrops and Wallets</Text>
                </Flex>
                <Text
                  onClick={() => setAdd(!add)}
                  className={add ? 'btn-added-query' : 'btn-add-query'}
                >
                  {add ? 'Added' : 'Add'}
                </Text>
              </>
            ) : (
              <>
                <Flex alignItems={'center'} columnGap={'10px'} p={'10px'}>
                  <ListIcon />
                  <Link>@{getNameUser} / ether</Link>
                  <Text fontWeight={'bold'}>Query results</Text>
                </Flex>
                <Text
                  onClick={() => setAdd(!add)}
                  className={add ? 'btn-added-query' : 'btn-add-query'}
                >
                  {add ? 'Added' : 'Add'}
                </Text>
              </>
            )}
          </Flex>
        </div>
        <Flex
          flexWrap={'wrap'}
          gap={'10px'}
          mt={10}
          className="group-action-query"
        >
          <AppButton size="sm" bg="#1e1870" color="#fff" onClick={onClose}>
            Done
          </AppButton>
          <AppButton
            size="sm"
            bg="#e1e1f9"
            color="#1e1870"
            variant={'cancel'}
            onClick={() => setOpenModalFork(true)}
          >
            New dashboard
          </AppButton>
          <AppButton
            className={myQuery ? 'btn-added-query' : 'btn-add-query'}
            size="sm"
            variant={'cancel'}
            onClick={() => setMyQuery(!myQuery)}
          >
            Show queries from other users{' '}
            {myQuery ? (
              <Text ps={'4px'}>
                <SmallSuccessIcon />
              </Text>
            ) : (
              ''
            )}
          </AppButton>
        </Flex>
      </form>
    </BaseModal>
  );
};

export default ModalAddVisualization;
