import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import Placeholder from "@tiptap/extension-placeholder";
import "./TextEditor.scss";

export default function TextEditor({ content, id, yDoc, placehoderText }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: yDoc,
        field: id,
      }),
      Placeholder.configure({
        placeholder: placehoderText || "Add text...",
      }),
    ],
    content: content,
  });

  return <EditorContent editor={editor} />;
}
