import { Box, Flex, Text, Textarea } from '@chakra-ui/react';
import _, { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { AppButton, AppField } from 'src/components';
import AppAccordion from 'src/components/AppAccordion';
import {
  ILayout,
  TYPE_MODAL,
  WIDGET_TYPE,
} from 'src/pages/WorkspacePage/parts/Dashboard';
import 'src/styles/components/BaseModal.scss';
import { toastSuccess } from 'src/utils/utils-notify';
import BaseModal from '../BaseModal';
import { INPUT_DEBOUNCE } from 'src/utils/common';
import { RadioChecked, RadioNoCheckedIcon } from '../../assets/icons';
import { WIDTH_DASHBOARD, TOTAL_COL } from './ModalAddVisualization';
import config from 'src/config';

interface IModalAddTextWidget {
  open: boolean;
  type?: TYPE_MODAL.ADD | TYPE_MODAL.EDIT | string;
  selectedItem: ILayout;
  dataLayouts: ILayout[];
  onClose: () => void;
  onSave: (layouts: ILayout[]) => void;
}

interface IMarkdown {
  title: string;
  mark: JSX.Element;
}

const linkBlocklens = config.homePage;
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
  {
    title: 'Horizontal rule',
    mark: (
      <>
        (Add new line) <br />
        ---
      </>
    ),
  },
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
  type,
  dataLayouts,
  selectedItem,
  onClose,
  onSave,
}) => {
  const [markdownText, setMarkdownText] = useState<string>('');
  const [widthWidget, setWidthWidget] = useState<number>(TOTAL_COL / 2);

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

    const newId = Date.now().toString();
    const newTextWidget = {
      x: +sizeX,
      y: +sizeY,
      w: widthWidget,
      h: 2,
      i: newId,
      id: newId,
      type: WIDGET_TYPE.TEXT,
      text: markdownText,
      content: {},
    };

    onSave([...dataLayouts, newTextWidget]);
    onClose();
    toastSuccess({ message: 'Add successfully' });
  };

  const handleUpdate = async () => {
    const newDataLayouts = [...dataLayouts];
    const index = newDataLayouts.findIndex(
      (item) => item.id === selectedItem.id,
    );
    if (index < 0) {
      return;
    }
    newDataLayouts[index] = {
      ...newDataLayouts[index],
      w: widthWidget,
      text: markdownText,
    };

    onSave(newDataLayouts);
    onClose();
    toastSuccess({ message: 'Update successfully' });
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

        <Flex
          pt={5}
          fontSize={'14px'}
          alignItems={{ base: 'flex-start', md: 'center' }}
        >
          Width:
          <Flex
            ml={{ base: 2, md: 3 }}
            flexDirection={{ base: 'column', md: 'row' }}
          >
            {WIDTH_DASHBOARD.map((item, index) => {
              return (
                <Flex
                  mr={{ base: 2, md: 3 }}
                  onClick={() => setWidthWidget(item.col)}
                  cursor={'pointer'}
                  key={index}
                  mb={{ base: 3, md: 0 }}
                >
                  {widthWidget === item.col ? (
                    <RadioChecked />
                  ) : (
                    <RadioNoCheckedIcon />
                  )}
                  <Flex ml={2} alignItems={'center'}>
                    {item.name}{' '}
                    <Box as={'span'} fontSize={'14px'} ml={1}>
                      ({item.width})
                    </Box>
                  </Flex>
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
            isDisabled={!markdownText.trim()}
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
