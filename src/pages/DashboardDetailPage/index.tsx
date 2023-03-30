import { useState } from 'react';
import { Avatar, Badge, Box, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { ActiveStarIcon, PenIcon, StarIcon } from 'src/assets/icons';
import { AppButton } from 'src/components';
import useUser from 'src/hooks/useUser';
import GridLayout from 'react-grid-layout';
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

const DashboardDetailPage: React.FC = () => {
  const { authorId, dashboardId } = useParams<ParamTypes>();
  const [totalVote, setTotalVote] = useState<number>(2);
  const [markdownText, setMarkdownText] = useState<string>(``);
  const [voteStar, setVoteStar] = useState<boolean>(false);
  const [openModalFork, setOpenModalFork] = useState<boolean>(false);
  const [openModalShare, setOpenModalShare] = useState<boolean>(false);
  const [openModalSetting, setOpenModalSetting] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalAddVisualization, setOpenModalAddVisualization] =
    useState<boolean>(false);
  const [openModalAddTextWidget, setOpenModalAddTextWidget] =
    useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const { user } = useUser();

  const getNameUser = `${user?.getFirstName()}` + `${user?.getLastName()}`;
  const checkDashBoardUser = user?.getId() === authorId;
  const HashTag = ['zkSync', 'bridge', 'l2'];

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
            onClick={() => item.setModal(true)}
          >
            {item.title}
          </AppButton>
        ))}
      </>
    );
  };

  const layout = [
    { i: 'a', x: 0, y: 0, w: 6, h: 4 },
    { i: 'b', x: 6, y: 0, w: 6, h: 4 },
    { i: 'c', x: 0, y: 0, w: 6, h: 4 },
    { i: 'd', x: 6, y: 0, w: 6, h: 4 },
  ];

  return (
    <div className="main-content-dashboard-details">
      <header className="main-header-dashboard-details">
        <Flex gap={2}>
          <Avatar name={user?.getFirstName()} size="sm" />
          <div>
            <div className="dashboard-name">
              @{getNameUser} / zkSync Era Bridge Stats
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
        <Flex gap={'10px'}>
          {editMode ? (
            <GroupEditButton />
          ) : (
            <>
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
              {checkDashBoardUser ? (
                <AppButton
                  size={'sm'}
                  bg="#e1e1f9"
                  color="#1e1870"
                  onClick={() => setOpenModalFork(true)}
                >
                  Fork
                </AppButton>
              ) : null}

              <AppButton
                size={'sm'}
                bg="#e1e1f9"
                color="#1e1870"
                onClick={() => setOpenModalShare(true)}
              >
                Share
              </AppButton>
            </>
          )}
          {checkDashBoardUser ? (
            editMode ? (
              <AppButton
                size={'sm'}
                bg="#1e1870"
                color="#fff"
                onClick={() => setEditMode(false)}
              >
                Done
              </AppButton>
            ) : (
              <AppButton
                size={'sm'}
                bg="#e1e1f9"
                color="#1e1870"
                onClick={() => setEditMode(true)}
              >
                Edit
              </AppButton>
            )
          ) : null}
        </Flex>
      </header>

      <GridLayout
        className="main-grid-layout "
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1800}
      >
        {layout.map((item) => (
          <Box border={'1px dashed #808080'} key={item.i} position={'relative'}>
            {item.i}
            <Box
              onClick={() => setOpenModalEdit(true)}
              position={'absolute'}
              cursor="pointer"
              top={1}
              right={1}
            >
              <PenIcon />
            </Box>
          </Box>
        ))}
      </GridLayout>

      <ModalForkDashBoardDetails
        open={openModalFork}
        onClose={() => setOpenModalFork(false)}
      />
      <ModalShareDashboardDetails
        open={openModalShare}
        onClose={() => setOpenModalShare(false)}
      />
      <ModalSettingDashboardDetails
        open={openModalSetting}
        onClose={() => setOpenModalSetting(false)}
      />
      <ModalAddVisualization
        setOpenModalFork={setOpenModalFork}
        open={openModalAddVisualization}
        onClose={() => setOpenModalAddVisualization(false)}
        getNameUser={getNameUser}
      />
      <ModalAddTextWidget
        open={openModalAddTextWidget}
        onClose={() => setOpenModalAddTextWidget(false)}
        markdownText={markdownText}
        setMarkdownText={setMarkdownText}
      />
      <ModalEditItemDashBoard
        open={openModalEdit}
        onClose={() => setOpenModalEdit(false)}
      />
    </div>
  );
};

export default DashboardDetailPage;
