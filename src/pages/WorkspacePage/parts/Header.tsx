import { FormLabel, Switch, Tooltip } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';
import { AppButton } from 'src/components';
import AppQueryMenu from 'src/components/AppQueryMenu';
import { WORKSPACE_TYPES } from '..';

interface IHeaderProps {
  type: string;
  author: string;
  title: string;
  selectedQuery?: string;
  isEdit?: boolean;
  isPrivate?: boolean;
  onRunQuery?: () => Promise<void>;
  onChangeEditMode?: () => void;
}

const Header: React.FC<IHeaderProps> = (props) => {
  const {
    type,
    author,
    title,
    isEdit = false,
    isPrivate = true,
    selectedQuery,
    onRunQuery,
    onChangeEditMode,
  } = props;
  const history = useHistory();
  const { queryId } = useParams<{ queryId: string }>();

  const isDashboard = type === WORKSPACE_TYPES.DASHBOARD;
  const isCreatingQuery = type === WORKSPACE_TYPES.QUERY && !queryId;

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
            <span>{title}</span>
          </div>
        )}
      </div>
      <div className="workspace-page__editor__header__right">
        {isPrivate && !isCreatingQuery && !isEdit && (
          <div className="switch-icon">
            <Switch id="email-alerts" size="sm" />
            <FormLabel htmlFor="email-alerts" mb="0" me="20px">
              Publish
            </FormLabel>
          </div>
        )}
        {isPrivate &&
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
        {!isCreatingQuery && <AppQueryMenu />}
      </div>
    </div>
  );
};

export default Header;
