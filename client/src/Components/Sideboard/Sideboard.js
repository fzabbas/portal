import { useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import * as Y from "yjs";

import textIcon from "../../assets/icons/text.svg";
import imageIcon from "../../assets/icons/image.svg";
import addIcon from "../../assets/icons/add-square.svg";
import plusIcon from "../../assets/icons/plus.svg";
import minusIcon from "../../assets/icons/minimize.svg";
import linksIcon from "../../assets/icons/links.svg";

import "./Sideboard.scss";

export default function Sideboard({ onDragOver, onDrop, elements, yDoc }) {
  const [toAddImage, setToAddImage] = useState(false);
  const [toAddLink, setToAddLink] = useState(false);
  const [showSideboard, setShowSideboard] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [isValidLink, setIsValidLink] = useState(true);
  const [isValidImageLink, setIsValidImageLink] = useState(true);

  const renderText = () => {
    const id = uuidv4();
    const map = yDoc.getMap("elements"); // elements meta deta
    // setting elements meta data, more infor may have to be stored
    const yMapNested = new Y.Map();
    yDoc.transact(() => {
      map.set(id, yMapNested);
      yMapNested.set("container", "toAdd");
      yMapNested.set("x_pos", "");
      yMapNested.set("y_pos", "");
      yMapNested.set("width", 160);
      yMapNested.set("height", 112);
    });
    forceUpdate();
  };

  const isValidURL = (string) => {
    let validString = /^https?:\/\/(.*\.)+.+$/;
    return string.match(validString);
  };

  const renderImage = (e) => {
    e.preventDefault();
    const id = uuidv4();
    const url = e.target.imageURL.value;
    setIsValidImageLink(isValidURL(url));
    if (url && isValidURL(url)) {
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
      setToAddImage(false);
    }
  };

  const renderLink = (e) => {
    e.preventDefault();
    const id = uuidv4();
    const url = e.target.linkURL.value;
    const urlName = e.target.linkName.value;
    setIsValidLink(isValidURL(url));
    if (url && urlName && isValidURL(url)) {
      const map = yDoc.getMap("elements"); // elements meta deta
      const yMapNested = new Y.Map();
      yDoc.transact(() => {
        map.set(id, yMapNested);
        yMapNested.set("container", "toAdd");
        yMapNested.set("x_pos", "");
        yMapNested.set("y_pos", "");
        yMapNested.set("src", url);
        yMapNested.set("hrefName", urlName);
        yMapNested.set("width", 160);
        yMapNested.set("height", 112);
      });
      forceUpdate();
      setToAddLink(false);
    }
  };

  return (
    <>
      <section
        style={showSideboard ? { marginRight: 0 } : { marginRight: "-13rem" }}
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
            <button
              className="sideboard__button"
              onClick={() => setToAddLink(!toAddLink)}
            >
              <img
                className="sideboard__link-icon"
                src={linksIcon}
                alt="image-icon"
              />
            </button>
          </div>
        </div>
        {toAddImage ? (
          <form className="sideboard__add-form" onSubmit={renderImage}>
            <input
              className="sideboard__add-input"
              type="text"
              name="imageURL"
              placeholder={"Add image URL..."}
            />
            {!isValidImageLink ? (
              <p className="sideboard__form-validity">Invalid URL</p>
            ) : (
              <></>
            )}
            <button className="sideboard__button">
              <img src={addIcon} alt="add-icon" />
            </button>
          </form>
        ) : (
          <></>
        )}
        {toAddLink ? (
          <form className="sideboard__add-form" onSubmit={renderLink}>
            <input
              className="sideboard__add-input"
              type="text"
              name="linkName"
              placeholder={"Name of the link"}
            />
            <input
              className="sideboard__add-input"
              type="text"
              name="linkURL"
              placeholder={"https:// or http://"}
            />
            {!isValidLink ? (
              <p className="sideboard__form-validity">Invalid URL</p>
            ) : (
              <></>
            )}
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
