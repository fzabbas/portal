import { useState, useEffect } from "react";
import * as Y from "yjs";
import { v4 as uuidv4 } from "uuid";
import TextEditor from "../TextEditor/TextEditor";

const yDoc = new Y.Doc();
let provider = new WebrtcProvider("example-dxocument", yDoc);

export default function Portal() {
  const [yDoc, setYDoc] = useState(yDoc);

  renderElement = () => {
    const id = uuidv4();
    const map = yDoc.getMap("elements"); // elements meta deta
    // setting elements meta data, more infor may have to be stored
    map.set(id, {
      container: "toAdd",
      x_pos: "",
      y_pos: "",
    });
    setYDoc(yDoc);
  };

  onDragStart = (e, key) => {
    e.dataTransfer.setData("id", key);
  };

  onDragOver = (e) => {
    e.preventDefault();
  };

  onDrop = (e, section) => {
    let id = e.dataTransfer.getData("id");
    let elementsMap = this.state.yDoc.getMap("elements");
    elementsMap.set(id, {
      container: section,
      x_pos: e.pageX - 32,
      y_pos: e.pageY - 80,
    });
    setYDoc(yDoc);
  };

  useEffect(() => {
    yDoc.on("afterTransaction", () => {
      setYDoc(yDoc);
    });
  });

  let elements = {
    toAdd: [],
    inPortal: [],
  };
  const yElements = yDoc.getMap("elements");
  yElements.forEach((el, id) => {
    elements[el.container].push(
      <div
        key={id}
        onDragStart={(e) => this.onDragStart(e, id)}
        draggable
        style={{ top: el.y_pos, left: el.x_pos }}
        className={`draggable-el ${el.container}`}
      >
        <TextEditor id={id} yDoc={yDoc} />
      </div>
    );
  });

  return <></>;
}
