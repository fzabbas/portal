import { useEffect, useReducer, useCallback } from "react";
import { useResizeDetector } from "react-resize-detector";
import { useParams } from "react-router-dom";
import { WebrtcProvider } from "y-webrtc";
import debounce from "lodash.debounce";
import axios from "axios";
import * as Y from "yjs";
import TextEditor from "../TextEditor/TextEditor";
import "./Portal.scss";
import deleteIcon from "../../assets/icons/delete.svg";
import Sideboard from "../Sideboard/Sideboard";

const yDoc = new Y.Doc();
let provider = new WebrtcProvider("example-dxocument3", yDoc);
const API_URL = `http://localhost:8080`;

export default function Portal() {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  let { key } = useParams();

  const onDragStart = (e, key) => {
    e.dataTransfer.setData("startX", e.pageX);
    e.dataTransfer.setData("startY", e.pageY);
    e.dataTransfer.setData("id", key);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, section) => {
    let id = e.dataTransfer.getData("id");
    let elementsMap = yDoc.get("elements");
    let nestedElementsMap = elementsMap.get(id);
    const url = nestedElementsMap.get("src");
    let initialX = nestedElementsMap.get("x_pos");
    let initialY = nestedElementsMap.get("y_pos");
    const x = initialX + (e.pageX - e.dataTransfer.getData("startX"));
    if (typeof initialX === "string") {
      nestedElementsMap.set("container", section);
      nestedElementsMap.set("x_pos", e.pageX);
      nestedElementsMap.set("y_pos", e.pageY);
      nestedElementsMap.set("src", url);
    } else {
      nestedElementsMap.set("container", section);
      nestedElementsMap.set(
        "x_pos",
        initialX + (e.pageX - e.dataTransfer.getData("startX"))
      );
      nestedElementsMap.set(
        "y_pos",
        initialY + (e.pageY - e.dataTransfer.getData("startY"))
      );
      nestedElementsMap.set("src", url);
    }
    forceUpdate();
  };

  const putToDb = (yDocToPut) => {
    console.log("putting");
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
    elements[el.get("container")].push(
      <div
        key={id}
        onDragStart={(e) => onDragStart(e, id)}
        draggable
        style={
          el.get("container") === "toAdd"
            ? {}
            : { top: el.get("y_pos"), left: el.get("x_pos") }
        }
        className={`element ${el.get("container")}`}
      >
        <button
          className="element__delete"
          onClick={(e) => removeElement(e, id)}
        >
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
