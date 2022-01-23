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
router.put("/:key", (req, res) => {
  // let newYdoc = new Y.Doc();
  req.file.buffer.arrayBuffer().then((frontendYdocBuffer) => {
    const frontendUint8 = new Uint8Array(frontendYdocBuffer);
    knex.transaction((t) => {
      return knex("portals")
        .where({
          password: req.params.key,
        })
        .select("portal_doc")
        .then((data) => {
          data[0].portal_doc.arrayBuffer().then((databaseYDocBuffer) => {
            const databaseUint8 = new Uint8Array(databaseYDocBuffer);

            return knex("portals")
              .where({
                password: req.params.key,
              })
              .update({
                portal_doc: Y.mergeUpdates([frontendUint8, databaseUint8]),
              })
              .then(t.commit)
              .catch((err) => {
                t.rollback();
                throw err;
              });
          });
        })
        .then(() => {
          res.send("Portal was updated");
        })
        .catch(() => {
          res.send("Wasnt able to update");
        });
    });
  });
});

module.exports = router;
