// const { response } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const knex = require("../knexConfig");
const Y = require("yjs");

router.post("/", upload.single("portalDoc"), (req, res) => {
  knex("portals")
    .insert({
      portal_doc: req.file.buffer,
      portal_name: req.body.portalName,
      password: req.body.password,
    })
    .then((data) => {
      res.send("Portal was successfully created");
    })
    .catch((err) => {
      res.status(400).send("Could not make new portal");
    });
});

router.get("/:key", (req, res) => {
  knex("portals")
    .where({
      password: req.params.key,
    })
    .select("portal_doc")
    .then((data) => {
      res.send(data[0].portal_doc);
    })
    .catch((err) => {
      res.status(400).send("error");
    });
});

// havent tested yet, no way to test at the moment
router.put("/:key", upload.single("portalDoc"), (req, res) => {
  console.log("putting", req.params.key);
  knex
    .transaction((t) => {
      return knex("portals")
        .transacting(t)
        .where({
          password: req.params.key,
        })
        .select("portal_doc")
        .then((data) => {
          console.log("merging put:");
          const mergedDoc = Y.mergeUpdates([
            req.file.buffer,
            data[0].portal_doc,
          ]);
          const mergedBuffer = Buffer.from(mergedDoc);
          return knex("portals")
            .where({
              password: req.params.key,
            })
            .update({
              portal_doc: mergedBuffer,
            });
        })
        .then(t.commit)
        .catch((err) => {
          t.rollback();
          throw err;
        });
    })
    .then(() => {
      console.log("successful put");
      res.send("portal was updates");
    })
    .catch(() => {
      console.log("Portal was not updated");
      res.status(400).send("Portal was not updated");
    });
});

module.exports = router;
