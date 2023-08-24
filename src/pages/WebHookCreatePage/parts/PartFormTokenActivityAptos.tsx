import { Box, Checkbox, Flex, Text, Tooltip } from '@chakra-ui/react';
import { AppField, AppInput, AppTextarea } from 'src/components';
import React, { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { IDataForm } from '../index';

interface IPartFormTokenActivityAptos {
  dataForm: IDataForm;
  setDataForm: (value: IDataForm) => void;
  validator: any;
}

interface IDataEvent {
  name: string;
}

interface IListSelectEvent {
  eventsSelected: string[];
  setEventsSelected?: (value: string[]) => void;
  viewOnly?: boolean;
  dataEvent: IDataEvent[];
}

export const TOKEN_EVENTS = [
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
  {
    name: '0x3::token::MutateTokenPropertyMapEvent',
  },
];

export const ListSelectEvent = ({
  viewOnly,
  eventsSelected,
  setEventsSelected,
  dataEvent,
}: IListSelectEvent) => {
  const onChangeSelect = (e: ChangeEvent<HTMLInputElement>, event: string) => {
    if (!setEventsSelected) return;
    if (!e.target.checked) {
      setEventsSelected(eventsSelected.filter((item) => item !== event));
    } else {
      setEventsSelected([...eventsSelected, event]);
    }
  };

  const onSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (!setEventsSelected) return;
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
    <Flex className="box-list-events">
      <Box
        ml={{ sm: 0, md: 5 }}
        className="box-list-events__wrapper"
        width="100%"
      >
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
        {!eventsSelected.length && (
          <Text className="text-error">
            The notification filter field is required
          </Text>
        )}
      </Box>
    </Flex>
  );
};

const PartFormTokenActivityAptos: FC<IPartFormTokenActivityAptos> = ({
  dataForm,
  setDataForm,
  validator,
}) => {
  const [eventsSelected, setEventsSelected] = useState<string[]>(
    TOKEN_EVENTS.map((item) => item.name),
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
    <Flex
      className="token-activity"
      flexWrap={'wrap'}
      justifyContent={'space-between'}
    >
      <AppField label={'Collection Name'} customWidth={'49%'} isRequired>
        <AppInput
          size="lg"
          value={dataForm.metadata?.collectionName}
          onChange={(e) => {
            setDataForm({
              ...dataForm,
              metadata: {
                ...dataForm.metadata,
                collectionName: e.target.value.trimStart(),
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
            rule: 'required|isAddressAptos',
          }}
        />
      </AppField>
      <AppField label={'Token Name'}>
        <AppTextarea
          className="token-name"
          value={dataForm.metadata?.name}
          placeholder="name1,name2,name3"
          autoResize
          onChange={(e) => {
            setDataForm({
              ...dataForm,
              metadata: {
                ...dataForm.metadata,
                name: e.target.value,
              },
            });
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
            dataEvent={TOKEN_EVENTS}
            eventsSelected={eventsSelected}
            setEventsSelected={setEventsSelected}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default PartFormTokenActivityAptos;
