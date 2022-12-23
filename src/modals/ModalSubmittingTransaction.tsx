import { Box } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { toggleSubmittingTransactionModal } from 'src/store/transaction';
import BaseModal from './BaseModal';

const ModalSubmittingTransaction = () => {
  const { openSubmittingTransactionModal } = useSelector(
    (state: RootState) => state.transaction,
  );
  const dispatch = useDispatch();

  return (
    <BaseModal
      size="xl"
      title="Submitting Transaction"
      isOpen={openSubmittingTransactionModal}
      onClose={() => dispatch(toggleSubmittingTransactionModal(false))}
    >
      <Box textAlign={'center'}>
        Transaction is being submitted.
        <br />
        It would take a minute, so take your time with coffee.
      </Box>
    </BaseModal>
  );
};

export default ModalSubmittingTransaction;
