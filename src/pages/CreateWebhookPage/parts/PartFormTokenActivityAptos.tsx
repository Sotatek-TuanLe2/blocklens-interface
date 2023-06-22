import { Box, Checkbox, Flex } from '@chakra-ui/react';
import { AppField, AppInput, TYPE_ABI } from 'src/components';
import React, { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { IDataForm } from '../index';
import { Scrollbars } from 'react-custom-scrollbars';

interface IPartFormTokenActivityAptos {
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
    name: '0x3::token::DepositEvent',
  },
  {
    name: '0x3::token::WithdrawEvent',
  },
  {
    name: '0x3::token::CreateTokenDataEvent',
  },
  {
    name: '0x3::token::MintTokenEvent',
  },
  {
    name: '0x3::token::BurnTokenEvent',
  },
];

export const ListSelectEvent = ({
  viewOnly,
  eventsSelected,
  setEventsSelected,
}: IListSelectEvent) => {
  const onChangeSelect = (e: ChangeEvent<HTMLInputElement>, event: string) => {
    if (!e.target.checked) {
      setEventsSelected(eventsSelected.filter((item) => item !== event));
    } else {
      setEventsSelected([...eventsSelected, event]);
    }
  };

  const onSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setEventsSelected([]);
    } else {
      setEventsSelected(dataEvent.map((item) => item.name));
    }
  };

  const allChecked = useMemo(
    () =>
      dataEvent.every((data: { name: string }) =>
        eventsSelected.some((id: string) => data.name === id),
      ),
    [eventsSelected],
  );

  const isIndeterminate =
    dataEvent.some((data: { name: string }) =>
      eventsSelected.some((id: string) => data.name === id),
    ) && !allChecked;

  return (
    <Flex className="box-events">
      <Box ml={5} width="100%">
        {!!dataEvent.length && (
          <Checkbox
            size="lg"
            isChecked={allChecked}
            isIndeterminate={isIndeterminate}
            onChange={onSelectAll}
            isDisabled={viewOnly}
          >
            All
          </Checkbox>
        )}

        {dataEvent.map((item: any, index: number) => (
          <Box key={index} my={2}>
            <Checkbox
              size="lg"
              isDisabled={viewOnly}
              value={item.name}
              isChecked={eventsSelected.includes(item.name)}
              onChange={(e) => onChangeSelect(e, item.name)}
            >
              <Flex className="abi-option">{item.name}</Flex>
            </Checkbox>
          </Box>
        ))}
      </Box>
    </Flex>
  );
};

const PartFormTokenActivityAptos: FC<IPartFormTokenActivityAptos> = ({
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
      <AppField label={'Collection Name'} customWidth={'49%'} isRequired>
        <AppInput
          size="lg"
          value={dataForm.metadata?.collectionName}
          onChange={(e) => {
            setDataForm({
              ...dataForm,
              metadata: {
                ...dataForm.metadata,
                collectionName: e.target.value.trim(),
              },
            });
          }}
          validate={{
            name: `collectionName`,
            validator: validator.current,
            rule: 'required',
          }}
        />
      </AppField>
      <AppField label={'Creator Address'} customWidth={'49%'} isRequired>
        <AppInput
          size="lg"
          value={dataForm.metadata?.creatorAddress}
          onChange={(e) => {
            setDataForm({
              ...dataForm,
              metadata: {
                ...dataForm.metadata,
                creatorAddress: e.target.value.trim(),
              },
            });
          }}
          validate={{
            name: `creatorAddress`,
            validator: validator.current,
            rule: 'required',
          }}
        />
      </AppField>
      <AppField label={'Name'} customWidth={'100%'} isRequired>
        <AppInput
          size="lg"
          value={dataForm.metadata?.name}
          onChange={(e) => {
            setDataForm({
              ...dataForm,
              metadata: {
                ...dataForm.metadata,
                name: e.target.value.trim(),
              },
            });
          }}
          validate={{
            name: `name`,
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

export default PartFormTokenActivityAptos;
