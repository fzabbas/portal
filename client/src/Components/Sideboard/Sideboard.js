import { useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import * as Y from "yjs";

import textIcon from "../../assets/icons/text.svg";
import imageIcon from "../../assets/icons/image.svg";
import addIcon from "../../assets/icons/add-square.svg";
import plusIcon from "../../assets/icons/plus.svg";
import minusIcon from "../../assets/icons/minimize.svg";

import "./Sideboard.scss";

export default function Sideboard({ onDragOver, onDrop, elements, yDoc }) {
  const [toAddImage, setToAddImage] = useState(false);
  const [showSideboard, setShowSideboard] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const renderText = () => {
    const id = uuidv4();
    const map = yDoc.getMap("elements"); // elements meta deta
    // setting elements meta data, more infor may have to be stored
    const yMapNested = new Y.Map();
    yDoc.transact(() => {
      // console.log(yMapNested);
      map.set(id, yMapNested);
      yMapNested.set("container", "toAdd");
      yMapNested.set("x_pos", "");
      yMapNested.set("y_pos", "");
      yMapNested.set("width", 160);
      yMapNested.set("height", 112);
    });
    forceUpdate();
  };

  const renderImage = (e) => {
    e.preventDefault();
    const id = uuidv4();
    const url = e.target.imageURL.value;
    if (url) {
      const map = yDoc.getMap("elements"); // elements meta deta
      const yMapNested = new Y.Map();
      yDoc.transact(() => {
        map.set(id, yMapNested);
        yMapNested.set("container", "toAdd");
        yMapNested.set("x_pos", "");
        yMapNested.set("y_pos", "");
        yMapNested.set("src", url);
        yMapNested.set("width", 160);
        yMapNested.set("height", 112);
      });
      forceUpdate();
    }
    setToAddImage(false);
  };
  return (
    <>
      <section
        style={
          showSideboard ? { "margin-right": 0 } : { "margin-right": "-13rem" }
        }
        className="sideboard"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "toAdd")}
      >
        <div className="sideboard__header">
          <button
            className="sideboard__button sideboard__toggle-btn"
            onClick={() => setShowSideboard(!showSideboard)}
          >
            <img
              className="sideboard__minimize-icon"
              src={showSideboard ? minusIcon : plusIcon}
              alt="minimize"
            />
          </button>
          <h2 className="sideboard__heading">Sideboard</h2>
          <div>
            <button className="sideboard__button" onClick={renderText}>
              <img src={textIcon} alt="text-icon" />
            </button>
            <button
              className="sideboard__button"
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
            <button className="sideboard__button">
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
