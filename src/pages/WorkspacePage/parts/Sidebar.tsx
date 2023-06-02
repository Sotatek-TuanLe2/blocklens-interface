import { Box, Collapse, Flex, Text, Tooltip } from '@chakra-ui/react';
import _, { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { AppInput } from 'src/components';
import AppQueryMenu, { QUERY_MENU_LIST } from 'src/components/AppQueryMenu';
import ModalNewDashboard from 'src/modals/querySQL/ModalNewDashboard';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import rf from 'src/requests/RequestFactory';
import { MODAL, PROMISE_STATUS, ROUTES, SchemaType } from 'src/utils/common';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { getErrorMessage } from 'src/utils/utils-helper';
import { getChainIconByChainName } from 'src/utils/utils-network';
import { toastError } from 'src/utils/utils-notify';
import { BROADCAST_FETCH_DASHBOARD, TYPE_MODAL } from './Dashboard';
import { BROADCAST_ADD_TEXT_TO_EDITOR, BROADCAST_FETCH_QUERY } from './Query';

export const BROADCAST_FETCH_WORKPLACE_DATA = 'FETCH_WORKPLACE_DATA';

const ChainItem = ({
  chain,
  onChangeSchemaDescribe,
  schemaDescribe,
}: {
  chain: SchemaType;
  onChangeSchemaDescribe: any;
  schemaDescribe: any;
}) => {
  const handleToggle = async () => {
    try {
      const data = await rf.getRequest('DashboardsRequest').getSchemaOfTable({
        namespace: chain.namespace,
        tableName: chain.table_name,
      });
      onChangeSchemaDescribe(data);
      //get schema
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const handleAddQuery = (tableName: string) => {
    AppBroadcast.dispatch(BROADCAST_ADD_TEXT_TO_EDITOR, tableName);
  };

  return (
    <>
      <Box display={'flex'} onClick={handleToggle} className="chain-info-title">
        <Flex flex={1} maxW={'80%'} gap="10px">
          <div
            className={
              schemaDescribe.length &&
              schemaDescribe[0]?.table_name === chain.table_name
                ? 'bg-chain_active'
                : 'bg-chain_default'
            }
          />
          <Text isTruncated maxW={'70%'}>
            {chain.table_name}
          </Text>
        </Flex>
        <Tooltip
          placement="top"
          hasArrow
          label="Add to query"
          aria-label="A tooltip"
          bg={'#2F3B58'}
          borderRadius="6px"
        >
          <div
            className="bg-PlusIcon add-query-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleAddQuery(chain.full_name);
            }}
          ></div>
        </Tooltip>
      </Box>
    </>
  );
};

const CollapseExplore = ({
  title,
  content,
  onChangeSchemaDescribe,
  schemaDescribe,
}: {
  title: string;
  content: SchemaType[];
  onChangeSchemaDescribe: any;
  schemaDescribe: any;
}) => {
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <>
      <Box
        isTruncated
        className="workspace-page__sidebar__content__explore-wrap__content"
        onClick={handleToggle}
      >
        <Flex alignItems={'center'} gap="10px">
          <div className={getChainIconByChainName(content[0].namespace)}></div>
          <span>{title.toUpperCase()}</span>
        </Flex>
        <div className={show ? 'bg-arrow_icon collapsed' : 'bg-arrow_icon'} />
      </Box>

      <Collapse
        animateOpacity
        in={show}
        className="workspace-page__sidebar__content__explore-wrap__content-collapse"
      >
        {content.map((chain: SchemaType, index: number) => {
          return (
            <ChainItem
              chain={chain}
              key={index + 'chain'}
              onChangeSchemaDescribe={onChangeSchemaDescribe}
              schemaDescribe={schemaDescribe}
            />
          );
        })}
      </Collapse>
    </>
  );
};

