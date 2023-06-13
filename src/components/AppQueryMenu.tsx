import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import useUser from 'src/hooks/useUser';
import ModalDashboard from 'src/modals/querySQL/ModalDashboard';
import ModalDelete from 'src/modals/querySQL/ModalDelete';
import ModalQuery from 'src/modals/querySQL/ModalQuery';
import ModalShareDomain from 'src/modals/querySQL/ModalShareDomain';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import 'src/styles/components/AppQueryMenu.scss';
import { TYPE_OF_MODAL, ROUTES } from 'src/utils/common';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import AppButton from './AppButton';
import {IconDotMore} from "../assets/icons";

interface IAppQueryMenu {
  menu?: string[];
  item: IQuery | IDashboardDetail;
  itemType: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  onDeleteSuccess?: (item: IQuery | IDashboardDetail) => Promise<void>;
  onForkSuccess?: (
    response: any,
    type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE],
  ) => Promise<void>;
  onSettingSuccess?: (response: any) => Promise<void>;
  isNavMenu?: boolean;
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
    isNavMenu,
  } = props;

  const { user } = useUser();
  const location = window.location;

  const [openModalSetting, setOpenModalSetting] = useState<boolean>(false);
  const [openModalShare, setOpenModalShare] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [openModalFork, setOpenModalFork] = useState<boolean>(false);

  const onToggleModalSetting = () =>
    setOpenModalSetting((prevState) => !prevState);

  const onToggleModalShare = () => setOpenModalShare((prevState) => !prevState);

  const onToggleModalDelete = () =>
    setOpenModalDelete((prevState) => !prevState);

  const onToggleModalFork = async () => {
    setOpenModalFork((prevState) => !prevState);
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
        onClick: onToggleModalFork,
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

  const linkShareItem = useMemo(
    () =>
      `${location.protocol}//${location.hostname}${
        location.port ? `:${location.port}` : ''
      }${
        itemType === LIST_ITEM_TYPE.DASHBOARDS ? ROUTES.DASHBOARD : ROUTES.QUERY
      }/${item.id}`,
    [item],
  );
  return (
    <>
      {!isNavMenu ? (
        <Menu>
          <MenuButton
            as={'button'}
            className="app-query-menu"
            onClick={(e) => e.stopPropagation()}
          >
            <Box>
              <IconDotMore color={'rgba(0, 2, 36, 0.5)'} />
            </Box>
          </MenuButton>
          <MenuList
            boxShadow={'0px 10px 40px rgba(125, 143, 179, 0.2)'}
            className="app-query-menu__list"
          >
            {generateMenu().map((i) => (
              <MenuItem key={i.id} onClick={i.onClick}>
                <Flex alignItems={'center'} gap={'8px'}>
                  {i.icon} {i.label}
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      ) : (
        <Flex align={'center'}>
          {generateMenu().map((item, index) => (
            <AppButton
              key={item.id}
              className="btn-primary"
              onClick={item.onClick}
              h={'36px'}
              ml={index !== 0 ? '9px' : 0}
            >
              {item.icon}&nbsp;{item.label}
            </AppButton>
          ))}
        </Flex>
      )}
      {itemType === LIST_ITEM_TYPE.DASHBOARDS && openModalSetting && (
        <ModalDashboard
          open={openModalSetting}
          id={item.id}
          defaultValue={{ name: item.name, tags: item.tags }}
          type={TYPE_OF_MODAL.SETTING}
          onClose={onToggleModalSetting}
          onSuccess={(res) => onSettingSuccess(res)}
        />
      )}

      {itemType === LIST_ITEM_TYPE.DASHBOARDS && openModalFork && (
        <ModalDashboard
          open={openModalFork}
          id={item.id}
          type={TYPE_OF_MODAL.FORK}
          onClose={onToggleModalFork}
          onSuccess={(res) => onForkSuccess(res, itemType)}
        />
      )}

      {itemType === LIST_ITEM_TYPE.QUERIES && openModalSetting && (
        <ModalQuery
          type={TYPE_OF_MODAL.SETTING}
          open={openModalSetting}
          id={item.id}
          defaultValue={{ name: item.name, tags: item.tags }}
          onClose={onToggleModalSetting}
          onSuccess={(res) => onSettingSuccess(res)}
        />
      )}
      {/** Modal Share */}
      {openModalShare && (
        <ModalShareDomain
          open={openModalShare}
          onClose={() => setOpenModalShare(false)}
          link={linkShareItem}
        />
      )}
      {/** Modal Delete */}
      {openModalDelete && (
        <ModalDelete
          open={openModalDelete}
          onClose={() => setOpenModalDelete(false)}
          onSuccess={() => onDeleteSuccess(item)}
          type={itemType}
          id={item.id}
        />
      )}
      {/**Modal fork */}
      {itemType === LIST_ITEM_TYPE.QUERIES && openModalFork && (
        <ModalQuery
          open={openModalFork}
          onClose={() => setOpenModalFork(false)}
          onSuccess={(res) => onForkSuccess(res, itemType)}
          type={TYPE_OF_MODAL.FORK}
          id={item.id}
        />
      )}
    </>
  );
};

export default AppQueryMenu;
