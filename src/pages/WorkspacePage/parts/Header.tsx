import { useMemo } from 'react';
import {
  Tooltip,
  Spinner,
  Flex,
  SkeletonCircle,
  Skeleton,
  Image,
  Box,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { AppButton, AppTag } from 'src/components';
import AppQueryMenu, { QUERY_MENU_LIST } from 'src/components/AppQueryMenu';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import { generateAvatarFromId, ROUTES } from 'src/utils/common';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { BROADCAST_FETCH_DASHBOARD } from './Dashboard';
import { BROADCAST_FETCH_QUERY } from './Query';
import Sidebar, { BROADCAST_FETCH_WORKPLACE_DATA } from './Sidebar';
import { Dashboard } from 'src/utils/utils-dashboard';
import { Query } from 'src/utils/utils-query';
import { IconDotMore, IconFilter, IconRun } from 'src/assets/icons';
import Jazzicon from 'react-jazzicon';

interface IHeaderProps {
  type: string;
  author: string;
  selectedQuery?: string;
  isEdit?: boolean;
  needAuthentication?: boolean;
  isLoadingRun?: boolean;
  isLoadingResult?: boolean;
  isEmptyDashboard?: boolean;
  onRunQuery?: () => Promise<void>;
  onChangeEditMode?: () => void;
  data: IQuery | IDashboardDetail | null | undefined;
}

const Header: React.FC<IHeaderProps> = (props) => {
  const {
    type,
    author,
    data,
    isEdit = false,
    needAuthentication = true,
    selectedQuery,
    isLoadingRun = false,
    isLoadingResult = false,
    isEmptyDashboard = false,
    onRunQuery,
    onChangeEditMode,
  } = props;
  const history = useHistory();
  const { queryId, dashboardId } = useParams<{
    queryId: string;
    dashboardId: string;
  }>();

  const isDashboard = type === LIST_ITEM_TYPE.DASHBOARDS;
  const isQuery = type === LIST_ITEM_TYPE.QUERIES;
  const isCreatingQuery = type === LIST_ITEM_TYPE.QUERIES && !queryId;

  const dataClass = useMemo(() => {
    if (!data) {
      return null;
    }
    return isDashboard
      ? new Dashboard(data as IDashboardDetail)
      : new Query(data as IQuery);
  }, [data]);

  const onForkSuccess = async () => {
    AppBroadcast.dispatch(BROADCAST_FETCH_WORKPLACE_DATA);
  };

  const onDeleteSuccess = async (item: IQuery | IDashboardDetail) => {
    if (item.id === queryId || item.id === dashboardId) {
      history.push(ROUTES.HOME);
    } else {
      AppBroadcast.dispatch(BROADCAST_FETCH_WORKPLACE_DATA);
    }
  };

  const onSettingSuccess = async (res: any) => {
    if (type === LIST_ITEM_TYPE.DASHBOARDS) {
      AppBroadcast.dispatch(BROADCAST_FETCH_DASHBOARD, res.id);
    } else {
      AppBroadcast.dispatch(BROADCAST_FETCH_WORKPLACE_DATA);
      AppBroadcast.dispatch(BROADCAST_FETCH_QUERY, res.id);
    }
  };

  const menuAppQuery = () => {
    if (type === LIST_ITEM_TYPE.DASHBOARDS) {
      return !needAuthentication
        ? [QUERY_MENU_LIST.SHARE]
        : [
            QUERY_MENU_LIST.DELETE,
            QUERY_MENU_LIST.SETTING,
            QUERY_MENU_LIST.SHARE,
          ];
    } else {
      return !needAuthentication
        ? [QUERY_MENU_LIST.FORK, QUERY_MENU_LIST.SHARE]
        : undefined;
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const _renderNavSidebar = () => {
    return (
      <Box display={{ lg: 'none' }} mt={'-30px'}>
        <Flex align={'center'} justifyContent={'space-between'} py={5}>
          <Tooltip
            label="Back"
            hasArrow
            placement="top"
            bg="white"
            color="black"
          >
            <AppButton
              onClick={() => history.goBack()}
              size="sm"
              w={'38px'}
              h={'38px'}
              variant="no-effects"
              className="icon-back-light"
            />
          </Tooltip>
          {isQuery && (
            <Button
              bg="white !important"
              color={'#C7D2E1'}
              variant="outline"
              w={'38px'}
              h={'38px'}
              px={0}
              onClick={onOpen}
            >
              <IconFilter color={'rgba(0, 2, 36, 0.5)'} />
            </Button>
          )}
        </Flex>
      </Box>
    );
  };

  const _renderDrawerSidebar = () => {
    if (isDashboard) {
      return null;
    }

    return (
      <Box display={{ lg: 'none' }}>
        <Drawer isOpen={isOpen} placement="top" onClose={onClose} size="full">
          <DrawerOverlay />
          <DrawerContent>
            <Sidebar onCloseFilter={onClose} />
          </DrawerContent>
        </Drawer>
      </Box>
    );
  };

  const _renderButtons = () => {
    if (!needAuthentication) {
      return null;
    }

    if (isQuery) {
      // Query button
      return (
        <Box display={{ base: 'none', lg: 'block' }}>
          <Tooltip
            label="Run Query"
            hasArrow
            placement="top"
            bg="white"
            color="black"
          >
            <AppButton
              className="btn-primary"
              onClick={onRunQuery}
              size="sm"
              leftIcon={<span className="icon-run-query " />}
              me="10px"
              disabled={isLoadingRun || isLoadingResult}
              fontSize={'14px'}
            >
              {isLoadingRun || isLoadingResult ? (
                <Spinner size="sm" />
              ) : (
                `Run${selectedQuery ? ' selection' : ''}`
              )}
            </AppButton>
          </Tooltip>
        </Box>
      );
    }

    // Dashboard button
    return (
      !isEmptyDashboard && (
        <Box display={{ base: 'none', lg: 'block' }}>
          <Tooltip
            label={isEdit ? 'Edit Dashboard' : ''}
            hasArrow
            placement="top"
          >
            <AppButton
              onClick={onChangeEditMode}
              size="sm"
              leftIcon={
                isLoadingRun ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <p
                    className={
                      isEdit
                        ? 'bg-icon_success_dashboard'
                        : 'bg-icon_edit_dashboard'
                    }
                  />
                )
              }
              me="10px"
            >
              {isEdit ? 'Done' : 'Edit'}
            </AppButton>
          </Tooltip>
        </Box>
      )
    );
  };

  const _renderButtonsMobile = () => {
    if (!needAuthentication || isDashboard) {
      return null;
    }

    // Query button
    return (
      <Box display={{ lg: 'none' }}>
        <Button
          variant="ghost"
          onClick={onRunQuery}
          disabled={isLoadingRun || isLoadingResult}
          px={0}
          maxW={'24px'}
          minW={'auto'}
          minH={'auto'}
          maxH={'24px'}
        >
          {isLoadingRun || isLoadingResult ? (
            <Spinner size="sm" />
          ) : (
            <IconRun />
          )}
        </Button>
      </Box>
    );
  };

  const _renderForkedQuery = () => {
    if (
      isDashboard ||
      (!dataClass?.getForkedId() && !dataClass?.getForkedName())
    )
      return null;
    return (
      <span className="item-desc__forked">
        {`(Forked from`}{' '}
        <Tooltip
          label={dataClass?.getForkedName()}
          hasArrow
          placement="top"
          bg="white"
          color="black"
        >
          <Link
            style={{ color: '#0060DB' }}
            to={`${ROUTES.QUERY}/${dataClass?.getForkedId()}?`}
            target="_blank"
          >
            {dataClass?.getForkedName()}
          </Link>
        </Tooltip>
        {`)`}
      </span>
    );
  };

  return (
    <>
      {_renderDrawerSidebar()}
      {_renderNavSidebar()}
      <div className="workspace-page__editor__header">
        <Flex align={'center'} justify={'center'} w={'full'}>
          <div className="workspace-page__editor__header__left">
            <Tooltip
              label="Back"
              hasArrow
              placement="top"
              bg="white"
              color="black"
            >
              <AppButton
                onClick={() => history.goBack()}
                size="sm"
                variant="no-effects"
                className="icon-back-light"
              />
            </Tooltip>
            {isLoadingRun ? (
              <Flex align={'center'}>
                <SkeletonCircle w={'26px'} h={'26px'} mr={'8px'} />
                <Skeleton w={'350px'} h={'14px'} rounded={'7px'} />
              </Flex>
            ) : (
              <>
                {!isCreatingQuery && (
                  <div className="item-desc">
                    {dataClass?.getUserAvatar() ? (
                      <Image src={dataClass?.getUserAvatar()} alt="avatar" />
                    ) : (
                      <Jazzicon
                        diameter={26}
                        paperStyles={{ minWidth: '26px' }}
                        seed={generateAvatarFromId(dataClass?.getUserId())}
                      />
                    )}
                    <span className="item-desc__name">
                      <Tooltip label={author} hasArrow placement="top">
                        <span className="user-name">{`${author} / `}</span>
                      </Tooltip>
                      <Tooltip
                        label={dataClass?.getName()}
                        hasArrow
                        placement="top"
                      >
                        <span>{dataClass?.getName()}</span>
                      </Tooltip>
                    </span>
                    {_renderForkedQuery()}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="workspace-page__editor__header__right">
            <Box
              display={{ base: 'none !important', lg: 'flex !important' }}
              className="header-tab__info tag"
            >
              {isLoadingRun ? (
                <Skeleton w={'200px'} h={'14px'} rounded={'7px'} />
              ) : (
                <>
                  {!!dataClass?.getTags()?.length &&
                    dataClass
                      ?.getTags()
                      .map((item, index) => (
                        <AppTag key={index} value={item} />
                      ))}
                </>
              )}
            </Box>
            {_renderButtons()}
            {_renderButtonsMobile()}
            {isLoadingRun ? (
              <Flex align={'center'} ml={'10px'}>
                <IconDotMore color={'rgba(0, 2, 36, 0.5)'} />
              </Flex>
            ) : (
              <Flex ml={'10px'} align={'center'}>
                {!isCreatingQuery && data && (
                  <AppQueryMenu
                    menu={menuAppQuery()}
                    item={data}
                    itemType={type}
                    onForkSuccess={onForkSuccess}
                    onDeleteSuccess={onDeleteSuccess}
                    onSettingSuccess={onSettingSuccess}
                  />
                )}
              </Flex>
            )}
          </div>
        </Flex>
        {!!dataClass?.getTags()?.length && (
          <Box
            display={{ lg: 'none !important' }}
            className="header-tab__info tag"
          >
            {isLoadingRun ? (
              <Skeleton w={'200px'} h={'14px'} rounded={'7px'} />
            ) : (
              <>
                {dataClass?.getTags().map((item, index) => (
                  <AppTag key={index} value={item} />
                ))}
              </>
            )}
          </Box>
        )}
      </div>
    </>
  );
};

export default Header;
