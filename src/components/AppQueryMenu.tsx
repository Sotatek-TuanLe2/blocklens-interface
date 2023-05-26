import { Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useState } from 'react';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import AppButton from './AppButton';
import 'src/styles/components/AppQueryMenu.scss';
import ModalShareDomain from 'src/modals/querySQL/ModalShareDomain';
import ModalDelete from 'src/modals/querySQL/ModalDelete';
import ModalSettingQuery from 'src/modals/querySQL/ModalSettingQuery';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { AppBroadcast } from 'src/utils/utils-broadcast';

interface IAppQueryMenu {
  menu?: string[];
  itemType: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  onFork?: () => void;
  item: IQuery | IDashboardDetail;
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
    item,
  } = props;

  const [openModalSettingQuery, setOpenModalSettingQuery] =
    useState<boolean>(false);
  const [openModalShare, setOpenModalShare] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const onToggleModalSetting = () =>
    setOpenModalSettingQuery((prevState) => !prevState);

  const onToggleModalShare = () => setOpenModalShare((prevState) => !prevState);

  const onToggleModalDelete = () =>
    setOpenModalDelete((prevState) => !prevState);

  const handleDeleteSuccess = () => {
    console.log('delete success');
  };

  const handleSettingSuccess = () => {
    AppBroadcast.dispatch('SETTING_QUERY');
  };

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
      {itemType === LIST_ITEM_TYPE.QUERIES && openModalSettingQuery && (
        <ModalSettingQuery
          open={openModalSettingQuery}
          onClose={() => setOpenModalSettingQuery(false)}
          id={item.id}
          defaultValue={{ name: item.name, tags: item.tags }}
          onSuccess={handleSettingSuccess}
        />
      )}
      {/** Modal Share */}
      {openModalShare && (
        <ModalShareDomain
          open={openModalShare}
          onClose={() => setOpenModalShare(false)}
        />
      )}
      {openModalDelete && (
        <ModalDelete
          open={openModalDelete}
          onClose={() => setOpenModalDelete(false)}
          onSuccess={handleDeleteSuccess}
          type={itemType}
          id={item.id}
        />
      )}
      {/** Modal Delete */}
    </>
  );
};

export default AppQueryMenu;
