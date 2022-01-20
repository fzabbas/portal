import { useState, useEffect, useReducer } from "react";
import * as Y from "yjs";
import { v4 as uuidv4 } from "uuid";
import TextEditor from "../TextEditor/TextEditor";
import { WebrtcProvider } from "y-webrtc";
import "./Portal.scss";
import axios from "axios";

const yDoc = new Y.Doc();
let provider = new WebrtcProvider("example-dxocument3", yDoc);
const API_URL = `http://localhost:8080`;

export default function Portal() {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const renderElement = () => {
    const id = uuidv4();
    const map = yDoc.getMap("elements"); // elements meta deta
    // setting elements meta data, more infor may have to be stored
    map.set(id, {
      container: "toAdd",
      x_pos: "",
      y_pos: "",
    });
    // setYDoc(yDoc);
    // let a = 1;
    forceUpdate();
  };

  const onDragStart = (e, key) => {
    e.dataTransfer.setData("id", key);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, section) => {
    let id = e.dataTransfer.getData("id");
    let elementsMap = yDoc.getMap("elements");
    elementsMap.set(id, {
      container: section,
      x_pos: e.pageX - 32,
      y_pos: e.pageY - 80,
    });
    forceUpdate();
    // setYDoc(yDoc);
  };
  useEffect(() => {
    console.log("use effect is run");
    yDoc.on("afterTransaction", () => {
      forceUpdate();
      // setYDoc(yDoc);
    });
  }, []);

  const removeElement = (e, id) => {
    e.preventDefault();
    yElements.delete(id);
  };

  const savePortal = (e) => {
    e.preventDefault();
    const yDocByte = Y.encodeStateAsUpdate(yDoc);
    axios
      .post(`API_URL/post`, { yDocByteArray: yDocByte })
      .then((resp) => resp.data);
  };

  let elements = {
    toAdd: [],
    inPortal: [],
  };
  let yElements = yDoc.getMap("elements");
  yElements.forEach((el, id) => {
    elements[el.container].push(
      <div
        key={id}
        onDragStart={(e) => onDragStart(e, id)}
        draggable
        style={{ top: el.y_pos, left: el.x_pos }}
        className={`element ${el.container}`}
      >
        <button
          className="element__delete"
          onClick={(e) => removeElement(e, id)}
        >
          x
        </button>
        <TextEditor id={id} yDoc={yDoc} forceUpdate={forceUpdate} />
      </div>
    );
  });

  return (
    <main className="portal-page">
      <section className="portal">
        <h1>My Portal</h1>
        <div
          className="in-portal"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, "inPortal")}
        >
          {elements.inPortal}
        </div>
      </section>
      <section
        className="add-elements"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "toAdd")}
      >
        <h1>Things toAdd:</h1>
        <button onClick={renderElement}>Add Text</button>
        {elements.toAdd}
      </section>
      <button onClick={savePortal}>Save Portal</button>
    </main>
  );
}
