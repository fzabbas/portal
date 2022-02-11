import axios from "axios";
import { useState, React } from "react";
import { Redirect, useHistory, Link } from "react-router-dom";
import "./LandingPage.scss";

// assets
import addElementsVideo from "../../assets/videos/add-elements-video.mp4";
import collabVideo from "../../assets/videos/collab.mp4";
import linkedinIcon from "../../assets/icons/linkedin.svg";
import githubIcon from "../../assets/icons/github.svg";
import mailIcon from "../../assets/icons/mail.svg";

// const API_URL = `http://${window.location.hostname}:8080`;
const API_URL = `http://${window.location.hostname}/api`;

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
    <main className="landing">
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
            placeholder="Add the secret key..."
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
        <div className="features__videos">
          <div className="features__feature">
            <h3 className="features__subheading--alternate">
              Add Text, Images or Links
            </h3>
            <video
              preload="auto"
              muted
              playsInline
              autoPlay
              loop
              className="features__video features__content"
            >
              <source src={addElementsVideo} type="video/mp4" />
            </video>
            <div className="features__content">
              <h3 className="features__subheading">
                Add Text, Images or Links
              </h3>
              <p className="features__text">
                Add a text boxes and customize them as you see fit.
              </p>
              <p className="features__text">
                For images and links, simply paste the image URL and click the
                button!
              </p>
              <p className="features__text">
                All elements can be resized. If the text or image does not fit
                in the resized dimensions, the element will have a scrollbar so
                you can see what is hiding out of the box
              </p>
            </div>
          </div>
          <div className="features__feature">
            <h3 className="features__subheading--alternate">Collaborate</h3>

            <div className="features__content">
              <h3 className="features__subheading">Collaborate</h3>
              <p className="features__text">
                Share your portals with people to get their input
              </p>
              <p className="features__text">
                Portals uses data types called CRDTs that make sure that
                conflicts don't arise from multiple people using the same portal
              </p>
            </div>
            <video
              preload="auto"
              muted
              playsInline
              autoPlay
              loop
              className="features__video features__content"
            >
              <source src={collabVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
      <div className="secret features">
        <p className="features__subheading--center">Is it a secret Portal?</p>
        <p className="features__text-bold">Not exactly...</p>
        <p>
          The portal is hidden in plain sight. Anyone with the secret key can go
          to the portal and change it as they wish
        </p>
        <p>
          To make it harder for people to find your portal, make sure the key is
          not easy to guess.
        </p>
      </div>
      <footer className="footer">
        <a className="footer__link" href="https://www.linkedin.com/in/fzabbas/">
          <img
            className="footer__icon"
            src={linkedinIcon}
            alt="linkedin link"
          />
        </a>
        <a className="footer__link" href="mailto:farhana.z.abbas@gmail.com">
          <img className="footer__icon" src={mailIcon} alt="mail link" />
        </a>
        <a className="footer__link" href="https://github.com/fzabbas/portal">
          <img className="footer__icon" src={githubIcon} alt="github link" />
        </a>
      </footer>
    </main>
  );
}
