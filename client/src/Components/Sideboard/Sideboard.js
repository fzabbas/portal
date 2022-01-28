import { useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import * as Y from "yjs";

import textIcon from "../../assets/icons/text.svg";
import imageIcon from "../../assets/icons/image.svg";
import addIcon from "../../assets/icons/add-square.svg";
import minimizeIcon from "../../assets/icons/minimize.svg";
import plusIcon from "../../assets/icons/plus.svg";

import "./Sideboard.scss";

export default function Sideboard({ onDragOver, onDrop, elements, yDoc }) {
  const [toAddImage, setToAddImage] = useState(false);
  const [isSideboardVisible, setIsSideboardVisible] = useState(true);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const renderText = () => {
    const id = uuidv4();
    const map = yDoc.getMap("elements"); // elements meta deta
    // setting elements meta data, more infor may have to be stored
    const yMapNested = new Y.Map();
    map.set(id, yMapNested);
    yMapNested.set("container", "toAdd");
    yMapNested.set("x_pos", "");
    yMapNested.set("y_pos", "");

    // map.set(id, {
    //   container: "toAdd",
    //   x_pos: "",
    //   y_pos: "",
    // });
    forceUpdate();
  };

  const renderImage = (e) => {
    e.preventDefault();
    const id = uuidv4();
    const url = e.target.imageURL.value;
    if (url) {
      const map = yDoc.getMap("elements"); // elements meta deta
      const yMapNested = new Y.Map();
      map.set(id, yMapNested);
      yMapNested.set("container", "toAdd");
      yMapNested.set("x_pos", "");
      yMapNested.set("y_pos", "");
      yMapNested.set("src", url);
      // map.set(id, {
      //   container: "toAdd",
      //   x_pos: "",
      //   y_pos: "",
      //   src: url,
      // });
      forceUpdate();
    }
    setToAddImage(false);
  };
  return (
    <>
      <section className="sideboard sideboard--minimized">
        <button
          className="button sideboard__minimize-btn"
          onClick={() => {
            setIsSideboardVisible(!isSideboardVisible);
          }}
        >
          <img
            className="sideboard__minimize-icon"
            src={plusIcon}
            alt="minimize"
          />
        </button>
      </section>
      <section
        className="sideboard"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "toAdd")}
        style={!isSideboardVisible ? { visibility: "hidden" } : {}}
      >
        <button
          className="button sideboard__minimize-btn"
          onClick={() => {
            setIsSideboardVisible(!isSideboardVisible);
          }}
        >
          <img
            className="sideboard__minimize-icon"
            src={minimizeIcon}
            alt="minimize"
          />
        </button>
        <div className="sideboard__header">
          <h2 className="sideboard__heading">Sideboard</h2>
          <div>
            <button className="button" onClick={renderText}>
              <img src={textIcon} alt="text-icon" />
            </button>
            <button
              className="button"
              onClick={() => setToAddImage(!toAddImage)}
            >
              <img src={imageIcon} alt="image-icon" />
            </button>
          </div>
        </div>
        {toAddImage ? (
          <form className="sideboard__add-image-form" onSubmit={renderImage}>
            <input
              className="sideboard__add-image-input"
              type="text"
              name="imageURL"
              placeholder="Add image URL..."
            />
            <button className="button">
              <img src={addIcon} alt="add-icon" />
            </button>
          </form>
        ) : (
          <></>
        )}
        {elements.toAdd}
      </section>
    </>
  );
}
