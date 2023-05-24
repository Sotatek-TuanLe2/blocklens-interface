import { Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useState } from 'react';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import AppButton from './AppButton';
import 'src/styles/components/AppQueryMenu.scss';

interface IAppQueryMenu {
  menu?: string[];
  itemType?: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  onFork?: () => void;
}

export const QUERY_MENU_LIST = {
  FORK: 'Fork',
  SETTING: 'Setting',
  SHARE: 'Share',
  DELETE: 'Delete',
};

const AppQueryMenu: React.FC<IAppQueryMenu> = (props) => {
  const {
    menu = [
      QUERY_MENU_LIST.FORK,
      QUERY_MENU_LIST.SETTING,
      QUERY_MENU_LIST.SHARE,
      QUERY_MENU_LIST.DELETE,
    ],
    itemType,
    onFork = () => null,
  } = props;

  const [openModalSetting, setOpenModalSetting] = useState<boolean>(false);
  const [openModalShare, setOpenModalShare] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const onToggleModalSetting = () =>
    setOpenModalSetting((prevState) => !prevState);

  const onToggleModalShare = () => setOpenModalShare((prevState) => !prevState);

  const onToggleModalDelete = () =>
    setOpenModalDelete((prevState) => !prevState);

  let itemList: {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => any;
  }[] = [
    {
      id: QUERY_MENU_LIST.FORK,
      label: QUERY_MENU_LIST.FORK,
      icon: <p className="icon-query-fork" />,
      onClick: onFork,
    },
    {
      id: QUERY_MENU_LIST.SETTING,
      label: QUERY_MENU_LIST.SETTING,
      icon: <p className="icon-query-setting" />,
      onClick: onToggleModalSetting,
    },
    {
      id: QUERY_MENU_LIST.SHARE,
      label: QUERY_MENU_LIST.SHARE,
      icon: <p className="icon-query-share" />,
      onClick: onToggleModalShare,
    },
    {
      id: QUERY_MENU_LIST.DELETE,
      label: QUERY_MENU_LIST.DELETE,
      icon: <p className="icon-query-delete" />,
      onClick: onToggleModalDelete,
    },
  ];

  itemList = itemList.filter((item) => menu.includes(item.id));

  return (
    <>
      <Menu>
        <MenuButton
          as={'button'}
          className="app-query-menu"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="icon-query-list" />
        </MenuButton>
        <MenuList>
          {itemList.map((i) => (
            <MenuItem key={i.id} onClick={i.onClick}>
              <Flex alignItems={'center'} gap={'8px'}>
                {i.icon} {i.label}
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      {itemType === LIST_ITEM_TYPE.DASHBOARDS && (
        <>{/** Modal Setting Dashboard */}</>
      )}
      {itemType === LIST_ITEM_TYPE.QUERIES && <>{/** Modal Setting Query */}</>}
      {/** Modal Share */}
      {/** Modal Delete */}
    </>
  );
};

export default AppQueryMenu;
