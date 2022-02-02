// const { response } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const knex = require("../knexConfig");
const Y = require("yjs");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const PORTAL_DOCS = "portalDocs";

function writePortal(portalID, data) {
  fs.mkdirSync(PORTAL_DOCS, { recursive: true });
  fs.writeFileSync(`${PORTAL_DOCS}/${portalID}`, data); // put into fn
}

function readPortal(portalID) {
  return fs.readFileSync(`${PORTAL_DOCS}/${portalID}`);
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
    .select("portal_doc")
    .then((data) => {
      console.log("GET success");
      res.send(data[0].portal_doc);
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
          console.log("merging put:");
          // read file from disk
          const mergedDoc = Y.mergeUpdates([
            req.file.buffer,
            data[0].portal_doc,
            readPortal(data[0].portal_name),
          ]);
          // write file to disk
          const mergedBuffer = Buffer.from(mergedDoc);
          writePortal(data[0].portal_name, mergedBuffer);
          return t("portals")
            .where({
              password: req.params.key,
            })
            .update({
              // update version
              version: data[0].version + 1,
              portal_doc: mergedBuffer,
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
