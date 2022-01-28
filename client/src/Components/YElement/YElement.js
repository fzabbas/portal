import { useResizeDetector } from "react-resize-detector";

import TextEditor from "../TextEditor/TextEditor";
import deleteIcon from "../../assets/icons/delete.svg";
import "./YElement.scss";

export default function YElement({ id, el, removeElement, yDoc, forceUpdate }) {
  const onDragStart = (e, key) => {
    e.dataTransfer.setData("startX", e.pageX);
    e.dataTransfer.setData("startY", e.pageY);
    e.dataTransfer.setData("id", key);
  };
  return (
    <div
      onDragStart={(e) => onDragStart(e, id)}
      draggable
      style={
        el.get("container") === "toAdd"
          ? {}
          : { top: el.get("y_pos"), left: el.get("x_pos") }
      }
      className={`element ${el.get("container")}`}
    >
      <button className="element__delete" onClick={(e) => removeElement(e, id)}>
        <img
          className="element__delete-icon"
          src={deleteIcon}
          alt="delete icon"
        />
      </button>
      {el.get("src") ? (
        <img
          className="element__image"
          src={el.get("src")}
          alt={el.get("src")}
        />
      ) : (
        <TextEditor id={id} yDoc={yDoc} forceupdate={forceUpdate} />
      )}
    </div>
  );
}
