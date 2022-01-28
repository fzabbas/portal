import { useState, useEffect, useReducer, useCallback } from "react";
import { useParams } from "react-router-dom";
import { WebrtcProvider } from "y-webrtc";
import debounce from "lodash.debounce";
import axios from "axios";
import * as Y from "yjs";
import TextEditor from "../TextEditor/TextEditor";
import "./Portal.scss";
import Sideboard from "../Sideboard/Sideboard";
import YElement from "../YElement/YElement";

// const yDoc = new Y.Doc();
// let provider = new WebrtcProvider("example-document15", yDoc);
const API_URL = `http://${location.hostname}:8080`;

export default function Portal() {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  let { key } = useParams();
  const [yDoc, setYDoc] = useState(new Y.Doc());

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, section) => {
    let id = e.dataTransfer.getData("id");
    let elementsMap = yDoc.getMap("elements");
    let nestedElementsMap = elementsMap.get(id);
    let initialX = nestedElementsMap.get("x_pos");
    let initialY = nestedElementsMap.get("y_pos");
    nestedElementsMap.set("container", section);
    if (typeof initialX === "string") {
      nestedElementsMap.set("x_pos", e.pageX);
      nestedElementsMap.set("y_pos", e.pageY);
    } else {
      nestedElementsMap.set(
        "x_pos",
        initialX + (e.pageX - e.dataTransfer.getData("startX"))
      );
      nestedElementsMap.set(
        "y_pos",
        initialY + (e.pageY - e.dataTransfer.getData("startY"))
      );
    }
    forceUpdate();
  };

  const putToDb = (yDocToPut) => {
    console.log("puttin");
    const yDocByte = Y.encodeStateAsUpdate(yDocToPut);
    const yDocBlob = new Blob([yDocByte]);
    let formData = new FormData();
    formData.append("password", key);
    formData.append("portalDoc", yDocBlob);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return axios
      .put(`${API_URL}/portal/${key}`, formData, config)
      .then((resp) => resp);
  };
  const debouncedPut = useCallback(
    debounce((yDocToPut) => putToDb(yDocToPut), 2000),
    []
  );

  useEffect(() => {
    let provider = new WebrtcProvider(key, yDoc);
    axios
      // other type could be arrayBuffer
      .get(`${API_URL}/portal/${key}`, { responseType: "blob" })
      .then((resp) => {
        resp.data.arrayBuffer().then((buffer) => {
          const backendUint8 = new Uint8Array(buffer);
          Y.applyUpdate(yDoc, backendUint8);
        });
      })
      .catch(() => {
        // TODO make portal name from title? maybe database doesnt even need it?
        makePortal("new portal", key);
        // console.log("A portal with that key does not exist");
      });
    yDoc.on("afterTransaction", () => {
      debouncedPut(yDoc);
      // TODO: comment out for putting
      forceUpdate();
    });
    return () => {
      yDoc.destroy();
    };
  }, []);

  const removeElement = (e, id) => {
    e.preventDefault();
    yElements.delete(id);
  };

  const makePortal = (name) => {
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

  let elements = {
    toAdd: [],
    inPortal: [],
  };
  let yElements = yDoc.getMap("elements");
  yElements.forEach((el, id) => {
    if (el) {
      // TODO: add a check here to make sure there are no issues with the yMap
      // console.log(el);
      elements[el.get("container")].push(
        <YElement
          key={id}
          id={id}
          el={el}
          removeElement={removeElement}
          yDoc={yDoc}
          forceUpdate={forceUpdate}
        />
      );
    }
  });

  return (
    <main className="portal-page">
      <header className="portal__header">
        <h1 className="portal__heading">Portal /</h1>
        <TextEditor
          className="portal__subheading"
          id={key}
          yDoc={yDoc}
          placehoderText={"Add title"}
          isHeading={true}
        />
      </header>
      <section className="portal">
        <div
          className="in-portal"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, "inPortal")}
        >
          {elements.inPortal}
        </div>
      </section>
      <Sideboard
        onDragOver={onDragOver}
        onDrop={onDrop}
        elements={elements}
        yDoc={yDoc}
      />
    </main>
  );
}
