import { Flex, Link, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ListIcon, SmallSuccessIcon } from 'src/assets/icons';
import { AppButton, AppInput } from 'src/components';
import { ILayout } from 'src/pages/DashboardDetailPage';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/BaseModal.scss';
import { QueryType, VisualizationType } from 'src/utils/common';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import BaseModal from './BaseModal';

interface IModalAddVisualization {
  open: boolean;
  onClose: () => void;
  userName: string;
  setOpenModalFork: React.Dispatch<React.SetStateAction<boolean>>;
  dataLayouts: ILayout[];
  setDataLayouts: React.Dispatch<React.SetStateAction<ILayout[]>>;
  onReload: () => Promise<void>;
}
interface IButtonAdd {
  userName: string;
  item: QueryType;
  dataLayouts: ILayout[];
  handleRemoveVisualization: (
    item: ILayout[],
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
  handleSaveVisualization: (
    data: QueryType,
    visualizations: VisualizationType,
  ) => Promise<void>;
  i: VisualizationType;
}

const ModalAddVisualization: React.FC<IModalAddVisualization> = ({
  open,
  onClose,
  userName,
  setOpenModalFork,
  dataLayouts,
  setDataLayouts,
  onReload,
}) => {
  const [add, setAdd] = useState<boolean>(false);
  const [showMyQueries, setShowMyQueries] = useState<boolean>(false);
  const [dataVisualization, setDataVisualization] = useState<QueryType[]>([]);

  const fetchVisualization = async () => {
    try {
      const res = await rf.getRequest('DashboardsRequest').getVisualization();
      setDataVisualization(res);
    } catch (error) {
      toastError({
        message: getErrorMessage(error),
      });
    }
  };

  useEffect(() => {
    fetchVisualization();
  }, []);

  const handleSaveVisualization = async (
    data: QueryType,
    visualizations: VisualizationType,
  ) => {
    try {
      const payload = {
        meta: {
          i: (dataLayouts.length + 1).toString(),
          x: dataLayouts.length % 2 === 0 ? 0 : 6,
          y: 0,
          w: 6,
          h: 2,
        },
        content: [
          {
            ...data,
            visualizations: visualizations,
            parentId: (dataLayouts.length + 1).toString(),
          },
        ],
      };
      const res = await rf
        .getRequest('DashboardsRequest')
        .addDashboardItem(payload);
      if (res) {
        onReload();
      }
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const handleRemoveVisualization = async (
    item: any,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    try {
      console.log(item, item);
      e.preventDefault();
      const res = await rf
        .getRequest('DashboardsRequest')
        .removeDashboardItem(item[0].content[0].parentId);
      if (res) {
        setDataLayouts([...dataLayouts]);
        onReload();
        fetchVisualization();
      }
      // onClose();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      size="lg"
      className="modal-add-visualization"
    >
      <form className="main-modal-dashboard-details">
        <AppInput
          mt={'10px'}
          size="sm"
          placeholder={
            showMyQueries ? "Search everyone's queries" : 'Search your queries'
          }
        />
        <div className="main-queries">
          {dataVisualization.map((item) =>
            item.visualizations.map((i) => (
              <Flex
                justifyContent={'space-between'}
                borderBottom={'1px solid white'}
                key={item.id}
              >
                {showMyQueries ? (
                  <>
                    <Flex alignItems={'center'} columnGap={'10px'} p={'10px'}>
                      <ListIcon />
                      <Link>@cypherpepe / Airdrops and Wallets</Link>
                      <Text fontWeight={'bold'}>Airdrops and Wallets</Text>
                    </Flex>
                    <Text
                      onClick={() => setAdd(!add)}
                      className={add ? 'btn-added-query' : 'btn-add-query'}
                    >
                      {add ? 'Added' : 'Add'}
                    </Text>
                  </>
                ) : (
                  <ButtonAdd
                    userName={userName}
                    item={item}
                    dataLayouts={dataLayouts}
                    handleSaveVisualization={handleSaveVisualization}
                    handleRemoveVisualization={handleRemoveVisualization}
                    i={i}
                  />
                )}
              </Flex>
            )),
          )}
        </div>
        <Flex
          flexWrap={'wrap'}
          gap={'10px'}
          mt={10}
          className="group-action-query"
        >
          <AppButton className="btn-save" size="sm" onClick={onClose}>
            Done
          </AppButton>
          <AppButton
            size="sm"
            className="btn-remove"
            variant={'cancel'}
            onClick={() => setOpenModalFork(true)}
          >
            New dashboard
          </AppButton>
          <AppButton
            className={showMyQueries ? 'btn-added-query' : 'btn-add-query'}
            size="sm"
            variant={'cancel'}
            onClick={() => setShowMyQueries(!showMyQueries)}
          >
            Show queries from other users{' '}
            {showMyQueries ? (
              <Text ps={'4px'}>
                <SmallSuccessIcon />
              </Text>
            ) : (
              ''
            )}
          </AppButton>
        </Flex>
      </form>
    </BaseModal>
  );
};

export default ModalAddVisualization;

const ButtonAdd: React.FC<IButtonAdd> = ({
  userName,
  item,
  handleSaveVisualization,
  handleRemoveVisualization,
  dataLayouts,
  i,
}) => {
  const checkIdItem = dataLayouts
    .map((i: any) => i.content[0]?.id)
    .includes(item.id);

  const checkAdded = checkIdItem
    ? dataLayouts
        .map((item: any) => item.content[0]?.visualizations.id)
        .includes(i.id)
    : null;

  return (
    <>
      <Flex alignItems={'center'} columnGap={'10px'} p={'10px'}>
        <ListIcon />
        <Link>
          @{userName} / {item.name}
        </Link>
        <Text fontWeight={'bold'}>
          {i.options.globalSeriesType}{' '}
          {i.name === 'Table' ? 'Query results' : i.name}
        </Text>
      </Flex>
      <Text
        onClick={(e: any) => {
          checkAdded
            ? handleRemoveVisualization(dataLayouts, e)
            : handleSaveVisualization(item, i);
        }}
        className={checkAdded ? 'btn-added-query' : 'btn-add-query'}
      >
        {checkAdded ? 'Added' : 'Add'}
      </Text>
    </>
  );
};
