import { Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { DashboardListIcon, QueriesIcon } from 'src/assets/icons';
import 'src/styles/components/BaseModal.scss';
import { ROUTES } from 'src/utils/common';
import BaseModal from '../BaseModal';
import ModCreateDashboard from './ModCreateDashboard';

interface IModalNewDashboard {
  open: boolean;
  onClose: () => void;
}

const ModalNewDashboard: React.FC<IModalNewDashboard> = ({ open, onClose }) => {
  const history = useHistory();
  const [openNewDashboardModal, setOpenNewDashboardModal] =
    useState<boolean>(false);

  const onToggleCreateDashboardModal = () =>
    setOpenNewDashboardModal((prevState) => !prevState);

  const onCreateDashboard = () => {
    onToggleCreateDashboardModal();
  };

  return (
    <BaseModal isOpen={open} onClose={onClose} size="md">
      <Flex
        flexDirection={'column'}
        rowGap={'2rem'}
        className="main-modal-dashboard-details"
      >
        <div className="title-create-modal">Create New</div>
        <Flex>
          <Flex
            mr={2.5}
            className="content-create-modal"
            onClick={() => onCreateDashboard()}
          >
            <DashboardListIcon />
            <Text className="title-content">Dashboard</Text>
            <Text className="desc-content">
              You can add various content icluding chart, note and image.
            </Text>
          </Flex>
          <div
            className="content-create-modal"
            onClick={() => history.push(ROUTES.QUERY)}
          >
            <QueriesIcon />
            <Text className="title-content">Queries</Text>
            <Text className="desc-content">
              Create your chart and analysis with the no-code query builder or
              native SQL
            </Text>
          </div>
        </Flex>
      </Flex>
      <ModCreateDashboard
        open={openNewDashboardModal}
        onClose={onToggleCreateDashboardModal}
      />
    </BaseModal>
  );
};

export default ModalNewDashboard;
