import { useState, useEffect, useReducer, useCallback } from "react";
import { useParams } from "react-router-dom";
import { WebrtcProvider } from "y-webrtc";
import debounce from "lodash.debounce";
import axios from "axios";
import * as Y from "yjs";
import { v4 as uuidv4 } from "uuid";
import TextEditor from "../TextEditor/TextEditor";
import "./Portal.scss";
import textIcon from "../../assets/icons/text.svg";
import imageIcon from "../../assets/icons/image.svg";
import addIcon from "../../assets/icons/add-square.svg";

const yDoc = new Y.Doc();
let provider = new WebrtcProvider("example-dxocument3", yDoc);
const API_URL = `http://localhost:8080`;

export default function Portal() {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  let { key } = useParams();
  const [toAddImage, setToAddImage] = useState(false);

  // const [ydoc, setYDoc] = useState(yDoc);

  const renderText = () => {
    const id = uuidv4();
    const map = yDoc.getMap("elements"); // elements meta deta
    // setting elements meta data, more infor may have to be stored
    map.set(id, {
      container: "toAdd",
      x_pos: "",
      y_pos: "",
    });
    forceUpdate();
  };

  const renderImage = (e) => {
    e.preventDefault();
    const id = uuidv4();
    const url = e.target.imageURL.value;
    if (url) {
      const map = yDoc.getMap("elements"); // elements meta deta
      map.set(id, {
        container: "toAdd",
        x_pos: "",
        y_pos: "",
        src: url,
      });
      forceUpdate();
    }
    setToAddImage(false);
  };

  const handleImage = (e) => {
    setToAddImage(!toAddImage);
  };

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
    let elementsMap = yDoc.getMap("elements");
    const url = elementsMap.get(id).src;
    let initialX = elementsMap.get(id).x_pos;
    let initialY = elementsMap.get(id).y_pos;
    const x = initialX + (e.pageX - e.dataTransfer.getData("startX"));
    if (typeof initialX === "string") {
      elementsMap.set(id, {
        container: section,
        x_pos: e.pageX,
        y_pos: e.pageY,
        src: url,
      });
    } else {
      elementsMap.set(id, {
        container: section,
        x_pos: initialX + (e.pageX - e.dataTransfer.getData("startX")),
        y_pos: initialY + (e.pageY - e.dataTransfer.getData("startY")),
        src: url,
      });
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
    elements[el.container].push(
      <div
        key={id}
        onDragStart={(e) => onDragStart(e, id)}
        draggable
        style={
          el.container === "toAdd" ? {} : { top: el.y_pos, left: el.x_pos }
        }
        className={`element ${el.container}`}
      >
        <button
          className="element__delete"
          onClick={(e) => removeElement(e, id)}
        >
          x
        </button>
        {el.src ? (
          <img className="element__image" src={el.src} alt={el.src} />
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
      <section
        className="sideboard"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "toAdd")}
      >
        <div className="sideboard__header">
          <h2 className="sideboard__heading">Sideboard</h2>
          <div>
            <button className="button" onClick={renderText}>
              <img src={textIcon} alt="text-icon" />
            </button>
            <button className="button" onClick={handleImage}>
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
    </main>
  );
}
