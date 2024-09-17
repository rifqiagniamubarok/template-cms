import { AiFillCaretDown } from 'react-icons/ai';
import { BsBraces, BsCode, BsImage, BsListOl, BsListUl, BsTypeBold, BsTypeItalic, BsTypeStrikethrough, BsTypeUnderline } from 'react-icons/bs';
import { RiDoubleQuotesL } from 'react-icons/ri';

import { getFocusedEditor } from '../EditorUtils';
import ButtonToolbar from './Button';
import DropdownOptions from './DropdownOptions';
import GalleryModal from '../../GalleryModal';
import { Divider, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { Bold, Braces, Code, ImagePlus, Italic, List, ListOrdered, Quote, Strikethrough, Underline } from 'lucide-react';
import { useState } from 'react';

const Toolbar = ({ editor }) => {
  const { isOpen: isOpenImage, onOpen: onOpenImage, onOpenChange: onOpenChangeImage, onClose: onCloseImage } = useDisclosure();
  const [textOption, setTextOption] = useState('4');

  if (!editor) return <></>;

  const handleInputImage = () => {
    onOpenImage();
  };

  const handleUseImage = ({ src, id, slug }) => {
    editor?.chain().focus().setImage({ src, alt: slug }).run();
  };

  const textOptions = [
    {
      key: 1,
      label: 'Heading 1',
      fn: () => getFocusedEditor(editor).toggleHeading({ level: 1 }).run(),
    },
    {
      key: 2,
      label: 'Heading 2',
      fn: () => getFocusedEditor(editor).toggleHeading({ level: 2 }).run(),
    },
    {
      key: 3,
      label: 'Heading 3',
      fn: () => getFocusedEditor(editor).toggleHeading({ level: 3 }).run(),
    },
    {
      key: 4,
      label: 'Paragraph',
      fn: () => getFocusedEditor(editor).setParagraph().run(),
    },
  ];
  return (
    <>
      <GalleryModal isOpen={isOpenImage} onOpen={onOpenImage} onOpenChange={onOpenChangeImage} onClose={onCloseImage} onSelect={handleUseImage} />
      <div className="w-full">
        <div className="flex items-center h-fit gap-x-4 gap-y-2\ flex-wrap">
          <Select
            placeholder="Select "
            onChange={({ target }) => {
              const getOption = textOptions.find(({ key }) => key == target.value);
              getOption.fn();
              setTextOption(target.value);
            }}
            className="max-w-[200px]"
            size="sm"
            variant="faded"
            defaultSelectedKeys={textOption}
            selectedKeys={textOption}
            color="primary"
          >
            {textOptions.map(({ label, key }, index) => (
              <SelectItem key={key}>{label}</SelectItem>
            ))}
          </Select>
          <Divider orientation="vertical" className="h-4" />
          <div className="flex items-center space-x-1">
            <Button variant={editor.isActive('bold') ? 'solid' : 'faded'} onClick={() => getFocusedEditor(editor).toggleBold().run()} isIconOnly color="primary" size="sm">
              <Bold size={14} />
            </Button>
            <Button variant={editor.isActive('italic') ? 'solid' : 'faded'} onClick={() => getFocusedEditor(editor).toggleItalic().run()} isIconOnly color="primary" size="sm">
              <Italic size={14} />
            </Button>
            <Button
              variant={editor.isActive('underline') ? 'solid' : 'faded'}
              onClick={() => getFocusedEditor(editor).toggleUnderline().run()}
              isIconOnly
              color="primary"
              size="sm"
            >
              <Underline size={14} />
            </Button>
            <Button variant={editor.isActive('strike') ? 'solid' : 'faded'} onClick={() => getFocusedEditor(editor).toggleStrike().run()} isIconOnly color="primary" size="sm">
              <Strikethrough size={14} />
            </Button>
          </div>
          <Divider orientation="vertical" className="h-4" />
          <div className="flex items-center space-x-2">
            <Button
              variant={editor.isActive('blockquote') ? 'solid' : 'faded'}
              onClick={() => getFocusedEditor(editor).toggleBlockquote().run()}
              isIconOnly
              color="primary"
              size="sm"
            >
              <Quote size={14} />
            </Button>
            <Button variant={editor.isActive('code') ? 'solid' : 'faded'} onClick={() => getFocusedEditor(editor).toggleCode().run()} isIconOnly color="primary" size="sm">
              <Code size={14} />
            </Button>
            <Button
              variant={editor.isActive('codeBlock') ? 'solid' : 'faded'}
              onClick={() => getFocusedEditor(editor).toggleCodeBlock().run()}
              isIconOnly
              color="primary"
              size="sm"
            >
              <Braces size={14} />
            </Button>
            <Button
              variant={editor.isActive('orderedList') ? 'solid' : 'faded'}
              onClick={() => getFocusedEditor(editor).toggleOrderedList().run()}
              isIconOnly
              color="primary"
              size="sm"
            >
              <ListOrdered size={14} />
            </Button>
            <Button
              variant={editor.isActive('bulletList') ? 'solid' : 'faded'}
              onClick={() => getFocusedEditor(editor).toggleBulletList().run()}
              isIconOnly
              color="primary"
              size="sm"
            >
              <List size={14} />
            </Button>

            <Button variant={'faded'} onClick={handleInputImage} isIconOnly color="primary" size="sm">
              <ImagePlus size={14} />
            </Button>
          </div>
        </div>
        <Divider className="my-4" />
      </div>
    </>
  );
};

export default Toolbar;
