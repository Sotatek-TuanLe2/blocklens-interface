import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { AppField, AppInput } from 'src/components';
import React, { FC, useEffect, useState } from 'react';
import { IDataForm } from '../index';
import { ListSelectEvent } from './PartFormTokenActivityAptos';

interface IPartFormCoinActivityAptos {
  dataForm: IDataForm;
  setDataForm: (value: any) => void;
  validator: any;
}

export const COIN_EVENTS = [
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
  const [eventsSelected, setEventsSelected] = useState<string[]>(
    COIN_EVENTS.map((item) => item.name),
  );

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
            rule: 'required|isCoinType',
          }}
        />
      </AppField>
      <Box w={'full'}>
        <Tooltip
          hasArrow
          placement="top"
          label="Choosing which activities you want to be notified"
        >
          Notification filter&nbsp;
        </Tooltip>
        <Box as={'span'} color={'red.500'}>
          *
        </Box>
        <Box mt={1}>
          <ListSelectEvent
            dataEvent={COIN_EVENTS}
            eventsSelected={eventsSelected}
            setEventsSelected={setEventsSelected}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default PartFormCoinActivityAptos;
