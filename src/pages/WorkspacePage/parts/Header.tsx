import { FormLabel, Switch, Tooltip } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';
import { AppButton } from 'src/components';
import AppQueryMenu from 'src/components/AppQueryMenu';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import { ROUTES } from 'src/utils/common';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { BROADCAST_FETCH_DASHBOARD } from './Dashboard';
import { BROADCAST_FETCH_QUERY } from './Query';
import { BROADCAST_FETCH_WORKPLACE_DATA } from './Sidebar';

interface IHeaderProps {
  type: string;
  author: string;
  selectedQuery?: string;
  isEdit?: boolean;
  needAuthentication?: boolean;
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

  const onForkSuccess = async (response: any, type: string) => {
    history.push(
      `${
        type === LIST_ITEM_TYPE.DASHBOARDS
          ? ROUTES.MY_DASHBOARD
          : ROUTES.MY_QUERY
      }/${response.id}`,
    );
    AppBroadcast.dispatch(BROADCAST_FETCH_WORKPLACE_DATA);
  };

  const onDeleteSuccess = async (item: IQuery | IDashboardDetail) => {
    if (item.id === queryId || item.id === dashboardId) {
      history.push(ROUTES.HOME);
    } else {
      AppBroadcast.dispatch(BROADCAST_FETCH_WORKPLACE_DATA);
    }
  };

  const onSettingSuccess = async () => {
    if (type === LIST_ITEM_TYPE.DASHBOARDS) {
      AppBroadcast.dispatch(BROADCAST_FETCH_WORKPLACE_DATA);
      AppBroadcast.dispatch(BROADCAST_FETCH_DASHBOARD);
    } else {
      AppBroadcast.dispatch(BROADCAST_FETCH_WORKPLACE_DATA);
      AppBroadcast.dispatch(BROADCAST_FETCH_QUERY);
    }
  };

  return (
    <div className="workspace-page__editor__header">
      <div className="workspace-page__editor__header__left">
        <Tooltip label="Back" hasArrow placement="top">
          <AppButton
            onClick={() => history.push('/')}
            size="sm"
            variant="no-effects"
            className="btn-back icon-query-back-header"
          />
        </Tooltip>
        {!isCreatingQuery && (
          <div className="item-desc">
            <img src="/images/AvatarDashboardCard.png" alt="avatar" />
            <p className="user-name">{author} /</p>
            <span>{data?.name}</span>
          </div>
        )}
      </div>
      <div className="workspace-page__editor__header__right">
        {needAuthentication && !isCreatingQuery && !isEdit && (
          <div className="switch-icon">
            <Switch id="email-alerts" size="sm" />
            <FormLabel htmlFor="email-alerts" mb="0" me="20px">
              Publish
            </FormLabel>
          </div>
        )}
        {needAuthentication &&
          (isDashboard ? (
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
          ) : (
            <Tooltip label="Run Query" hasArrow placement="top">
              <AppButton
                onClick={onRunQuery}
                size="sm"
                leftIcon={<p className="icon-run-query" />}
                me="10px"
              >
                {selectedQuery ? 'Run selection' : 'Run'}
              </AppButton>
            </Tooltip>
          ))}
        {!isCreatingQuery && data && (
          <AppQueryMenu
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
