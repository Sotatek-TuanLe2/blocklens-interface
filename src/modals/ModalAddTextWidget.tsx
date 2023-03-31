import { Flex, Text, Textarea } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction } from 'react';
import ReactMarkdown from 'react-markdown';
import { AppButton, AppField } from 'src/components';
import AppAccordion from 'src/components/AppAccordion';
import 'src/styles/components/BaseModal.scss';
import BaseModal from './BaseModal';

interface IModalAddTextWidget {
  open: boolean;
  onClose: () => void;
  markdownText: string;
  setMarkdownText: Dispatch<SetStateAction<string>>;
}

const linkDude = 'https://dune.com';

const MarkdownSupport = [
  { title: 'Bold', mark: <b>**text**</b> },
  { title: 'Italic', mark: <i>_text_</i> },
  { title: 'Heading 1', mark: <># Text</> },
  { title: 'Heading 2', mark: <>## Text</> },
  { title: 'Heading 3', mark: <> ### Text</> },
  {
    title: 'Link',
    mark: (
      <>
        [Link]<a href={linkDude}>{linkDude}</a>
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
  { title: 'Code block', mark: <>``` code block ```</> },
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
}) => {
  return (
    <BaseModal isOpen={open} onClose={onClose} size="md">
      <div className="main-modal-dashboard-details">
        <AppField label={'Text widget context'}>
          <Textarea
            resize={'both'}
            size="sm"
            h={'150px'}
            borderRadius={'0.5rem'}
            value={markdownText}
            onChange={(e) => setMarkdownText(e.target.value)}
          />
        </AppField>

        <AppAccordion
          content={() => (
            <div>
              {MarkdownSupport.map((item) => (
                <Flex key={item.title} gap={'20px'} className="main-markdown">
                  <Text w={'160px'}>{item.title}</Text>
                  <Text w={'100%'}>{item.mark}</Text>
                </Flex>
              ))}
            </div>
          )}
          title={'Some markdown is supported'}
        />
        <ReactMarkdown>{markdownText}</ReactMarkdown>

        <Flex flexWrap={'wrap'} gap={'10px'} mt={10}>
          <AppButton size="sm" bg="#1e1870" color="#fff">
            Save
          </AppButton>
          <AppButton
            onClick={onClose}
            size="sm"
            bg="#e1e1f9"
            color="#1e1870"
            variant={'cancel'}
          >
            Cancel
          </AppButton>
        </Flex>
      </div>
    </BaseModal>
  );
};

export default ModalAddTextWidget;
