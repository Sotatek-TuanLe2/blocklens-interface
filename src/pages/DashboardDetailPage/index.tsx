import { useEffect, useState } from 'react';
import { Avatar, Badge, Box, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { ActiveStarIcon, PenIcon, StarIcon } from 'src/assets/icons';
import { AppButton } from 'src/components';
import useUser from 'src/hooks/useUser';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import ReactMarkdown from 'react-markdown';
import rf from 'src/requests/RequestFactory';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'src/styles/pages/DashboardDetailPage.scss';
import ModalForkDashBoardDetails from 'src/modals/ModalForkDashBoardDetails';
import ModalShareDashboardDetails from 'src/modals/ModalShareDashboardDetails';
import ModalSettingDashboardDetails from 'src/modals/ModalSettingDashboardDetails';
import ModalAddTextWidget from 'src/modals/ModalAddTextWidget';
import ModalAddVisualization from 'src/modals/ModalAddVisualization';
import ModalEditItemDashBoard from 'src/modals/ModalEditItemDashBoard';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';

interface ParamTypes {
  authorId: string;
  dashboardId: string;
}

interface IButtonModalFork {
  openModalFork: boolean;
  setOpenModalFork: React.Dispatch<React.SetStateAction<boolean>>;
  authorId: string;
}

export interface ILayout extends Layout {
  i: string;
  id: number;
}
export enum TYPE_MODAL {
  ADD = 'add',
  EDIT = 'edit',
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const hashTag: string[] = ['zkSync', 'bridge', 'l2'];

const DashboardDetailPage: React.FC = () => {
  const { authorId, dashboardId } = useParams<ParamTypes>();
  const { user } = useUser();

  const [editMode, setEditMode] = useState<boolean>(false);
  const [dataLayouts, setDataLayouts] = useState<ILayout[]>([]);
  const [selectedItem, setSelectedItem] = useState<ILayout>(Object);
  const [typeModalTextWidget, setTypeModalTextWidget] = useState<string>(``);

  const [openModalAddVisualization, setOpenModalAddVisualization] =
    useState<boolean>(false);
  const [openModalFork, setOpenModalFork] = useState<boolean>(false);
  const [openModalSetting, setOpenModalSetting] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalAddTextWidget, setOpenModalAddTextWidget] =
    useState<boolean>(false);

  const userName = `${user?.getFirstName()}` + `${user?.getLastName()}`;

  const fetchLayoutData = async () => {
    try {
      const res = await rf.getRequest('DashboardsRequest').getDashboardItem();
      setDataLayouts(res);
    } catch (error) {
      toastError({
        message: getErrorMessage(error),
      });
    }
  };

  useEffect(() => {
    fetchLayoutData();
  }, []);

  const _renderButtons = () => {
    const isAccountsDashboard = user?.getId() === authorId;
    const editButtons = [
      { title: 'Settings', setModal: setOpenModalSetting },
      { title: 'Add text widget', setModal: setOpenModalAddTextWidget },
      { title: 'Add visualization', setModal: setOpenModalAddVisualization },
    ];

    return (
      <Flex gap={'10px'}>
        {editMode ? (
          editButtons.map((item, index) => (
            <AppButton
              className="btn-cancel"
              key={index}
              size={'sm'}
              onClick={() => {
                if (item.title === 'Add text widget') {
                  setTypeModalTextWidget(TYPE_MODAL.ADD);
                }
                item.setModal(true);
              }}
            >
              {item.title}
            </AppButton>
          ))
        ) : (
          <>
            <ButtonVoteStar />
            {isAccountsDashboard && (
              <ButtonModalFork
                openModalFork={openModalFork}
                setOpenModalFork={setOpenModalFork}
                authorId={authorId}
              />
            )}
            <ButtonShare />
          </>
        )}
        {isAccountsDashboard && (
          <AppButton
            className={editMode ? 'btn-save' : 'btn-cancel'}
            size={'sm'}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Done' : 'Edit'}
          </AppButton>
        )}
      </Flex>
    );
  };

  return (
    <div className="main-content-dashboard-details">
      <header className="main-header-dashboard-details">
        <Flex gap={2}>
          <Avatar name={user?.getFirstName()} size="sm" />
          <div>
            <div className="dashboard-name">
              @{userName} / {dashboardId}
            </div>
            <Flex gap={1} pt={'10px'}>
              {hashTag.map((item) => (
                <Badge size={'sm'} key={item}>
                  #{item}
                </Badge>
              ))}
            </Flex>
          </div>
        </Flex>
        {_renderButtons()}
      </header>
      <ResponsiveGridLayout
        className="main-grid-layout"
        layouts={{ lg: dataLayouts }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        isDraggable={editMode}
        isResizable={editMode}
      >
        {dataLayouts.map((item) => (
          <div className="box-layout" key={item.i}>
            <ReactMarkdown>{item.i}</ReactMarkdown>
            {editMode ? (
              <Box
                className="btn-edit"
                onClick={() => {
                  setOpenModalAddTextWidget(true);
                  setTypeModalTextWidget(TYPE_MODAL.EDIT);
                  setSelectedItem(item);
                }}
              >
                <PenIcon />
              </Box>
            ) : null}
          </div>
        ))}
      </ResponsiveGridLayout>
      <ModalSettingDashboardDetails
        url={dashboardId}
        authorId={authorId}
        open={openModalSetting}
        hashTag={hashTag}
        onClose={() => setOpenModalSetting(false)}
      />
      <ModalAddTextWidget
        selectedItem={selectedItem}
        dataLayouts={dataLayouts}
        setDataLayouts={setDataLayouts}
        type={typeModalTextWidget}
        open={openModalAddTextWidget}
        onClose={() => setOpenModalAddTextWidget(false)}
        onReload={fetchLayoutData}
      />
      <ModalEditItemDashBoard
        open={openModalEdit}
        onClose={() => setOpenModalEdit(false)}
      />
      <ModalAddVisualization
        setOpenModalFork={setOpenModalFork}
        open={openModalAddVisualization}
        onClose={() => setOpenModalAddVisualization(false)}
        userName={userName}
      />
    </div>
  );
};

export default DashboardDetailPage;

const ButtonModalFork: React.FC<IButtonModalFork> = ({
  openModalFork,
  setOpenModalFork,
  authorId,
}) => {
  return (
    <>
      <AppButton
        className="btn-cancel"
        size={'sm'}
        onClick={() => setOpenModalFork(true)}
      >
        Fork
      </AppButton>
      <ModalForkDashBoardDetails
        authorId={authorId}
        open={openModalFork}
        onClose={() => setOpenModalFork(false)}
      />
    </>
  );
};

const ButtonVoteStar: React.FC = () => {
  const [voteStar, setVoteStar] = useState<boolean>(false);
  const [totalVote, setTotalVote] = useState<number>(2);

  return (
    <AppButton
      onClick={() => {
        setTotalVote(!voteStar ? totalVote + 1 : totalVote - 1);
        setVoteStar(!voteStar);
      }}
      className="btn-cancel"
      size={'sm'}
      rightIcon={!voteStar ? <StarIcon /> : <ActiveStarIcon />}
      w={'60px'}
    >
      {totalVote}
    </AppButton>
  );
};

const ButtonShare: React.FC = () => {
  const [openModalShare, setOpenModalShare] = useState<boolean>(false);

  return (
    <>
      <AppButton
        className="btn-cancel"
        size={'sm'}
        onClick={() => setOpenModalShare(true)}
      >
        Share
      </AppButton>
      <ModalShareDashboardDetails
        open={openModalShare}
        onClose={() => setOpenModalShare(false)}
      />
    </>
  );
};
