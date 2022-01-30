import axios from "axios";
import { useState, React } from "react";
import { Redirect, useHistory, Link } from "react-router-dom";
import "./LandingPage.scss";
import addElementsVideo from "../../assets/videos/add-elements-video.mp4";
const API_URL = `http://${window.location.hostname}:8080`;

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
    <div className="landing">
      <header className="landing__header">
        <Link className="landing__heading" to="/">
          Portal /
        </Link>
        <h2 className="landing__subheading">An entry to your ideas</h2>
      </header>
      <section className="landing__hero-image">
        <form className="landing__form" onSubmit={handleSubmit}>
          <label htmlFor="portalKey">Join a portal:</label>
          <input
            className="landing__input"
            type="text"
            id="portalKey"
            name="portalKey"
          ></input>
          <button className="landing__button">Open Portal</button>
          {validKey ? (
            <></>
          ) : (
            <p className="landing__prompt">Please provide a key</p>
          )}
          {newKey ? (
            <>
              <p>This portal does not exist. Do you want to make it?</p>
              <p className="landing__newkey">key: {newKey}</p>
              <Link className="landing__newportal" to={`/portal/${newKey}`}>
                YES!
              </Link>
            </>
          ) : (
            <></>
          )}
        </form>
      </section>
      <section className="features">
        <p className="features__heading">Features</p>
        <div>
          <video
            preload="auto"
            muted
            playsInline
            autoPlay
            loop
            className="features__add-el-video"
          >
            <source src={addElementsVideo} type="video/mp4" />
          </video>
        </div>
      </section>
    </div>
  );
}
