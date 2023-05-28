import { Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useState } from 'react';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/AppQueryMenu.scss';
import useUser from 'src/hooks/useUser';
import ModalShareDomain from 'src/modals/querySQL/ModalShareDomain';
import ModalDelete from 'src/modals/querySQL/ModalDelete';
import ModalSettingQuery from 'src/modals/querySQL/ModalSettingQuery';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import ModalNewDashboard from 'src/modals/querySQL/ModalNewDashboard';
import { TYPE_MODAL } from 'src/pages/WorkspacePage/parts/Dashboard';
import { Dashboard } from 'src/utils/utils-dashboard';
import { Query } from 'src/utils/utils-query';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';

interface IAppQueryMenu {
  menu?: string[];
  item: IQuery | IDashboardDetail;
  itemType: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  onDeleteSuccess?: (item: IQuery | IDashboardDetail) => Promise<void>;
  onForkSuccess?: (
    response: any,
    type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE],
  ) => Promise<void>;
  onSettingSuccess?: () => Promise<void>;
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
    onForkSuccess = () => null,
    onDeleteSuccess = () => null,
    onSettingSuccess = () => null,
    item,
  } = props;

  const { user } = useUser();

  const [openModalSetting, setOpenModalSetting] = useState<boolean>(false);
  const [openModalShare, setOpenModalShare] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const onToggleModalSetting = () =>
    setOpenModalSetting((prevState) => !prevState);

  const onToggleModalShare = () => setOpenModalShare((prevState) => !prevState);

  const onToggleModalDelete = () =>
    setOpenModalDelete((prevState) => !prevState);

  const onFork = async () => {
    try {
      let response;
      if (itemType === LIST_ITEM_TYPE.DASHBOARDS) {
        const itemClass = new Dashboard(item as IDashboardDetail);
        response = await rf
          .getRequest('DashboardsRequest')
          .forkDashboard(
            { newDashboardName: `Forked from ${itemClass.getName()}` },
            itemClass.getId(),
          );
      } else if (itemType === LIST_ITEM_TYPE.QUERIES) {
        const itemClass = new Query(item as IQuery);
        response = await rf
          .getRequest('DashboardsRequest')
          .forkQueries(itemClass.getId());
      }
      response && onForkSuccess(response, itemType);
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const generateMenu = () => {
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
    if (!user) {
      itemList = itemList.filter((item) =>
        [QUERY_MENU_LIST.SHARE].includes(item.id),
      );
    }

    return itemList;
  };

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
        <MenuList className="app-query-menu__list">
          {generateMenu().map((i) => (
            <MenuItem key={i.id} onClick={i.onClick}>
              <Flex alignItems={'center'} gap={'8px'}>
                {i.icon} {i.label}
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      {itemType === LIST_ITEM_TYPE.DASHBOARDS && openModalSetting && (
        <ModalNewDashboard
          open={openModalSetting}
          id={item.id}
          defaultValue={{ name: item.name, tags: item.tags }}
          type={TYPE_MODAL.EDIT}
          onClose={onToggleModalSetting}
          onSuccess={onSettingSuccess}
        />
      )}
      {itemType === LIST_ITEM_TYPE.QUERIES && openModalSetting && (
        <ModalSettingQuery
          open={openModalSetting}
          id={item.id}
          defaultValue={{ name: item.name, tags: item.tags }}
          onClose={onToggleModalSetting}
          onSuccess={onSettingSuccess}
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
          onSuccess={() => onDeleteSuccess(item)}
          type={itemType}
          id={item.id}
        />
      )}
      {/** Modal Delete */}
    </>
  );
};

export default AppQueryMenu;
