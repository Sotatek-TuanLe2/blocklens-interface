import { Box, Flex, Text, Textarea } from '@chakra-ui/react';
import _, { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { AppButton, AppField } from 'src/components';
import AppAccordion from 'src/components/AppAccordion';
import { ILayout, TYPE_MODAL } from 'src/pages/WorkspacePage/parts/Dashboard';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/BaseModal.scss';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import BaseModal from '../BaseModal';
import { IDashboardDetail, ITextWidget } from 'src/utils/query.type';
import { INPUT_DEBOUNCE } from 'src/utils/common';
import { RadioChecked, RadioNoCheckedIcon } from '../../assets/icons';
import { WIDTH_DASHBOARD, TOTAL_COL } from './ModalAddVisualization';

interface IModalAddTextWidget {
  open: boolean;
  onClose: () => void;
  type?: TYPE_MODAL.ADD | TYPE_MODAL.EDIT | string;
  selectedItem: ILayout;
  dataLayouts: ILayout[];
  onReload: () => Promise<void>;
  dataDashboard?: IDashboardDetail;
}

interface IMarkdown {
  title: string;
  mark: JSX.Element;
}

const linkBlocklens = 'https://stg-console.blocklens.io/';
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
        [Link]<a href={linkBlocklens}>({linkBlocklens})</a>
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
  selectedItem,
  onReload,
  dataDashboard,
}) => {
  const [markdownText, setMarkdownText] = useState<string>('');
  const [widthWidget, setWidthWidget] = useState<number>(TOTAL_COL / 4);

  useEffect(() => {
    setMarkdownText(selectedItem.text || '');
  }, [selectedItem]);

  const handleSave = async (widthWidget: number) => {
    const lastLayout = _.maxBy(dataLayouts, 'y');
    const currentY = lastLayout?.y || 0;
    const listWidgetCurrent = dataLayouts.filter(
      (layout) => layout.y === currentY,
    );

    const totalWidthWidget = _.sumBy(listWidgetCurrent, 'w');

    let sizeX = 0;
    let sizeY = 0;

    if (totalWidthWidget < TOTAL_COL) {
      sizeY = currentY;
      sizeX = totalWidthWidget;
    } else {
      sizeY = currentY + 2;
      sizeX = 0;
    }

    try {
      const payload = {
        dashboardId: dataDashboard?.id,
        text: markdownText,
        options: {
          sizeX: +sizeX,
          sizeY: +sizeY,
          col: widthWidget,
          row: 2,
        },
      };
      const res = await rf
        .getRequest('DashboardsRequest')
        .addDashboardItem(payload);
      if (res) {
        toastSuccess({ message: 'Add successfully' });
        onReload();
        setMarkdownText('');
        onClose();
      }
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };
  const handleUpdate = async () => {
    const newItems = dataDashboard?.textWidgets?.map((i: ITextWidget) => {
      if (i.id === selectedItem.id) {
        return {
          id: selectedItem.id,
          text: markdownText,
        };
      }
      return { ...i };
    });
    try {
      const payload = {
        textWidgets: newItems,
      };
      const res = await rf
        .getRequest('DashboardsRequest')
        .updateDashboardItem(payload, dataDashboard?.id);
      if (res) {
        toastSuccess({ message: 'Update successfully' });
        onReload();
        setMarkdownText('');
        onClose();
      }
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const handleChangeMarkdownText = debounce((event) => {
    setMarkdownText(event.target.value);
  }, INPUT_DEBOUNCE);

  return (
    <BaseModal
      title={type === TYPE_MODAL.ADD ? 'Add Text Widget' : 'Edit Text Widget'}
      isOpen={open}
      onClose={onClose}
      size="md"
    >
      <div className="main-modal-dashboard-details">
        <AppField label={'Text widget context'}>
          <Textarea
            className="text-widget-input"
            resize={'both'}
            size="sm"
            defaultValue={type === TYPE_MODAL.ADD ? '' : selectedItem.text}
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
          className="table-main-markdown"
        />

        <Flex pt={5}>
          Width:
          <Flex ml={{ base: 2, md: 10 }}>
            {WIDTH_DASHBOARD.map((item, index) => {
              return (
                <Flex
                  mr={{ base: 2, md: 10 }}
                  onClick={() => setWidthWidget(item.col)}
                  cursor={'pointer'}
                  key={index}
                >
                  {widthWidget === item.col ? (
                    <RadioChecked />
                  ) : (
                    <RadioNoCheckedIcon />
                  )}
                  <Box ml={2}>{item.name}</Box>
                </Flex>
              );
            })}
          </Flex>
        </Flex>

        <Flex className="modal-footer">
          <AppButton
            mr={2.5}
            size="lg"
            variant={'cancel'}
            onClick={onClose}
            className="btn-cancel"
          >
            Cancel
          </AppButton>
          <AppButton
            size="lg"
            onClick={() => {
              type === TYPE_MODAL.ADD
                ? handleSave(widthWidget)
                : handleUpdate();
            }}
            disabled={!markdownText.trim()}
          >
            {type === TYPE_MODAL.ADD ? 'Add' : 'Save'}
          </AppButton>

          {/* <Flex gap={'10px'}>
            {type === TYPE_MODAL.EDIT && (
              <AppButton
                onClick={(
                  e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
                ) => handleRemoveItem(e)}
                size="sm"
                variant={'cancel'}
              >
                Remove this widget
              </AppButton>
            )}
            <AppButton onClick={onClose} size="sm" variant={'cancel'}>
              Cancel
            </AppButton>
          </Flex> */}
        </Flex>
      </div>
    </BaseModal>
  );
};

export default ModalAddTextWidget;
