import { useMemo } from 'react';
import { Tooltip, Spinner } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';
import { AppButton, AppTag } from 'src/components';
import AppQueryMenu, { QUERY_MENU_LIST } from 'src/components/AppQueryMenu';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import { ROUTES } from 'src/utils/common';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { BROADCAST_FETCH_DASHBOARD } from './Dashboard';
import { BROADCAST_FETCH_QUERY } from './Query';
import { BROADCAST_FETCH_WORKPLACE_DATA } from './Sidebar';
import rf from 'src/requests/RequestFactory';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import { Dashboard } from 'src/utils/utils-dashboard';
import { Query } from 'src/utils/utils-query';
import { BackIcon } from 'src/assets/icons';
import AppNetworkIcons from 'src/components/AppNetworkIcons';

interface IHeaderProps {
  type: string;
  author: string;
  selectedQuery?: string;
  isEdit?: boolean;
  needAuthentication?: boolean;
  isLoadingRun?: boolean;
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
    onRunQuery,
    onChangeEditMode,
  } = props;
  const history = useHistory();
  const { queryId, dashboardId } = useParams<{
    queryId: string;
    dashboardId: string;
  }>();

  const isDashboard = type === LIST_ITEM_TYPE.DASHBOARDS;
  const isCreatingQuery = type === LIST_ITEM_TYPE.QUERIES && !queryId;

  const dataClass = useMemo(() => {
    if (!data) {
      return null;
    }
    return isDashboard
      ? new Dashboard(data as IDashboardDetail)
      : new Query(data as IQuery);
  }, [data]);

  const onForkSuccess = async (response: any, type: string) => {
    AppBroadcast.dispatch(BROADCAST_FETCH_WORKPLACE_DATA);
    type === LIST_ITEM_TYPE.DASHBOARDS
      ? AppBroadcast.dispatch(BROADCAST_FETCH_DASHBOARD, response.id)
      : AppBroadcast.dispatch(BROADCAST_FETCH_QUERY, response.id);
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
      AppBroadcast.dispatch(BROADCAST_FETCH_WORKPLACE_DATA);
      AppBroadcast.dispatch(BROADCAST_FETCH_DASHBOARD, res.id);
    } else {
      AppBroadcast.dispatch(BROADCAST_FETCH_WORKPLACE_DATA);
      AppBroadcast.dispatch(BROADCAST_FETCH_QUERY, res.id);
    }
  };

  const onChangeStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    if (
      isDashboard &&
      isChecked &&
      !(dataClass as Dashboard)?.getDashboardVisuals().length
    ) {
      toastError({
        message:
          'Dashboard must contain at least a visualization to be published!',
      });
      return;
    }

    try {
      const res = isDashboard
        ? await rf
            .getRequest('DashboardsRequest')
            .updateDashboardItem({ isPrivate: !isChecked }, dashboardId)
        : await rf
            .getRequest('DashboardsRequest')
            .updateQuery({ isPrivate: !isChecked }, queryId);
      isDashboard
        ? AppBroadcast.dispatch(BROADCAST_FETCH_DASHBOARD, res.id)
        : AppBroadcast.dispatch(BROADCAST_FETCH_QUERY, res.id);
    } catch (error) {
      toastError({
        message: getErrorMessage(error),
      });
    }
  };

  const _renderButtons = () => {
    if (!needAuthentication) {
      return null;
    }

    if (!isDashboard) {
      // Query button
      return (
        <Tooltip label="Run Query" hasArrow placement="top">
          <AppButton
            className="btn-primary"
            onClick={onRunQuery}
            size="sm"
            leftIcon={<span className="icon-run-query " />}
            me="10px"
            disabled={isLoadingRun}
            fontSize={'14px'}
          >
            {isLoadingRun ? (
              <Spinner size="sm" />
            ) : (
              `Run${selectedQuery ? ' selection' : ''}`
            )}
          </AppButton>
        </Tooltip>
      );
    }

    const isEmptyDashboard =
      !(dataClass as Dashboard)?.getDashboardVisuals().length &&
      !(dataClass as Dashboard)?.getTextWidgets().length;

    // Dashboard button
    return (
      !isEmptyDashboard && (
        <Tooltip
          label={isEdit ? 'Edit Dashboard' : ''}
          hasArrow
          placement="top"
        >
          <AppButton
            onClick={onChangeEditMode}
            size="sm"
            leftIcon={
              <p
                className={
                  isEdit
                    ? 'bg-icon_success_dashboard'
                    : 'bg-icon_edit_dashboard'
                }
              />
            }
            me="10px"
          >
            {isEdit ? 'Done' : 'Edit'}
          </AppButton>
        </Tooltip>
      )
    );
  };

  return (
    <div className="workspace-page__editor__header">
      <div className="workspace-page__editor__header__left">
        <Tooltip label="Back" hasArrow placement="top">
          <AppButton
            onClick={() => history.push('/')}
            size="sm"
            variant="no-effects"
          >
            <BackIcon />
          </AppButton>
        </Tooltip>
        {!isCreatingQuery && (
          <div className="item-desc">
            <img src="/images/AvatarDashboardCard.png" alt="avatar" />
            <p className="user-name">{author} /</p>
            <span>{dataClass?.getName()}</span>
          </div>
        )}
      </div>
      <div className="workspace-page__editor__header__right">
        {/* {needAuthentication && !isCreatingQuery && !isEdit && (
          <div className="switch-icon">
            <Switch
              id="email-alerts"
              size="sm"
              isChecked={!dataClass?.isPrivate()}
              onChange={onChangeStatus}
            />
            <FormLabel htmlFor="email-alerts" mb="0" me="20px">
              Publish
            </FormLabel>
          </div>
        )} */}
        <div className="header-tab__info tag">
          {['defi', 'gas', 'dex'].map((item) => (
            <AppTag key={item} value={item} />
          ))}
        </div>
        {dataClass?.getChains() && (
          <AppNetworkIcons networkIds={dataClass?.getChains()} />
        )}
        {_renderButtons()}
        {!isCreatingQuery && data && (
          <AppQueryMenu
            menu={
              !needAuthentication
                ? type === LIST_ITEM_TYPE.DASHBOARDS
                  ? [QUERY_MENU_LIST.SHARE]
                  : [QUERY_MENU_LIST.FORK, QUERY_MENU_LIST.SHARE]
                : undefined
            }
            item={data}
            itemType={type}
            onForkSuccess={onForkSuccess}
            onDeleteSuccess={onDeleteSuccess}
            onSettingSuccess={onSettingSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
