import axios from "axios";
import { useState } from "react";
import { Redirect, useHistory, Link } from "react-router-dom";
import "./LandingPage.scss";

const API_URL = `http://${location.hostname}:8080`;

export default function LandingPage() {
  const [redirect, setRedirect] = useState(null);
  const [validKey, setValidKey] = useState(true);
  const [newKey, setNewKey] = useState("");

  let history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    const key = e.target.portalKey.value;
    axios
      .get(`${API_URL}/portal/${key}`, { responseType: "blob" })
      .then((resp) => {
        history.push("/");
        setRedirect(key);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setValidKey(false);
        }
        if (err.response.status === 400) {
          setValidKey(true);
          setNewKey(key);
        }
      });
  };
  if (redirect) {
    return <Redirect exact from="/" to={`/portal/${redirect}`} />;
  }

  return (
    <div>
      <h1>Portal</h1>
      <h3>A space to organize your thoughts together</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="portalKey">Join a portal</label>
        <input type="text" id="portalKey" name="portalKey"></input>
        <button>Go to Portal</button>
        {validKey ? <></> : <p>Please provide a key</p>}
        {newKey ? (
          <>
            <p>{`Do you eant to make a portal with this key: ${newKey}`}</p>
            <Link to={`/portal/${newKey}`}>Yes!</Link>
          </>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
}
