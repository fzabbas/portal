import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import Placeholder from "@tiptap/extension-placeholder";
import "./TextEditor.scss";

// tiptap extensions for menu
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import CodeBlock from "@tiptap/extension-code-block";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

// icons
import boldIcon from "../../assets/icons/bold.svg";
import italicIcon from "../../assets/icons/italic.svg";
import h1Icon from "../../assets/icons/h-1.svg";
import h2Icon from "../../assets/icons/h-2.svg";
import h3Icon from "../../assets/icons/h-3.svg";
import listIcon from "../../assets/icons/list-unordered.svg";
import codeIcon from "../../assets/icons/code.svg";
import highlighterIcon from "../../assets/icons/highlighter.svg";

export default function TextEditor({ content, id, yDoc, placehoderText }) {
  const [menuHover, setMenuHover] = useState(false);

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
      Bold,
      Italic,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      ListItem,
      Highlight,
      TextStyle,
      Color,
    ],
    content: content,
  });

  const handleClick = (e) => {
    e.preventDefault();
    editor.setEditable(true);
  };

  // editor.setEditable(editor.isFocused || menuHover);

  const removeEditable = (e) => {
    if (!menuHover) editor.setEditable(false);
  };

  return (
    <div>
      <EditorContent
        onBlur={removeEditable}
        onClick={handleClick}
        editor={editor}
      />
      {editor && (editor.isFocused || menuHover) ? (
        // {editor ? (
        <div
          className="menu"
          onMouseEnter={() => setMenuHover(true)}
          onMouseLeave={() => setMenuHover(false)}
        >
          <input
            type="color"
            className="menu__btn--color icon icon--color"
            onInput={(event) =>
              editor.chain().focus().setColor(event.target.value).run()
            }
            value={editor.getAttributes("textStyle").color}
          />
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor.isActive("italic") ? "menu__btn--active" : "menu__btn"
            }
          >
            <img className="icon" src={italicIcon} alt="bold icon" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editor.isActive("bold") ? "menu__btn--active" : "menu__btn"
            }
          >
            <img className="icon" src={boldIcon} alt="bold icon" />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 })
                ? "menu__btn--active"
                : "menu__btn"
            }
          >
            <img className="icon" src={h1Icon} alt="heading-1 icon" />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 })
                ? "menu__btn--active"
                : "menu__btn"
            }
          >
            <img className="icon" src={h2Icon} alt="heading-2 icon" />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 })
                ? "menu__btn--active"
                : "menu__btn"
            }
          >
            <img className="icon" src={h3Icon} alt="heading-3 icon" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive("bulletList") ? "menu__btn--active" : "menu__btn"
            }
          >
            <img className="icon" src={listIcon} alt="list icon" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={
              editor.isActive("codeBlock") ? "menu__btn--active" : "menu__btn"
            }
          >
            <img className="icon" src={codeIcon} alt="list icon" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={
              editor.isActive("highlight") ? "menu__btn--active" : "menu__btn"
            }
          >
            <img
              className="icon icon--highlighter"
              src={highlighterIcon}
              alt="list icon"
            />
          </button>
        </div>
      ) : (
        <></>
      )}

      {/* <EditorContent
        onBlur={removeEditable}
        onClick={handleClick}
        editor={editor}
      /> */}
    </div>
  );
}
