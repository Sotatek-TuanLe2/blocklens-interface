import {
  Flex,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
} from '@chakra-ui/react';
import { useHistory } from 'react-router';
import {
  BackHeaderIcon,
  IconFork,
  ListDotIcon,
  RunQueryIcon,
  IconShare,
  DeleteIcon,
  SettingHeaderIcon,
} from 'src/assets/icons';
import { AppButton } from 'src/components';

interface IHeaderProps {
  type: string;
  author: string;
  title: string;
  onRunQuery: () => Promise<void>;
}

const ListItem = [
  { label: 'Fork', icon: <IconFork /> },
  { label: 'Setting', icon: <SettingHeaderIcon /> },
  { label: 'Share', icon: <IconShare /> },
  { label: 'Delete', icon: <DeleteIcon /> },
];

const Header: React.FC<IHeaderProps> = (props) => {
  const { type, author, title, onRunQuery } = props;
  const history = useHistory();

  return (
    <div className="workspace-page__editor__header">
      <div className="workspace-page__editor__header__left">
        <AppButton
          onClick={() => history.push('/')}
          size="sm"
          variant="no-effects"
          className="btn-back"
        >
          <BackHeaderIcon />
        </AppButton>
        <div className="item-desc">
          <img src="/images/AvatarDashboardCard.png" alt="avatar" />
          <p className="user-name">Tyler Covington /</p>
          <span>2023 May 10th</span>
        </div>
      </div>
      <div className="workspace-page__editor__header__right">
        <div className="switch-icon">
          <Switch id="email-alerts" size="lg" />
          <FormLabel htmlFor="email-alerts" mb="0" me="20px">
            Publish
          </FormLabel>
        </div>
        <AppButton
          onClick={onRunQuery}
          size="md"
          leftIcon={<RunQueryIcon />}
          me="21px"
        >
          Run
        </AppButton>
        <Menu>
          <MenuButton
            as={AppButton}
            size="sm"
            variant="no-effects"
            className="btn-list"
          >
            <ListDotIcon />
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
      </div>
    </div>
  );
};

export default Header;
