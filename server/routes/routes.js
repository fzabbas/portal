// const { response } = require("express");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();
const knex = require("../knexConfig");
const Y = require("yjs");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const PORTAL_DOCS = "portalDocs";

function writePortal(portalID, data) {
  console.log(`Writing ${portalID} to disk`);
  fs.mkdirSync(PORTAL_DOCS, { recursive: true });
  fs.writeFileSync(`${PORTAL_DOCS}/${portalID}`, data);
}

function readPortal(portalID) {
  console.log(`Reading ${portalID} from disk`);
  try {
    return fs.readFileSync(`${PORTAL_DOCS}/${portalID}`);
  } catch (err) {
    console.log(`Portal ${portalID} doesn't exist`);
    return Y.encodeStateAsUpdate(new Y.Doc());
  }
}

router.post("/", upload.single("portalDoc"), (req, res) => {
  console.log("POST", req.body.password);
  const portalID = uuidv4();
  knex("portals")
    .insert({
      portal_doc: req.file.buffer,
      portal_name: portalID,
      password: req.body.password,
    })
    .then((data) => {
      console.log("POST success", portalID);
      writePortal(portalID, req.file.buffer);
      res.send("Portal was successfully created");
    })
    .catch((err) => {
      console.log("POST failed", err);
      res.status(400).send("Could not make new portal");
    });
});

router.get("/:key", (req, res) => {
  console.log("GET", req.params.key);
  knex("portals")
    .where({
      password: req.params.key,
    })
    .select("portal_doc", "portal_name")
    .then((data) => {
      console.log("GET success");
      res.send(readPortal(data[0].portal_name));
    })
    .catch((err) => {
      console.log("GET failed", err);
      res.status(400).send("error");
    });
});

router.put("/:key", upload.single("portalDoc"), (req, res) => {
  console.log("putting", req.params.key);
  knex
    .transaction((t) => {
      return t("portals")
        .where({
          password: req.params.key,
        })
        .select("portal_doc", "version", "portal_name")
        .then((data) => {
          let portalId = data[0].portal_name;
          if (portalId === "new portal") {
            portalId = uuidv4();
            console.log(
              `renaming old portal ${data[0].portal_name} to ${portalId} key: ${req.params.key}`
            );
          }

          console.log("merging put:");
          // read file from disk
          const mergedDoc = Y.mergeUpdates([
            req.file.buffer,
            data[0].portal_doc,
            readPortal(portalId),
          ]);
          // write file to disk
          const mergedBuffer = Buffer.from(mergedDoc);
          writePortal(portalId, mergedBuffer);
          return t("portals")
            .where({
              password: req.params.key,
            })
            .update({
              // update version
              portal_name: portalId,
              version: data[0].version + 1,
            });
        });
    })
    .then(() => {
      console.log("successful put");
      res.send("portal was updates");
    })
    .catch((err) => {
      console.log("Portal was not updated", err);
      res.status(400).send("Portal was not updated");
    });
});

module.exports = router;
