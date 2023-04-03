import { Flex, Text, Textarea } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction } from 'react';
import { AppButton, AppField } from 'src/components';
import AppAccordion from 'src/components/AppAccordion';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import BaseModal from './BaseModal';
import { ILayout } from 'src/pages/DashboardDetailPage';
import { debounce } from 'lodash';
import 'src/styles/components/BaseModal.scss';

interface IModalAddTextWidget {
  open: boolean;
  onClose: () => void;
  markdownText: string;
  setMarkdownText: Dispatch<SetStateAction<string>>;
  type?: 'add' | 'edit' | string;
  selectedItem: ILayout;
  dataLayouts: ILayout[];
  setDataLayouts: React.Dispatch<React.SetStateAction<ILayout[]>>;
}

interface IMarkdown {
  title: string;
  mark: JSX.Element;
}

const linkDune = 'https://dune.com';

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
        [Link]<a href={linkDune}>{linkDune}</a>
      </>
    ),
  },
  {
    title: 'Image or GIF',
    mark: (
      <>
        ![image]<a>(https://cutt.ly/1AKJVWx)</a>
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
  markdownText,
  setMarkdownText,
  type,
  dataLayouts,
  setDataLayouts,
  selectedItem,
}) => {
  const DEBOUNCE_TIME = 500;

  const handleSave = async () => {
    try {
      setDataLayouts([
        ...dataLayouts,
        { id: dataLayouts.length + 1, i: markdownText, x: 0, y: 0, w: 6, h: 2 },
      ]);
      setMarkdownText('');
      onClose();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const handleUpdate = (id: number) => {
    try {
      setDataLayouts(
        dataLayouts.map((item) =>
          item.id === id ? { ...item, i: markdownText } : item,
        ),
      );
      setMarkdownText('');
      onClose();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const handleRemoveItem = (
    id: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    try {
      e.preventDefault();
      setDataLayouts(dataLayouts.filter((item) => item.id !== id));
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
          type === 'add' ? handleSave() : handleUpdate(selectedItem.id);
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
        onClick={(e) => handleRemoveItem(selectedItem.id, e)}
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
            defaultValue={type === 'add' ? '' : selectedItem.i}
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
          justifyContent={type === 'add' ? '' : 'space-between'}
        >
          <ButtonSave />
          {type === 'add' ? (
            <ButtonCancel />
          ) : (
            <div>
              <ButtonRemoveWidget />
              <ButtonCancel />
            </div>
          )}
        </Flex>
      </div>
    </BaseModal>
  );
};

export default ModalAddTextWidget;
