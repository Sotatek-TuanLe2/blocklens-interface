import {
  Box,
  Flex,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppCard, AppDataTable, AppLink } from 'src/components';
import rf from 'src/requests/RequestFactory';
import ModalChangeStatusApp from 'src/modals/ModalChangeStatusApp';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { IListAppResponse } from 'src/utils/common';
import { useHistory } from 'react-router';

interface IListApps {
  searchListApp: any;
  setSearchListApp: (value: any) => void;
}

const getColorBrandStatus = (status?: APP_STATUS) => {
  switch (status) {
    case APP_STATUS.ENABLE:
      return 'green';
    case APP_STATUS.DISABLED:
      return 'red';
    default:
      return 'green';
  }
};

export const _renderStatus = (status?: APP_STATUS) => {
  return (
    <Tag
      size={'sm'}
      borderRadius="full"
      variant="solid"
      colorScheme={getColorBrandStatus(status)}
      px={5}
    >
      {status === APP_STATUS.ENABLE ? 'ACTIVE' : 'INACTIVE'}
    </Tag>
  );
};

const ListApps: React.FC<IListApps> = ({ searchListApp, setSearchListApp }) => {
  const history = useHistory();
  const [totalApps, setTotalApps] = useState<number>(0);
  const [appSelected, setAppSelected] = useState<IAppResponse | null>(null);
  const [totalAppActive, setTotalAppActive] = useState<number | undefined>(0);
  const [openModalChangeStatus, setOpenModalChangeStatus] =
    useState<boolean>(false);

  const fetchDataTable: any = async (param: any) => {
    try {
      const res: IListAppResponse = await rf
        .getRequest('AppRequest')
        .getListApp(param);
      setTotalApps(res?.totalDocs);
      setTotalAppActive(res?.totalAppActive);
      return res;
    } catch (error) {
      return error;
    }
  };

  const _renderHeader = () => {
    return (
      <Thead className="header-list-app">
        <Tr>
          <Th>NAME</Th>
          <Th>NETWORK</Th>
          <Th textAlign={'right'}>Days on Blocklens</Th>
          <Th>Status</Th>
          <Th>ACTIONS</Th>
        </Tr>
      </Thead>
    );
  };

  const _renderBody = (data?: IAppResponse[]) => {
    const _renderActionApp = (app: IAppResponse) => {
      return (
        <Box
          cursor={'pointer'}
          color={app.status === APP_STATUS.DISABLED ? 'green' : 'red'}
          onClick={(e: any) => {
            e.stopPropagation();
            setOpenModalChangeStatus(true);
            setAppSelected(app);
          }}
        >
          {app.status === APP_STATUS.DISABLED ? 'Activate' : 'Deactivate'}
        </Box>
      );
    };

    return (
      <Tbody>
        {data?.map((app: IAppResponse, index: number) => {
          return (
            <Tr
              key={index}
              className="tr-list-app"
              onClick={() => history.push(`/app-detail/${app.appId}`)}
            >
              <Td>
                <AppLink to={`/app-detail/${app.appId}`}>{app.name}</AppLink>
              </Td>
              <Td>{app.chain + ' ' + app.network}</Td>
              <Td textAlign={'right'}>N/A</Td>
              <Td>{_renderStatus(app.status)}</Td>
              <Td>{_renderActionApp(app)}</Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  return (
    <Box className="list-app-hp">
      <Flex className="title-list-app">
        <Text className="text-title">Apps</Text>
        <div>
          <Text as={'span'} mr={5}>
            ACTIVE APPS
          </Text>{' '}
          {totalAppActive} / {totalApps}
        </div>
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

      <ModalChangeStatusApp
        open={openModalChangeStatus}
        onClose={() => setOpenModalChangeStatus(false)}
        appInfo={appSelected}
        reloadData={() => {
          setSearchListApp((pre: any) => {
            return { ...pre };
          });
        }}
      />
    </Box>
  );
};

export default ListApps;
