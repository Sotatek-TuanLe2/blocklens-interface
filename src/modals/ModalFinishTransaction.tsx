import { Box } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { toggleFinishTransactionModal } from 'src/store/transaction';
import BaseModal from './BaseModal';

const ModalFinishTransaction = () => {
  const { openFinishTransactionModal } = useSelector(
    (state: RootState) => state.transaction,
  );
  const dispatch = useDispatch();

  return (
    <BaseModal
      size="xl"
      title="Transaction finished"
      isOpen={openFinishTransactionModal}
      onClose={() => dispatch(toggleFinishTransactionModal(false))}
    >
      <Box textAlign={'center'}>
        Your transaction has completed successfully!
        <br />
        Thank you for waiting!
      </Box>
    </BaseModal>
  );
};

export default ModalFinishTransaction;
