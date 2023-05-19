import { Box, Collapse, Flex, Text } from '@chakra-ui/react';
import _, { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import {
  CloseBtnV2Icon,
  ExploreActiveV2Icon,
  ExploreV2Icon,
  FolderActiveV2Icon,
  FolderV2Icon,
  LogoDashboardV2Icon,
  LogoQueryV2Icon,
  PlusV2Icon,
} from 'src/assets/icons';
import { AppInput } from 'src/components';
import ModalNewDashboard from 'src/modals/querySQL/ModalNewDashboard';
import rf from 'src/requests/RequestFactory';
import { PROMISE_STATUS, ROUTES, SchemaType } from 'src/utils/common';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { getChainIconByChainName } from 'src/utils/utils-network';
import { toastError } from 'src/utils/utils-notify';

const ChainItem = ({ chain }: { chain: SchemaType }) => {
  const [show, setShow] = useState(false);
  const [schemaDescribe, setSchemaDescribe] = useState<SchemaType[] | null>();

  const handleToggle = async () => {
    setShow((pre) => !pre);
    if (!show) {
      try {
        const data = await rf.getRequest('DashboardsRequest').getSchemaOfTable({
          namespace: chain.namespace,
          tableName: chain.table_name,
        });
        setSchemaDescribe(data);
        //get schema
      } catch (error) {
        console.log('error', error);
      }
    }
  };
  return (
    <>
      <Box display={'flex'} onClick={handleToggle} className="chain-info-title">
        <div className={getChainIconByChainName(chain.namespace)}></div>
        <Text isTruncated maxW={'70%'}>
          {chain.table_name}
        </Text>
      </Box>

      <Collapse in={show} className="chain-info-desc">
        {/* <Box>{chain.namespace}</Box> */}
        {!!schemaDescribe &&
          schemaDescribe.map((item, index) => (
            <Flex
              key={index + 'schema'}
              direction={'row'}
              py="6px"
              pl={'10px'}
              justifyContent={'space-between'}
            >
              <Box isTruncated maxW={'50%'}>
                {item.column_name}
              </Box>
              <Text isTruncated>{item.data_type}</Text>
            </Flex>
          ))}
      </Collapse>
    </>
  );
};

const CollapseExplore = ({
  title,
  content,
}: {
  title: string;
  content: SchemaType[];
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
        <div className={getChainIconByChainName(content[0].namespace)}></div>
        <span>{title.toUpperCase()}</span>
      </Box>

      <Collapse
        animateOpacity
        in={show}
        className="workspace-page__sidebar__content__explore-wrap__content-collapse"
      >
        {content.map((chain: SchemaType, index: number) => {
          return <ChainItem chain={chain} key={index + 'chain'} />;
        })}
      </Collapse>
    </>
  );
};

const Sidebar: React.FC = () => {
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
      icon: <FolderV2Icon />,
      activeIcon: <FolderActiveV2Icon />,
    },
    {
      id: CATEGORIES.EXPLORE_DATA,
      title: 'Explore data',
      icon: <ExploreV2Icon />,
      activeIcon: <ExploreActiveV2Icon />,
    },
  ];

  const [category, setCategory] = useState<string>(CATEGORIES.WORK_PLACE);
  const [searchValue, setSearchValue] = useState<string>('');
  const { queryId, dashboardId }: { queryId?: string; dashboardId?: string } =
    useParams();

  const [dataQueries, setDataQueries] = useState<IQuery[] | []>([]);
  const [dataDashboards, setDataDashboards] = useState<IDashboardDetail[] | []>(
    [],
  );
  const [exploreData, setExploreData] = useState<{
    [key: string]: any;
  } | null>();
  const [toggleSideBarContent, setToogleSideBarContent] = useState(true);
  const history = useHistory();
  const [openNewDashboardModal, setOpenNewDashboardModal] = useState(false);

  const fetchDashboards: any = async (params: any) => {
    try {
      const res: any = await rf
        .getRequest('DashboardsRequest')
        .getListBrowseDashboard(params);
      return { ...res, docs: res.data };
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };
  const fetchQueries: any = async (params: any) => {
    try {
      const res: any = await rf
        .getRequest('DashboardsRequest')
        .getListBrowseQueries(params);
      return { ...res, docs: res.data };
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const fetchData = async (search?: string) => {
    try {
      const data: any = await Promise.allSettled([
        fetchDashboards(_.omitBy({ search }, (param) => !param)),
        fetchQueries(_.omitBy({ search }, (param) => !param)),
      ]);
      setDataDashboards(() => {
        if (data[0].status === PROMISE_STATUS.FULFILLED) {
          return data[0].value.docs;
        }

        return [];
      });
      setDataQueries(() => {
        if (data[1].status === PROMISE_STATUS.FULFILLED) {
          return data[1].value.docs;
        }
        return [];
      });
    } catch (error) {
      toastError({
        message: getErrorMessage(error),
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const tables = await rf.getRequest('DashboardsRequest').getTables();

        const listChain = _.groupBy(
          tables,
          (item) => item.namespace.split('_')[0],
        );

        setExploreData(listChain);
      } catch (error) {
        toastError(getErrorMessage(error));
      }
    })();
  }, []);
  const getDataSearchWorkPlace = useCallback(
    debounce(async (search) => {
      fetchData(search);
    }, 500),
    [],
  );

  const handleCreateNewQuery = () => {
    history.push('/queries');
  };

  const handleCreateNewDashboard = () => {
    setOpenNewDashboardModal(true);
  };

  const handleClassNameWorkPlaceItem = (id: any) => {
    if (id === queryId || id === dashboardId) {
      return 'workspace-page__sidebar__content__work-place-detail work-place-active ';
    }
    return 'workspace-page__sidebar__content__work-place-detail ';
  };

  const _renderContentWorkPlace = () => {
    return (
      <Box className="workspace-page__sidebar__content__work-place-wrap">
        <div className="workspace-page__sidebar__content__work-place-wrap__work-place">
          <span>work place</span>
          <Box
            cursor={'pointer'}
            onClick={() => setToogleSideBarContent((pre) => !pre)}
          >
            <CloseBtnV2Icon />
          </Box>
        </div>
        <AppInput
          value={searchValue}
          marginY={4}
          placeholder={'Search...'}
          size="md"
          onChange={(e) => {
            setSearchValue(e.target.value);
            getDataSearchWorkPlace(e.target.value);
          }}
        />

        <div className="workspace-page__sidebar__content__work-place-wrap__work-place-content">
          <span>Query</span>{' '}
          <div onClick={handleCreateNewQuery}>
            <PlusV2Icon cursor={'pointer'} />
          </div>
        </div>
        {dataQueries.length ? (
          <>
            {dataQueries.map((query) => (
              <div
                key={query.id}
                className={handleClassNameWorkPlaceItem(query.id)}
                onClick={() => history.push(`${ROUTES.QUERY}/${query.id}?`)}
              >
                <div>
                  <LogoQueryV2Icon />
                </div>
                <Text isTruncated>{query.name}</Text>
              </div>
            ))}
          </>
        ) : (
          <div>No data...</div>
        )}
        <Box
          mt="20px"
          className="workspace-page__sidebar__content__work-place-wrap__work-place-content"
        >
          <span>Dashboard</span>{' '}
          <div onClick={handleCreateNewDashboard}>
            <PlusV2Icon cursor={'pointer'} />
          </div>
        </Box>
        {dataDashboards.length ? (
          <>
            {dataDashboards.map((dashboard) => (
              <div
                key={dashboard.id}
                className={handleClassNameWorkPlaceItem(dashboard.id)}
                onClick={() =>
                  history.push(`${ROUTES.DASHBOARD}/${dashboard.id}?`)
                }
              >
                <div>
                  <LogoDashboardV2Icon />
                </div>
                <Text isTruncated>{dashboard.name}</Text>
              </div>
            ))}
          </>
        ) : (
          <div>No data...</div>
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
            onClick={() => setToogleSideBarContent((pre) => !pre)}
          >
            <CloseBtnV2Icon />
          </Box>
        </div>
        {!!exploreData && (
          <>
            {Object.keys(exploreData).map((nameChain: any, index) => (
              <CollapseExplore
                key={index + 'explore'}
                title={nameChain}
                content={Object.values(exploreData)[index]}
              />
            ))}
          </>
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
      <div className="workspace-page__sidebar__categories">
        {categoryList.map((item) => (
          <Box
            cursor={'pointer'}
            key={item.id}
            title={item.title}
            onClick={() => {
              setCategory(item.id);
              setToogleSideBarContent(true);
            }}
          >
            {category === item.id ? item.activeIcon : item.icon}
          </Box>
        ))}
      </div>
      <Box
        // display={toggleSideBarContent ? 'block' : 'none'}
        className={
          toggleSideBarContent
            ? 'workspace-page__sidebar__content show-sidebar'
            : 'workspace-page__sidebar__content hidden-sidebar'
        }
      >
        {_renderContent()}
      </Box>
      <ModalNewDashboard
        open={openNewDashboardModal}
        onClose={async () => {
          setOpenNewDashboardModal(false);
          const dataDashboard: any = await fetchDashboards();
          setDataDashboards(() => [...dataDashboard.docs]);
        }}
      />
    </div>
  );
};

export default Sidebar;
