import { useState } from 'react';
import { Avatar, Badge, Box, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { ActiveStarIcon, PenIcon, StarIcon } from 'src/assets/icons';
import { AppButton } from 'src/components';
import useUser from 'src/hooks/useUser';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import ReactMarkdown from 'react-markdown';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'src/styles/pages/DashboardDetailPage.scss';
import ModalForkDashBoardDetails from 'src/modals/ModalForkDashBoardDetails';
import ModalShareDashboardDetails from 'src/modals/ModalShareDashboardDetails';
import ModalSettingDashboardDetails from 'src/modals/ModalSettingDashboardDetails';
import ModalAddTextWidget from 'src/modals/ModalAddTextWidget';
import ModalAddVisualization from 'src/modals/ModalAddVisualization';
import ModalEditItemDashBoard from 'src/modals/ModalEditItemDashBoard';

interface ParamTypes {
  authorId: string;
  dashboardId: string;
}

export interface ILayout extends Layout {
  id: number;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const layouts: ILayout[] = [
  { id: 1, i: 'a', x: 0, y: 0, w: 6, h: 2 },
  { id: 2, i: 'b', x: 6, y: 0, w: 6, h: 2 },
  { id: 3, i: 'c', x: 0, y: 0, w: 6, h: 2 },
  { id: 4, i: 'd', x: 6, y: 0, w: 6, h: 2 },
];
const HashTag: string[] = ['zkSync', 'bridge', 'l2'];

const DashboardDetailPage: React.FC = () => {
  const { authorId, dashboardId } = useParams<ParamTypes>();
  const [dataLayouts, setDataLayouts] = useState<ILayout[]>(layouts);
  const [selectedItem, setSelectedItem] = useState<ILayout>(Object);
  const [markdownText, setMarkdownText] = useState<string>(``);
  const [typeModalTextWidget, setTypeModalTextWidget] = useState<string>(``);
  const [openModalAddVisualization, setOpenModalAddVisualization] =
    useState<boolean>(false);
  const [openModalFork, setOpenModalFork] = useState<boolean>(false);
  const [openModalSetting, setOpenModalSetting] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [openModalAddTextWidget, setOpenModalAddTextWidget] =
    useState<boolean>(false);
  const { user } = useUser();

  const UserName = `${user?.getFirstName()}` + `${user?.getLastName()}`;

  const GroupEditButton = () => {
    const TitleEditName = [
      { title: 'Settings', setModal: setOpenModalSetting },
      { title: 'Add text widget', setModal: setOpenModalAddTextWidget },
      { title: 'Add visualization', setModal: setOpenModalAddVisualization },
    ];
    return (
      <>
        {TitleEditName.map((item, index) => (
          <AppButton
            key={index}
            size={'sm'}
            bg="#e1e1f9"
            color="#1e1870"
            onClick={() => {
              if (item.title === 'Add text widget') {
                setTypeModalTextWidget('add');
              }
              item.setModal(true);
            }}
          >
            {item.title}
          </AppButton>
        ))}
      </>
    );
  };

  const ButtonModalFork = () => {
    return (
      <>
        <AppButton
          size={'sm'}
          bg="#e1e1f9"
          color="#1e1870"
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

  const ButtonVoteStar = () => {
    const [voteStar, setVoteStar] = useState<boolean>(false);
    const [totalVote, setTotalVote] = useState<number>(2);

    return (
      <AppButton
        onClick={() => {
          setTotalVote(!voteStar ? totalVote + 1 : totalVote - 1);
          setVoteStar(!voteStar);
        }}
        size={'sm'}
        bg="#e1e1f9"
        color="#1e1870"
        rightIcon={!voteStar ? <StarIcon /> : <ActiveStarIcon />}
        w={'60px'}
      >
        {totalVote}
      </AppButton>
    );
  };

  const ButtonShare = () => {
    const [openModalShare, setOpenModalShare] = useState<boolean>(false);

    return (
      <>
        <AppButton
          size={'sm'}
          bg="#e1e1f9"
          color="#1e1870"
          onClick={() => setOpenModalShare(true)}
        >
          Share
        </AppButton>
        <ModalShareDashboardDetails
          open={openModalShare}
          onClose={() => setOpenModalShare(false)}
          user={user}
        />
      </>
    );
  };

  const ButtonEdit = () => {
    const isAccountsDashboard = user?.getId() === authorId;
    const ButtonDone = () => {
      return (
        <AppButton
          size={'sm'}
          bg="#1e1870"
          color="#fff"
          onClick={() => setEditMode(false)}
        >
          Done
        </AppButton>
      );
    };
    const ButtonEditChildren = () => {
      return (
        <AppButton
          size={'sm'}
          bg="#e1e1f9"
          color="#1e1870"
          onClick={() => setEditMode(true)}
        >
          Edit
        </AppButton>
      );
    };

    return (
      <Flex gap={'10px'}>
        {editMode ? (
          <GroupEditButton />
        ) : (
          <>
            <ButtonVoteStar />
            {isAccountsDashboard ? <ButtonModalFork /> : null}

            <ButtonShare />
          </>
        )}
        {isAccountsDashboard ? (
          editMode ? (
            <ButtonDone />
          ) : (
            <ButtonEditChildren />
          )
        ) : null}
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
              @{UserName} / {dashboardId}
            </div>
            <Flex gap={1} pt={'10px'}>
              {HashTag.map((item) => (
                <Badge
                  bg={'gray.200'}
                  color={'gray.600'}
                  size={'sm'}
                  key={item}
                >
                  #{item}
                </Badge>
              ))}
            </Flex>
          </div>
        </Flex>
        <ButtonEdit />
      </header>

      <ResponsiveGridLayout
        className="main-grid-layout"
        layouts={{ lg: dataLayouts }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        isDraggable={editMode}
        isResizable={editMode}
        maxRows={4}
      >
        {dataLayouts.map((item) => (
          <Box border={'1px dashed #808080'} key={item.i} position={'relative'}>
            <ReactMarkdown source={item.i} escapeHtml={false} />
            {editMode ? (
              <Box
                onClick={() => {
                  setOpenModalAddTextWidget(true);
                  setTypeModalTextWidget('edit');
                  setSelectedItem(item);
                }}
                position={'absolute'}
                cursor="pointer"
                top={1}
                right={1}
              >
                <PenIcon />
              </Box>
            ) : null}
          </Box>
        ))}
      </ResponsiveGridLayout>
      <ModalSettingDashboardDetails
        url={dashboardId}
        authorId={authorId}
        open={openModalSetting}
        HashTag={HashTag}
        onClose={() => setOpenModalSetting(false)}
      />

      <ModalAddTextWidget
        selectedItem={selectedItem}
        dataLayouts={dataLayouts}
        setDataLayouts={setDataLayouts}
        type={typeModalTextWidget}
        open={openModalAddTextWidget}
        onClose={() => setOpenModalAddTextWidget(false)}
        markdownText={markdownText}
        setMarkdownText={setMarkdownText}
      />
      <ModalEditItemDashBoard
        open={openModalEdit}
        onClose={() => setOpenModalEdit(false)}
      />
      <ModalAddVisualization
        setOpenModalFork={setOpenModalFork}
        open={openModalAddVisualization}
        onClose={() => setOpenModalAddVisualization(false)}
        userName={UserName}
      />
    </div>
  );
};

export default DashboardDetailPage;
