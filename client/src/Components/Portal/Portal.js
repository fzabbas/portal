import { useState, useEffect, useReducer } from "react";
import * as Y from "yjs";
import { v4 as uuidv4 } from "uuid";
import TextEditor from "../TextEditor/TextEditor";
import { WebrtcProvider } from "y-webrtc";
import "./Portal.scss";
import axios from "axios";
import { useParams } from "react-router-dom";

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

  let { key } = useParams();
  useEffect(() => {
    console.log("use effect is run");
    axios
      // other type could be arrayBuffer
      .get(`${API_URL}/portal/${key}`, { responseType: "blob" })
      .then((resp) => {
        resp.data.arrayBuffer().then((buffer) => {
          const backendUint8 = new Uint8Array(buffer);
          Y.applyUpdate(yDoc, backendUint8);
        });
      });
    yDoc.on("afterTransaction", () => {
      forceUpdate();
    });
  }, []);

  const removeElement = (e, id) => {
    e.preventDefault();
    yElements.delete(id);
  };

  // const base64Encode = (arraybuffer) => {
  //   return btoa(String.fromCharCode.apply(null, arraybuffer));
  // };

  const makePortal = (name, password) => {
    const yDocByte = Y.encodeStateAsUpdate(yDoc);
    const yDocBlob = new Blob([yDocByte]);
    let formData = new FormData();
    formData.append("portalName", name);
    formData.append("password", key);
    formData.append("portalDoc", yDocBlob);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return axios
      .post(`${API_URL}/portal`, formData, config)
      .then((resp) => console.log(resp));
  };

  const savePortal = (e) => {
    e.preventDefault();
    makePortal("portal sample name", "portalpassword");
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
