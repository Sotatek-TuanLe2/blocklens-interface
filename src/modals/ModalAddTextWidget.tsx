import { Flex, Text, Textarea } from '@chakra-ui/react';
import { debounce } from 'lodash';
import React, { useState } from 'react';
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
  dashboardId: string;
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
  dashboardId,
}) => {
  const [markdownText, setMarkdownText] = useState<string>(``);

  const DEBOUNCE_TIME = 500;

  const handleSave = async () => {
    try {
      const payload = {
        dashboardId,
        text: markdownText,
        options: {
          sizeX: dataLayouts.length % 2 === 0 ? 6 : 6,
          sizeY: 6,
          col: 6,
          row: 2,
        },
      };
      const res = await rf
        .getRequest('DashboardsRequest')
        .addDashboardItem(payload);
      if (res) {
        onReload();
        setMarkdownText('');
        onClose();
      }
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        meta: {
          i: markdownText,
          x: selectedItem.x,
          y: selectedItem.y,
          w: selectedItem.w,
          h: selectedItem.h,
        },
        content: [],
        id: selectedItem.id,
      };
      const res = await rf
        .getRequest('DashboardsRequest')
        .updateDashboardItem(payload);
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
        onReload();
        setMarkdownText('');
        onClose();
      }
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };
  const handleRemoveItem = async (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
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

  return (
    <BaseModal isOpen={open} onClose={onClose} size="md">
      <div className="main-modal-dashboard-details">
        <AppField label={'Text widget context'}>
          <Textarea
            className="text-widget-input"
            resize={'both'}
            size="sm"
            defaultValue={type === TYPE_MODAL.ADD ? '' : selectedItem.i}
            onChange={handleChangeMarkdownText}
          />
        </AppField>
        <AppAccordion
          content={
            <div>
              {MarkdownSupport.map((item) => (
                <Flex key={item.title} gap={'20px'} className="main-markdown">
                  <Text className="title-markdown">{item.title}</Text>
                  <Text className="markdown">{item.mark}</Text>
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
          <AppButton
            className="btn-save"
            size="sm"
            onClick={() => {
              type === TYPE_MODAL.ADD ? handleSave() : handleUpdate();
            }}
            disabled={!markdownText}
          >
            Save
          </AppButton>
          <Flex gap={'10px'}>
            {type === TYPE_MODAL.EDIT && (
              <AppButton
                onClick={(
                  e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
                ) => handleRemoveItem(e)}
                size="sm"
                className="btn-remove"
                variant={'cancel'}
              >
                Remove this widget
              </AppButton>
            )}
            <AppButton
              onClick={onClose}
              size="sm"
              className="btn-remove"
              variant={'cancel'}
            >
              Cancel
            </AppButton>
          </Flex>
        </Flex>
      </div>
    </BaseModal>
  );
};

export default ModalAddTextWidget;
