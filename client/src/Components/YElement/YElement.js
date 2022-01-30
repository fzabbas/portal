import { useResizeDetector } from "react-resize-detector";

import TextEditor from "../TextEditor/TextEditor";
import deleteIcon from "../../assets/icons/delete.svg";
import linksIcon from "../../assets/icons/links-line.svg";
import "./YElement.scss";
import { useCallback } from "react";

export default function YElement({
  id,
  el,
  removeElement,
  yDoc,
  forceUpdate,
  provider,
}) {
  const onResize = useCallback((width, height) => {
    let elementsMap = yDoc.get("elements");
    let element = elementsMap.get(id);
    element.set("width", width);
    element.set("height", height);
  }, []);

  const { width, height, ref } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 25,
    onResize,
  });

  const onDragStart = (e, key) => {
    e.dataTransfer.setData("startX", e.pageX);
    e.dataTransfer.setData("startY", e.pageY);
    e.dataTransfer.setData("id", key);
  };

  return (
    <div
      ref={ref}
      onDragStart={(e) => onDragStart(e, id)}
      draggable
      style={
        el.get("container") === "toAdd"
          ? {}
          : {
              top: el.get("y_pos"),
              left: el.get("x_pos"),
              width: el.get("width") + 8,
              height: el.get("height") + 8,
            }
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
        el.get("hrefName") ? (
          <a className="element__link" href={el.get("src")}>
            <img className="element__delete-icon" src={linksIcon} alt="link" />
            {el.get("hrefName")}
          </a>
        ) : (
          <img
            className="element__image"
            src={el.get("src")}
            alt={el.get("src")}
          />
        )
      ) : (
        <TextEditor
          id={id}
          yDoc={yDoc}
          forceupdate={forceUpdate}
          provider={provider}
        />
      )}
    </div>
  );
}
