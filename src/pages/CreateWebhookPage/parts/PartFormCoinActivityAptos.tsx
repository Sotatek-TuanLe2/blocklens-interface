import { Box, Checkbox, Flex } from '@chakra-ui/react';
import { AppField, AppInput, TYPE_ABI } from 'src/components';
import React, { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { IDataForm } from '../index';
import { ListSelectEvent } from './PartFormTokenActivityAptos';

interface IPartFormCoinActivityAptos {
  dataForm: IDataForm;
  setDataForm: (value: IDataForm) => void;
  validator: any;
}

interface IListSelectEvent {
  eventsSelected: string[];
  setEventsSelected: (value: string[]) => void;
  viewOnly?: boolean;
}

const dataEvent = [
  {
    name: '0x1::coin::DepositEvent',
  },
  {
    name: '0x1::coin::WithdrawEvent',
  },
];

const PartFormCoinActivityAptos: FC<IPartFormCoinActivityAptos> = ({
  dataForm,
  setDataForm,
  validator,
}) => {
  const [eventsSelected, setEventsSelected] = useState<string[]>([]);

  useEffect(() => {
    setDataForm({
      ...dataForm,
      metadata: {
        ...dataForm.metadata,
        events: eventsSelected,
      },
    });
  }, [eventsSelected]);
  return (
    <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
      <AppField label={'Coin Type'} customWidth={'100%'} isRequired>
        <AppInput
          size="lg"
          value={dataForm.metadata?.coinType}
          onChange={(e) => {
            setDataForm({
              ...dataForm,
              metadata: {
                ...dataForm.metadata,
                coinType: e.target.value.trim(),
              },
            });
          }}
          validate={{
            name: `coinType`,
            validator: validator.current,
            rule: 'required',
          }}
        />
      </AppField>
      <Box>
        Events{' '}
        <Box as={'span'} color={'red.500'}>
          *
        </Box>
        <Box mt={5}>
          <ListSelectEvent
            eventsSelected={eventsSelected}
            setEventsSelected={setEventsSelected}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default PartFormCoinActivityAptos;