const Sidebar: React.FC<{
  expandSidebar: boolean;
  onToggleExpandSidebar: (toggle?: boolean) => void;
}> = ({ expandSidebar, onToggleExpandSidebar }) => {
  const CATEGORIES = {
    WORK_PLACE: 'WORK_PLACE',
    EXPLORE_DATA: 'EXPLORE_DATA',
  };

  const categoryList: {
    id: string;
    title: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
  }[] = [
    {
      id: CATEGORIES.WORK_PLACE,
      title: 'Work place',
      icon: <div className="bg-FolderIcon" />,
      activeIcon: <div className="bg-work_place_active" />,
    },
    {
      id: CATEGORIES.EXPLORE_DATA,
      title: 'Explore data',
      icon: <div className="bg-ExploreIcon" />,
      activeIcon: <div className="bg-explore_active" />,
    },
  ];

  const [category, setCategory] = useState<string>(CATEGORIES.WORK_PLACE);
  const [searchValueWorkPlace, setSearchValueWorkPlace] = useState<string>('');
  const [searchExploreData, setSearchExploreData] = useState<string>('');
  const { queryId, dashboardId }: { queryId?: string; dashboardId?: string } =
    useParams();
  const history = useHistory();
  const [dataQueries, setDataQueries] = useState<IQuery[] | []>([]);
  const [dataDashboards, setDataDashboards] = useState<IDashboardDetail[] | []>(
    [],
  );
  const [exploreData, setExploreData] = useState<{
    [key: string]: any;
  }>({});
  const [openNewDashboardModal, setOpenNewDashboardModal] =
    useState<boolean>(false);

  const [schemaDescribe, setSchemaDescribe] = useState<SchemaType[]>([]);

  useEffect(() => {
    AppBroadcast.on(BROADCAST_FETCH_WORKPLACE_DATA, fetchDataWorkPlace);

    return () => {
      AppBroadcast.remove(BROADCAST_FETCH_WORKPLACE_DATA);
    };
  }, []);

  const fetchDashboards: any = async (params: any) => {
    try {
      const res: any = await rf
        .getRequest('DashboardsRequest')
        .getMyListDashboards(params);
      return { ...res, docs: res.data };
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const fetchQueries = async (params = {}) => {
    try {
      const res: any = await rf
        .getRequest('DashboardsRequest')
        .getMyListQueries(params);
      return { ...res, docs: res.data };
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const fetchDataWorkPlace = async (search?: string) => {
    try {
      const data: any = await Promise.allSettled([
        fetchDashboards(_.omitBy({ search }, (param) => !param)),
        fetchQueries(_.omitBy({ search }, (param) => !param)),
      ]);
      setDataDashboards(() => {
        return data[0].status === PROMISE_STATUS.FULFILLED
          ? data[0].value.docs
          : [];
      });
      setDataQueries(() => {
        return data[1].status === PROMISE_STATUS.FULFILLED
          ? data[1].value.docs
          : [];
      });
    } catch (error) {
      toastError({
        message: getErrorMessage(error),
      });
    }
  };

  const onCreateDashboardSuccessfully = async () => {
    setSearchValueWorkPlace(''); // reset search value in order to see the newly created dashboard
    const dataDashboard = await fetchDashboards();
    setDataDashboards(() => [...dataDashboard.docs]);
  };

  const fetchDataExploreData = async (search?: string) => {
    try {
      const tables = await rf
        .getRequest('DashboardsRequest')
        .getTables(_.omitBy({ search }, (param) => !param));

      const listChain = _.groupBy(
        tables,
        (item) => item.namespace.split('_')[0],
      );
      setExploreData(listChain);
    } catch (error) {
      toastError(getErrorMessage(error));
    }
  };

  useEffect(() => {
    fetchDataWorkPlace();
    fetchDataExploreData();
  }, []);

  const getDataSearchWorkPlace = useCallback(
    debounce(async (search) => {
      fetchDataWorkPlace(search.trim());
    }, 500),
    [],
  );

  const getDataSearchExploreData = useCallback(
    debounce(async (search) => {
      fetchDataExploreData(search.trim());
    }, 500),
    [],
  );

  const handleCreateNewQuery = () => {
    history.push(ROUTES.MY_QUERY);
  };

  const handleCreateNewDashboard = () => {
    setOpenNewDashboardModal(true);
  };

  const handleClassNameWorkPlaceItem = (id: any) => {
    return id === queryId || id === dashboardId
      ? 'workspace-page__sidebar__content__work-place-detail work-place-active '
      : 'workspace-page__sidebar__content__work-place-detail ';
  };

  const handleAddQuery = (tableName: string) => {
    AppBroadcast.dispatch(BROADCAST_ADD_TEXT_TO_EDITOR, tableName);
  };

  const onForkSuccess = async (response: any, type: string) => {
    await fetchDataWorkPlace();
    type === LIST_ITEM_TYPE.DASHBOARDS
      ? AppBroadcast.dispatch(BROADCAST_FETCH_DASHBOARD, response.id)
      : AppBroadcast.dispatch(BROADCAST_FETCH_QUERY, response.id);
  };

  const _renderContentWorkPlace = () => {
    return (
      <Box className="workspace-page__sidebar__content__work-place-wrap">
        <div className="workspace-page__sidebar__content__work-place-wrap__work-place">
          <span>work place</span>
          <Box
            cursor={'pointer'}
            onClick={() => onToggleExpandSidebar()}
            className={'bg-CloseBtnIcon'}
          ></Box>
        </div>
        <Box px={'16px'}>
          <AppInput
            value={searchValueWorkPlace}
            marginY={4}
            placeholder={'Search...'}
            size="md"
            onChange={(e) => {
              setSearchValueWorkPlace(e.target.value);
              getDataSearchWorkPlace(e.target.value);
            }}
          />
        </Box>

        <div className="workspace-page__sidebar__content__work-place-wrap__work-place-content">
          <span>Query</span>{' '}
          <div onClick={handleCreateNewQuery}>
            <Box cursor={'pointer'} className="bg-PlusIcon" />
          </div>
        </div>
        {dataQueries.length ? (
          <div className="workspace-page__sidebar__content__work-place-wrap__list-query">
            {dataQueries.map((query) => (
              <div
                key={query.id}
                className={handleClassNameWorkPlaceItem(query.id)}
                onClick={() => history.push(`${ROUTES.MY_QUERY}/${query.id}?`)}
              >
                <Flex isTruncated alignItems={'center'} gap="10px" maxW={'70%'}>
                  <div>
                    <div
                      className={
                        query.id === queryId
                          ? 'bg-query_active'
                          : 'bg-LogoQueryIcon'
                      }
                    />
                  </div>
                  <Text isTruncated>{query.name}</Text>
                </Flex>

                <AppQueryMenu
                  menu={[QUERY_MENU_LIST.FORK, QUERY_MENU_LIST.SHARE]}
                  itemType={LIST_ITEM_TYPE.QUERIES}
                  item={query}
                  onForkSuccess={onForkSuccess}
                />
              </div>
            ))}
          </div>
        ) : (
          <Box pl="16px">No data...</Box>
        )}
        <Box
          mt="20px"
          className="workspace-page__sidebar__content__work-place-wrap__work-place-content"
        >
          <span>Dashboard</span>{' '}
          <div onClick={handleCreateNewDashboard}>
            <Box cursor={'pointer'} className="bg-PlusIcon" />
          </div>
        </Box>
        {dataDashboards.length ? (
          <div className="workspace-page__sidebar__content__work-place-wrap__list-dashboard">
            {dataDashboards.map((dashboard) => (
              <div
                key={dashboard.id}
                className={handleClassNameWorkPlaceItem(dashboard.id)}
                onClick={() =>
                  history.push(`${ROUTES.MY_DASHBOARD}/${dashboard.id}?`)
                }
              >
                <Flex isTruncated alignItems={'center'} gap="10px">
                  <div>
                    <div
                      className={
                        dashboard.id === dashboardId
                          ? 'bg-dashboard_active'
                          : 'bg-LogoDashboardIcon'
                      }
                    />
                  </div>
                  <Text isTruncated>{dashboard.name}</Text>
                </Flex>
                <AppQueryMenu
                  menu={[QUERY_MENU_LIST.FORK, QUERY_MENU_LIST.SHARE]}
                  itemType={LIST_ITEM_TYPE.DASHBOARDS}
                  item={dashboard}
                  onForkSuccess={onForkSuccess}
                />
              </div>
            ))}
          </div>
        ) : (
          <Box pl="16px">No data...</Box>
        )}
      </Box>
    );
  };

  const _renderContentExplore = () => {
    return (
      <div className="workspace-page__sidebar__content__explore-wrap">
        <div className="workspace-page__sidebar__content__explore-wrap__title">
          <span>Explore data</span>
          <Box
            cursor={'pointer'}
            onClick={() => onToggleExpandSidebar()}
            className="bg-CloseBtnIcon"
          />
        </div>
        <Box px={'16px'} mb={'30px'}>
          <AppInput
            value={searchExploreData}
            marginY={4}
            placeholder={'Search...'}
            size="md"
            onChange={(e) => {
              setSearchExploreData(e.target.value);
              getDataSearchExploreData(e.target.value);
            }}
          />
        </Box>
        {!!Object.keys(exploreData).length ? (
          <div className="workspace-page__sidebar__content__explore-wrap__list-chain">
            {Object.keys(exploreData).map((nameChain: any, index) => (
              <CollapseExplore
                key={index + 'explore'}
                title={nameChain}
                content={Object.values(exploreData)[index]}
                onChangeSchemaDescribe={setSchemaDescribe}
                schemaDescribe={schemaDescribe}
              />
            ))}
          </div>
        ) : (
          <Box pl="16px">No data...</Box>
        )}

        {!!schemaDescribe.length && (
          <Box className="chain-info-desc">
            <div className="chain-info-desc__header">
              <Text isTruncated maxW={'70%'}>
                {schemaDescribe[0].table_name}
              </Text>
              <div className="header-icon">
                <div
                  className="bg-PlusIcon"
                  onClick={() => handleAddQuery(schemaDescribe[0].full_name)}
                />
                <div
                  className="bg-CloseBtnIcon"
                  onClick={() => setSchemaDescribe([])}
                />
              </div>
            </div>
            <div className="chain-info-desc__content">
              {schemaDescribe.map((item, index) => (
                <Flex
                  key={index + 'schema'}
                  direction={'row'}
                  py="6px"
                  justifyContent={'space-between'}
                  px="16px"
                  cursor={'pointer'}
                  onClick={() => handleAddQuery(item.column_name)}
                >
                  <Box isTruncated maxW={'50%'}>
                    {item.column_name}
                  </Box>
                  <Text isTruncated>{item.data_type}</Text>
                </Flex>
              ))}
            </div>
          </Box>
        )}
      </div>
    );
  };

  const _renderContent = () => {
    switch (category) {
      case CATEGORIES.WORK_PLACE:
        return _renderContentWorkPlace();
      case CATEGORIES.EXPLORE_DATA:
        return _renderContentExplore();
    }
  };

  return (
    <div className={'workspace-page__sidebar'}>
      <div
        className={
          expandSidebar
            ? 'workspace-page__sidebar__categories'
            : 'workspace-page__sidebar__categories hidden-sidebar-content'
        }
      >
        {categoryList.map((item) => (
          <Box
            cursor={'pointer'}
            key={item.id}
            title={item.title}
            onClick={() => {
              setCategory(item.id);
              onToggleExpandSidebar(true);
              setSchemaDescribe([]);
            }}
          >
            {category === item.id ? item.activeIcon : item.icon}
          </Box>
        ))}
      </div>
      <Box
        className={
          expandSidebar
            ? 'workspace-page__sidebar__content show-sidebar'
            : 'workspace-page__sidebar__content hidden-sidebar'
        }
      >
        {_renderContent()}
      </Box>
      <ModalNewDashboard
        type={MODAL.CREATE}
        open={openNewDashboardModal}
        onClose={() => setOpenNewDashboardModal(false)}
        onSuccess={onCreateDashboardSuccessfully}
      />
    </div>
  );
};

export default Sidebar;
