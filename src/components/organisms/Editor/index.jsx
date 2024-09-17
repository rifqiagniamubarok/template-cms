import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';

import * as React from 'react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import Toolbar from './Toolbar';
import Paragraph from '@tiptap/extension-paragraph';

const lowlight = createLowlight();

const Editor = ({ onChange }) => {
  const [bodyEditorContent, setBodyEditorContent] = React.useState('');
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Type something...',
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'mx-auto max-h-[300px]',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none max-w-full mx-auto space-y-0.5 leading-none',
      },
    },
    onUpdate: ({ editor }) => {
      // Tangkap konten HTML dari editor setiap ada perubahan
      onChange && onChange(editor.getHTML());
      setBodyEditorContent(editor.getHTML());
    },
  });
  return (
    <div>
      <div className="  bg-white">{editor && <Toolbar editor={editor} onClickImage={() => {}} />}</div>
      <EditorContent id="text-editor" editor={editor} className="overflow-auto " />
      <div className="min-h-[300px] h-[300px]" onClick={() => editor.commands.focus()}></div>
    </div>
  );
};

export default Editor;
