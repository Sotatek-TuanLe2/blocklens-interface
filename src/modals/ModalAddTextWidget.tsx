import { Flex, Text, Textarea } from '@chakra-ui/react';
import { debounce } from 'lodash';
import React, { MouseEvent, useState } from 'react';
import { AppButton, AppField } from 'src/components';
import AppAccordion from 'src/components/AppAccordion';
import { ILayout, TYPE_MODAL } from 'src/pages/DashboardDetailPage';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/BaseModal.scss';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import BaseModal from './BaseModal';

interface IModalAddTextWidget {
  open: boolean;
  onClose: () => void;
  type?: TYPE_MODAL.ADD | TYPE_MODAL.EDIT | string;
  selectedItem: ILayout;
  dataLayouts: ILayout[];
  setDataLayouts: React.Dispatch<React.SetStateAction<ILayout[]>>;
  onReload: () => Promise<void>;
}

interface IMarkdown {
  title: string;
  mark: JSX.Element;
}

const linkDune = 'https://dune.com';
const randomImage = 'https://unsplash.it/600/400';

const MarkdownSupport: IMarkdown[] = [
  { title: 'Bold', mark: <b>**text**</b> },
  { title: 'Italic', mark: <i>_text_</i> },
  { title: 'Heading 1', mark: <># Text</> },
  { title: 'Heading 2', mark: <>## Text</> },
  { title: 'Heading 3', mark: <> ### Text</> },
  {
    title: 'Link',
    mark: (
      <>
        [Link]<a href={linkDune}>({linkDune})</a>
      </>
    ),
  },
  {
    title: 'Image or GIF',
    mark: (
      <>
        ![image]<a href={randomImage}>({randomImage})</a>
      </>
    ),
  },
  { title: 'Inline code	', mark: <>`code`</> },
  {
    title: 'Code block',
    mark: (
      <>
        ```<div>code block</div>```
      </>
    ),
  },
  { title: 'Horizontal rule', mark: <>---</> },
  {
    title: 'Ordered list',
    mark: (
      <>
        1. First item
        <br />
        2. Second item
        <br />
        3. Third item
      </>
    ),
  },
  {
    title: 'List',
    mark: (
      <>
        - First item
        <br />
        - Second item
        <br />- Third item
      </>
    ),
  },
];
const ModalAddTextWidget: React.FC<IModalAddTextWidget> = ({
  open,
  onClose,
  type,
  dataLayouts,
  setDataLayouts,
  selectedItem,
  onReload,
}) => {
  const [markdownText, setMarkdownText] = useState<string>(``);

  const DEBOUNCE_TIME = 500;

  const handleSave = async () => {
    try {
      const res = await rf.getRequest('DashboardsRequest').addDashboardItem({
        id: dataLayouts.length + 1,
        i: markdownText,
        x: 0,
        y: 0,
        w: 6,
        h: 2,
      });
      if (res) {
        setDataLayouts([...dataLayouts, res]);
        setMarkdownText('');
        onClose();
      }
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await rf
        .getRequest('DashboardsRequest')
        .updateDashboardItem({ ...selectedItem, i: markdownText });
      if (res) {
        setDataLayouts((prevData) => {
          const updateDataIndex = prevData.findIndex(
            (item) => item.id === selectedItem.id,
          );
          if (updateDataIndex === -1) {
            return [...prevData, res];
          } else {
            const newData = [...prevData];
            newData.splice(updateDataIndex, 1, res);
            return newData;
          }
        });
        setMarkdownText('');
        onClose();
      }
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const handleRemoveItem = async (
    id: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    try {
      e.preventDefault();
      const res = await rf
        .getRequest('DashboardsRequest')
        .removeDashboardItem(selectedItem.id);
      if (res) {
        setDataLayouts([...dataLayouts]);
      }
      onReload();
      onClose();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const handleChangeMarkdownText = debounce((event) => {
    setMarkdownText(event.target.value);
  }, DEBOUNCE_TIME);

  const ButtonSave = () => {
    return (
      <AppButton
        size="sm"
        bg="#1e1870"
        color="#fff"
        onClick={() => {
          type === TYPE_MODAL.ADD ? handleSave() : handleUpdate();
        }}
        disabled={!markdownText}
      >
        Save
      </AppButton>
    );
  };
  const ButtonCancel = () => {
    return (
      <AppButton
        onClick={onClose}
        size="sm"
        bg="#e1e1f9"
        color="#1e1870"
        variant={'cancel'}
      >
        Cancel
      </AppButton>
    );
  };
  const ButtonRemoveWidget = () => {
    return (
      <AppButton
        onClick={(e: never) => handleRemoveItem(selectedItem.id, e)}
        size="sm"
        bg="#e1e1f9"
        color="#1e1870"
        variant={'cancel'}
      >
        Remove this widget
      </AppButton>
    );
  };

  return (
    <BaseModal isOpen={open} onClose={onClose} size="md">
      <div className="main-modal-dashboard-details">
        <AppField label={'Text widget context'}>
          <Textarea
            resize={'both'}
            size="sm"
            h={'150px'}
            borderRadius={'0.5rem'}
            defaultValue={type === TYPE_MODAL.ADD ? '' : selectedItem.i}
            onChange={handleChangeMarkdownText}
          />
        </AppField>
        <AppAccordion
          content={
            <div>
              {MarkdownSupport.map((item) => (
                <Flex key={item.title} gap={'20px'} className="main-markdown">
                  <Text w={'160px'}>{item.title}</Text>
                  <Text w={'100%'}>{item.mark}</Text>
                </Flex>
              ))}
            </div>
          }
          title={'Some markdown is supported'}
        />

        <Flex
          flexWrap={'wrap'}
          gap={'10px'}
          mt={10}
          justifyContent={type === TYPE_MODAL.ADD ? '' : 'space-between'}
        >
          <ButtonSave />
          {type === TYPE_MODAL.ADD ? (
            <ButtonCancel />
          ) : (
            <Flex gap={'10px'}>
              <ButtonRemoveWidget />
              <ButtonCancel />
            </Flex>
          )}
        </Flex>
      </div>
    </BaseModal>
  );
};

export default ModalAddTextWidget;
