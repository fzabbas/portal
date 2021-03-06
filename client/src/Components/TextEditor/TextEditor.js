import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Placeholder from "@tiptap/extension-placeholder";
import "./TextEditor.scss";

// tiptap extensions for menu
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

export default function TextEditor({
  content,
  id,
  yDoc,
  placehoderText,
  className,
  isHeading,
  provider,
}) {
  const [menuHover, setMenuHover] = useState(false);
  const [colorHover, setColorHover] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        heading: {
          levels: [1, 2, 3],
        },
        bold: true,
        italic: true,
        listItem: true,
      }),
      Collaboration.configure({
        document: yDoc,
        field: `textEditor-${id}`,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: "  ",
          color: `#${((Math.random() * 0xffffff) << 0)
            .toString(16)
            .padStart(6, "0")}`,
        },
      }),
      Placeholder.configure({
        placeholder: placehoderText || "Add text...",
      }),
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

  const removeEditable = (e) => {
    if (!menuHover) editor.setEditable(false);
  };

  return (
    <div className={className}>
      <EditorContent
        onBlur={removeEditable}
        onClick={handleClick}
        editor={editor}
      />
      {editor && (editor.isFocused || menuHover || colorHover) ? (
        <div
          className="menu"
          onMouseEnter={() => setMenuHover(true)}
          onMouseLeave={() => setMenuHover(false)}
        >
          {/* color button */}
          <input
            onFocus={() => setColorHover(true)}
            onBlur={() => setColorHover(false)}
            type="color"
            className={"icon icon--color"}
            onInput={(event) =>
              editor.chain().focus().setColor(event.target.value).run()
            }
            value={editor.getAttributes("textStyle").color || "#000000"}
          />

          {/* italic button */}
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor.isActive("italic") ? "menu__btn--active" : "menu__btn"
            }
          >
            <img className="icon" src={italicIcon} alt="bold icon" />
          </button>

          {/* Bold button */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editor.isActive("bold") ? "menu__btn--active" : "menu__btn"
            }
          >
            <img className="icon" src={boldIcon} alt="bold icon" />
          </button>

          {/* Heading 1 */}
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

          {/* Headin 2 */}
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

          {/* Heading 3 */}
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

          {/* Bullet Lsit */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive("bulletList") ? "menu__btn--active" : "menu__btn"
            }
          >
            <img className="icon" src={listIcon} alt="list icon" />
          </button>

          {/* Code block */}
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={
              editor.isActive("codeBlock") ? "menu__btn--active" : "menu__btn"
            }
          >
            <img className="icon" src={codeIcon} alt="list icon" />
          </button>

          {/* Highlight Text */}
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
    </div>
  );
}
