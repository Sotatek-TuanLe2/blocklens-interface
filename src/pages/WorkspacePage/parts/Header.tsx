import {
  Flex,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Tooltip,
} from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';
import { AppButton } from 'src/components';
import { WORKSPACE_TYPES } from '..';

interface IHeaderProps {
  type: string;
  author: string;
  title: string;
  onRunQuery?: () => Promise<void>;
  selectedQuery?: string;
}

const ListItem = [
  { label: 'Fork', icon: <p className="icon-query-fork" /> },
  { label: 'Setting', icon: <p className="icon-query-setting" /> },
  { label: 'Share', icon: <p className="icon-query-share" /> },
  { label: 'Delete', icon: <p className="icon-query-delete" /> },
];

const Header: React.FC<IHeaderProps> = (props) => {
  const { type, author, title, onRunQuery, selectedQuery } = props;
  const history = useHistory();
  const { queryId } = useParams<{ queryId: string }>();

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
        {!isCreatingQuery && (
          <div className="switch-icon">
            <Switch id="email-alerts" size="sm" />
            <FormLabel htmlFor="email-alerts" mb="0" me="20px">
              Publish
            </FormLabel>
          </div>
        )}
        <Tooltip label="Run Query" hasArrow placement="top">
          <AppButton
            onClick={onRunQuery}
            size="sm"
            leftIcon={<p className="icon-run-query" />}
            me="21px"
          >
            {selectedQuery ? 'Run selection' : 'Run'}
          </AppButton>
        </Tooltip>
        {!isCreatingQuery && (
          <Menu>
            <MenuButton
              as={AppButton}
              size="sm"
              variant="no-effects"
              className="btn-list"
            >
              <p className="icon-query-list" />
            </MenuButton>
            <MenuList className="list-item">
              {ListItem.map((i) => (
                <MenuItem key={i.label}>
                  <Flex alignItems={'center'} gap={'8px'}>
                    {i.icon} {i.label}
                  </Flex>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
      </div>
    </div>
  );
};

export default Header;
