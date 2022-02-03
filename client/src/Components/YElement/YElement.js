import { useResizeDetector } from "react-resize-detector";
import { useCallback } from "react";

import TextEditor from "../TextEditor/TextEditor";
import deleteIcon from "../../assets/icons/delete.svg";
import linksIcon from "../../assets/icons/links-line.svg";
import "./YElement.scss";

export default function YElement({
  id,
  el,
  removeElement,
  yDoc,
  forceUpdate,
  provider,
}) {
  const onResize = useCallback(() => {
    let elementsMap = yDoc.get("elements");
    let element = elementsMap.get(id);
    element.set("width", ref.current.offsetWidth);
    element.set("height", ref.current.offsetHeight);
  }, []);

  const onDragStart = (e, key) => {
    e.dataTransfer.setData("startX", e.pageX);
    e.dataTransfer.setData("startY", e.pageY);
    e.dataTransfer.setData("id", key);
  };

  const { _width, _height, ref } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 25,
    onResize,
  });

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
              width: el.get("width"),
              height: el.get("height"),
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
      {/* creates image or link */}
      {el.get("src") ? (
        el.get("hrefName") ? (
          <a className="element__link" href={el.get("src")} target={"_blank"}>
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
        // creates text element
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
