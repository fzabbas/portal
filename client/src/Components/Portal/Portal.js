import { useState, useEffect, useReducer, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { WebsocketProvider } from "y-websocket";
import debounce from "lodash.debounce";
import axios from "axios";
import * as Y from "yjs";
import TextEditor from "../TextEditor/TextEditor";
import "./Portal.scss";
import Sideboard from "../Sideboard/Sideboard";
import YElement from "../YElement/YElement";

// const API_URL = `http://${window.location.hostname}:8080`;
const API_URL = `${window.location.origin}/api`;

export default function Portal() {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  let { key } = useParams();
  const [portalWidth, setPortalWidth] = useState(window.innerWidth);
  const [portalHeight, setPortalHeight] = useState(window.innerHeight);
  const [yDoc, _setYDoc] = useState(() => new Y.Doc());
  const [provider, _setProvider] = useState(
    () => new WebsocketProvider("wss://websocket.inportal.space", key, yDoc)
  );

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, section) => {
    let id = e.dataTransfer.getData("id");
    let elementsMap = yDoc.getMap("elements");
    let droppedElementsMap = elementsMap.get(id);
    let initialX = droppedElementsMap.get("x_pos");
    let initialY = droppedElementsMap.get("y_pos");
    droppedElementsMap.set("container", section);

    // updating yDoc
    // if moving from sideboard
    if (typeof initialX === "string") {
      droppedElementsMap.set("x_pos", e.pageX);
      droppedElementsMap.set("y_pos", e.pageY);
    } else {
      droppedElementsMap.set(
        "x_pos",
        initialX + (e.pageX - e.dataTransfer.getData("startX"))
      );
      droppedElementsMap.set(
        "y_pos",
        initialY + (e.pageY - e.dataTransfer.getData("startY"))
      );
    }

    //updating portal width
    const newWidth =
      droppedElementsMap.get("x_pos") + droppedElementsMap.get("width");
    const newHeight =
      droppedElementsMap.get("y_pos") + droppedElementsMap.get("height");
    newWidth > window.innerWidth
      ? setPortalWidth(newWidth)
      : setPortalWidth(window.innerWidth);
    newHeight > window.innerHeight
      ? setPortalHeight(newHeight)
      : setPortalHeight(window.innerHeight);
    forceUpdate();
  };

  const putToDb = (yDocToPut) => {
    console.log("puttin");

    // converting ydoc to binary data and sendinng through in formData
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
    debounce((yDocToPut) => putToDb(yDocToPut), 1000),
    []
  );

  useEffect(() => {
    axios
      .get(`${API_URL}/portal/${key}`, { responseType: "blob" })
      .then((resp) => {
        resp.data.arrayBuffer().then((buffer) => {
          const backendUint8 = new Uint8Array(buffer);
          Y.applyUpdate(yDoc, backendUint8);
        });
      })
      .catch(() => {
        makePortal("new portal", key);
      });
    yDoc.on("afterTransaction", () => {
      debouncedPut(yDoc);
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
    // typecheck: makes sure that an el rendered is a YMap
    if (el instanceof Y.Map) {
      elements[el.get("container")].push(
        <YElement
          key={id}
          id={id}
          el={el}
          removeElement={removeElement}
          yDoc={yDoc}
          forceUpdate={forceUpdate}
          provider={provider}
        />
      );
    }
  });

  return (
    <main className="portal-page">
      <header className="portal__header">
        <Link className="portal__heading" to="/">
          Portal /
        </Link>
        <TextEditor
          className="portal__subheading"
          id={key}
          yDoc={yDoc}
          placehoderText={"Add title"}
          isHeading={true}
          provider={provider}
        />
      </header>
      <section
        className="portal"
        style={{ width: portalWidth, height: portalHeight }}
      >
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
        onDrop={(e) => onDrop(e, "toAdd")}
        elements={elements}
        yDoc={yDoc}
      />
    </main>
  );
}
