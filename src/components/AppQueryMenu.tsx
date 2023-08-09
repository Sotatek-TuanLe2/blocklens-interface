import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import useOriginPath from 'src/hooks/useOriginPath';
import useUser from 'src/hooks/useUser';
import ModalDashboard from 'src/modals/querySQL/ModalDashboard';
import ModalDelete from 'src/modals/querySQL/ModalDelete';
import ModalQuery from 'src/modals/querySQL/ModalQuery';
import ModalShareDomain from 'src/modals/querySQL/ModalShareDomain';
import { ITEM_TYPE, LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/AppQueryMenu.scss';
import { ROUTES, TYPE_OF_MODAL } from 'src/utils/common';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import {
  DeleteQueryIcon,
  ForkQueryIcon,
  IconDotMore,
  SettingQueryIcon,
  ShareQueryIcon,
  UnsavedIcon,
  SavedIcon,
} from '../assets/icons';
import AppButton from './AppButton';

interface IAppQueryMenu {
  menu: string[];
  item: IQuery | IDashboardDetail;
  itemType: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  onDeleteSuccess?: (item: IQuery | IDashboardDetail) => Promise<void>;
  onForkSuccess?: (
    response: any,
    type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE],
  ) => Promise<void>;
  onSettingSuccess?: (response: any) => Promise<void>;
  onSaveSuccess?: () => Promise<void>;
  isNavMenu?: boolean;
  isSaved?: boolean;
}

export const QUERY_MENU_LIST = {
  SAVE: 'Save',
  FORK: 'Fork',
  SETTING: 'Setting',
  SHARE: 'Share',
  DELETE: 'Delete',
};

const AppQueryMenu: React.FC<IAppQueryMenu> = (props) => {
  const {
    menu,
    itemType,
    onForkSuccess = () => null,
    onDeleteSuccess = () => null,
    onSettingSuccess = () => null,
    onSaveSuccess = () => null,
    item,
    isNavMenu,
    isSaved = false,
  } = props;

  const { user } = useUser();
  const { goWithOriginPath } = useOriginPath();
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

  const onSave = async () => {
    if (!user) {
      return goWithOriginPath(
        ROUTES.LOGIN,
        `${location.pathname}${location.search}`,
      );
    }
    if (isSaved) {
      itemType === ITEM_TYPE.DASHBOARDS
        ? await rf.getRequest('DashboardsRequest').unSaveDashboard(item.id)
        : await rf.getRequest('DashboardsRequest').unSaveQuery(item.id);
      toastSuccess({ message: 'Removed from saved list' });
    } else {
      itemType === ITEM_TYPE.DASHBOARDS
        ? await rf.getRequest('DashboardsRequest').saveDashboard(item.id)
        : await rf.getRequest('DashboardsRequest').saveQuery(item.id);
      toastSuccess({ message: 'Added to saved list' });
    }
    onSaveSuccess();
  };

  const onForkQuery = async () => {
    if (!user) {
      return goWithOriginPath(
        ROUTES.LOGIN,
        `${location.pathname}${location.search}`,
      );
    }

    try {
      const res = await rf
        .getRequest('DashboardsRequest')
        .forkQueries(item.id, { newQueryName: item.name });
      window.open(
        `${ROUTES.MY_QUERY}/${res.id}`,
        '_blank',
        'noopener,noreferrer',
      );
      toastSuccess({ message: 'Fork query successfully!' });
      onForkSuccess && (await onForkSuccess(res, itemType));
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const generateMenu = () => {
    const itemList: {
      id: string;
      label: string;
      icon: React.ReactNode;
      onClick: () => any;
    }[] = menu.map((id) => {
      switch (id) {
        case QUERY_MENU_LIST.FORK:
          return {
            id: QUERY_MENU_LIST.FORK,
            label: QUERY_MENU_LIST.FORK,
            icon: <ForkQueryIcon />,
            onClick: onForkQuery,
          };
        case QUERY_MENU_LIST.FORK:
          return {
            id: QUERY_MENU_LIST.SETTING,
            label: QUERY_MENU_LIST.SETTING,
            icon: <SettingQueryIcon />,
            onClick: onToggleModalSetting,
          };
        case QUERY_MENU_LIST.SHARE:
          return {
            id: QUERY_MENU_LIST.SHARE,
            label: QUERY_MENU_LIST.SHARE,
            icon: <ShareQueryIcon />,
            onClick: onToggleModalShare,
          };
        case QUERY_MENU_LIST.SAVE:
          return {
            id: QUERY_MENU_LIST.SAVE,
            label: isSaved ? 'Unsave' : QUERY_MENU_LIST.SAVE,
            icon: isSaved ? <UnsavedIcon /> : <SavedIcon />,
            onClick: onSave,
          };
        default:
          return {
            id: QUERY_MENU_LIST.DELETE,
            label: QUERY_MENU_LIST.DELETE,
            icon: <DeleteQueryIcon />,
            onClick: onToggleModalDelete,
          };
      }
    });

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
              minW={'calc(50% - 4.5px)'}
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
    </>
  );
};

export default AppQueryMenu;
