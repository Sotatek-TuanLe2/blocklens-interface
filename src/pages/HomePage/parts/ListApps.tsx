import {
  Flex,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Td,
  Box,
  Badge,
  Divider,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import {
  AppButton,
  AppCard,
  AppDataTable,
  AppField,
  AppInput,
  DataTableRef,
} from 'src/components';
import BaseModal from 'src/modals/BaseModal';
import rf from 'src/requests/RequestFactory';
import { IAppResponse, IListAppResponse } from 'src/utils/common';
import { copyToClipboard } from 'src/utils/utils-helper';

interface IListApps {
  searchListApp: any;
}

const ListApps: React.FC<IListApps> = ({ searchListApp }) => {
  const [isOpenAppModal, setIsOpenAppModal] = useState<boolean>(false);

  const history = useHistory();

  const [dataConnectBlocklens, setDataConnectBlocklens] =
    useState<IAppResponse | null>();

  const fetchDataTable: any = async (param: any) => {
    try {
      const res: IListAppResponse = await rf
        .getRequest('AppRequest')
        .getListApp(param);
      return res;
    } catch (error) {
      return error;
    }
  };

  const handleOnClickViewKey = (value: IAppResponse) => {
    setDataConnectBlocklens(value);
    setIsOpenAppModal(true);
  };

  const _renderHeader = () => {
    return (
      <Thead className="header-list-app">
        <Tr>
          <Th>NAME</Th>
          <Th>NETWORK</Th>
          <Th>DESCRIPTION</Th>
          <Th>CUPS LIMIT</Th>
          <Th>
            CONCURRENT
            <br /> REQUEST LIMIT
          </Th>
          <Th>DAYS ON ALCHEMY</Th>
          <Th>CREATED BY</Th>
          <Th>ACTIONS</Th>
          <Th></Th>
        </Tr>
      </Thead>
    );
  };

  const _renderCellName = (name: string, isDemo?: boolean) => {
    if (isDemo) {
      return (
        <Flex>
          <Text className="name-column">{name}</Text>
          <Badge className="badge-apps">Demo</Badge>
        </Flex>
      );
    } else return <Text className="name-column">{name}</Text>;
  };

  const _renderCellAction = (value: IAppResponse) => {
    if (!value) {
      return <AppButton variant="no-effects">DELETE APP</AppButton>;
    } else
      return (
        <Flex alignItems={'center'}>
          <Text
            className="button-no-effect"
            pr={'16px'}
            onClick={() => handleOnClickViewKey(value)}
          >
            VIEW KEY
          </Text>
          <Text className="button-no-effect gray-dot">SECURITY </Text>
          <Text ml={'4px'} className="icon-shield"></Text>
        </Flex>
      );
  };

  const _renderBody = (data?: IAppResponse[]) => {
    return (
      <Tbody>
        {data?.map((app: IAppResponse, index: number) => {
          return (
            <Tr key={index} className="tr-list-app">
              <Td>{_renderCellName(app.name || '', index % 2 === 0)}</Td>
              <Td>{app.network}</Td>
              <Td>{app.description || ''}</Td>
              <Td>NaN</Td>
              <Td>NaN</Td>
              <Td>NaN</Td>
              <Td>NaN</Td>
              <Td>{_renderCellAction(app)}</Td>
              <Td>
                <AppButton
                  size={'sm'}
                  onClick={() => history.push('/app-detail')}
                >
                  Detail App
                </AppButton>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  const _renderModalConnectBlockLens = () => {
    return (
      <BaseModal
        size="2xl"
        title="Connect to Blocklens"
        isOpen={isOpenAppModal}
        onClose={() => setIsOpenAppModal(false)}
        onActionLeft={() => {
          console.log('Learn More');
        }}
        textActionLeft="LEARN MORE"
        className="modal-blocklens"
      >
        <Box flexDirection={'column'} pt={'20px'}>
          <AppField label={'API KEY'}>
            <AppInput
              isDisabled
              value={dataConnectBlocklens?.key || ''}
              endAdornment={
                <Box
                  onClick={() =>
                    copyToClipboard(dataConnectBlocklens?.key || '')
                  }
                  className="field-info"
                >
                  {' '}
                  <div className="icon-copy_blue" />{' '}
                  <Text className="button-copy">Copy</Text>
                </Box>
              }
            />
          </AppField>
          <AppField label={'HTTPS'}>
            <AppInput
              isDisabled
              endAdornment={
                <Box
                  onClick={() => copyToClipboard('copy')}
                  className="field-info"
                >
                  {' '}
                  <div className="icon-copy_blue" />{' '}
                  <Text className="button-copy">Copy</Text>
                </Box>
              }
            />
          </AppField>
          <AppField label={'WEBSOKECTS'}>
            <AppInput
              isDisabled
              endAdornment={
                <Box
                  onClick={() => copyToClipboard('copy')}
                  className="field-info"
                >
                  {' '}
                  <div className="icon-copy_blue" />{' '}
                  <Text className="button-copy">Copy</Text>
                </Box>
              }
            />
          </AppField>
          <Divider />
        </Box>
      </BaseModal>
    );
  };

  return (
    <Box className="list-app-hp">
      <Flex className="title-list-app">
        <Text className="text-title">Apps</Text>
        <div>APPS CREATED</div>
      </Flex>
      <AppCard className="list-app-table-wrap">
        <AppDataTable
          requestParams={searchListApp}
          fetchData={fetchDataTable}
          renderBody={_renderBody}
          renderHeader={_renderHeader}
          limit={10}
        />
      </AppCard>
      {isOpenAppModal && _renderModalConnectBlockLens()}
    </Box>
  );
};

export default ListApps;
