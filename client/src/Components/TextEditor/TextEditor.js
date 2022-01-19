import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";

export default function TextEditor({ content, id, yDoc }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: yDoc,
        field: id,
      }),
    ],
    content,
  });
  return <EditorContent editior={editor} />;
}
