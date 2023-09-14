import { useEffect, useMemo, useState } from 'react';
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
import { useParams, Link } from 'react-router-dom';
import { AppButton, AppTag } from 'src/components';
import AppQueryMenu, { QUERY_MENU_LIST } from 'src/components/AppQueryMenu';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import { ROUTES, generateAvatarFromId } from 'src/utils/common';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { BROADCAST_FETCH_DASHBOARD } from './Dashboard';
import { BROADCAST_FETCH_QUERY } from './Query';
import Sidebar, { BROADCAST_FETCH_WORKPLACE_DATA } from './Sidebar';
import { Dashboard } from 'src/utils/utils-dashboard';
import { Query } from 'src/utils/utils-query';
import { IconDotMore, IconFilter, IconRun } from 'src/assets/icons';
import Jazzicon from 'react-jazzicon';
import useOriginPath from 'src/hooks/useOriginPath';
import rf from 'src/requests/RequestFactory';
import useUser from 'src/hooks/useUser';

interface IHeaderProps {
  type: string;
  author: string;
  selectedQuery?: string;
  isEdit?: boolean;
  needAuthentication?: boolean;
  isLoadingRun?: boolean;
  isLoadingResult?: boolean;
  isEmptyDashboard?: boolean;
  isTemporaryQuery?: boolean;
  allowCancelExecution?: boolean;
  onRunQuery?: () => Promise<void>;
  onCancelExecution?: () => Promise<void>;
  onSaveQuery?: () => void;
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
    isTemporaryQuery = false,
    allowCancelExecution = false,
    onRunQuery,
    onCancelExecution,
    onSaveQuery,
    onChangeEditMode,
  } = props;

  const [isDataSaved, setIsDataSaved] = useState<boolean>(false);

  const { goToOriginPath } = useOriginPath();
  const { user } = useUser();
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

  useEffect(() => {
    if (!dataClass || !user) {
      return;
    }
    checkSavedStatus(dataClass);
  }, [dataClass]);

  useEffect(() => {
    if (!user) {
      setIsDataSaved(false);
    }
  }, [user]);

  const checkSavedStatus = async (dataClass: Dashboard | Query) => {
    const response = isDashboard
      ? await rf
          .getRequest('DashboardsRequest')
          .filterSavedDashboardsByIds([dataClass.getId()])
      : await rf
          .getRequest('DashboardsRequest')
          .filterSavedQueriesByIds([dataClass.getId()]);
    setIsDataSaved(!!response.length);
  };

  const onBack = () => goToOriginPath();

  const onForkSuccess = async () => {
    AppBroadcast.dispatch(BROADCAST_FETCH_WORKPLACE_DATA);
  };

  const onDeleteSuccess = async (item: IQuery | IDashboardDetail) => {
    if (item.id === queryId || item.id === dashboardId) {
      onBack();
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

  const onSaveSuccess = async () => {
    if (dataClass) {
      checkSavedStatus(dataClass);
    }
  };

  const menuAppQuery = () => {
    if (type === LIST_ITEM_TYPE.DASHBOARDS) {
      return !needAuthentication
        ? [QUERY_MENU_LIST.SAVE, QUERY_MENU_LIST.SHARE]
        : [
            QUERY_MENU_LIST.SAVE,
            QUERY_MENU_LIST.SETTING,
            QUERY_MENU_LIST.SHARE,
            QUERY_MENU_LIST.DELETE,
          ];
    } else {
      return !needAuthentication
        ? [QUERY_MENU_LIST.FORK, QUERY_MENU_LIST.SAVE, QUERY_MENU_LIST.SHARE]
        : [
            QUERY_MENU_LIST.FORK,
            QUERY_MENU_LIST.SAVE,
            QUERY_MENU_LIST.SETTING,
            QUERY_MENU_LIST.SHARE,
            QUERY_MENU_LIST.DELETE,
          ];
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
              onClick={onBack}
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
        <Flex display={{ base: 'none', lg: 'flex' }}>
          {isTemporaryQuery && !isLoadingResult && (
            <AppButton
              className="btn-primary"
              onClick={onSaveQuery}
              size="sm"
              me="10px"
              fontSize={'14px'}
            >
              Save
            </AppButton>
          )}
          {allowCancelExecution && isLoadingResult && (
            <AppButton
              variant="red"
              onClick={onCancelExecution}
              size="sm"
              me="10px"
              fontSize={'14px'}
            >
              Cancel
            </AppButton>
          )}
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
              isDisabled={isLoadingRun || isLoadingResult}
              fontSize={'14px'}
            >
              {isLoadingRun || isLoadingResult ? (
                <Spinner size="sm" />
              ) : (
                `Run${selectedQuery ? ' selection' : ''}`
              )}
            </AppButton>
          </Tooltip>
        </Flex>
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
      !dataClass?.getForkedId() ||
      !dataClass?.getForkedName()
    ) {
      return null;
    }

    return (
      <span className="item-desc__forked">
        {`(Forked from `}
        <Tooltip
          label={dataClass?.getForkedName()}
          hasArrow
          placement="top-start"
          bg="white"
          color="black"
        >
          <div className="link-forked">
            <Link
              to={`${ROUTES.QUERY}/${dataClass?.getForkedId()}?`}
              target="_blank"
            >
              {dataClass?.getForkedName()}
            </Link>
          </div>
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
                onClick={onBack}
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
                    isSaved={isDataSaved}
                    onForkSuccess={onForkSuccess}
                    onDeleteSuccess={onDeleteSuccess}
                    onSettingSuccess={onSettingSuccess}
                    onSaveSuccess={onSaveSuccess}
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
