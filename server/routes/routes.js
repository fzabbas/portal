const { response } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const knex = require("../knexConfig");

router.post("/", upload.single("portalDoc"), (req, res) => {
  // const encodedData = btoa(req.body.yDocByteArray);
  knex("portals")
    .insert({
      id: 2,
      portal_doc: req.file.buffer,
      portal_name: req.body.portalName,
      password: req.body.password,
    })
    .then((data) => {
      // console.log(data);
      res.send("no error");
    })
    .catch((err) => {
      res.status(400).send("Could not make new portal");
    });
  console.log(req.body);
  console.log(req.file.buffer);
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
      res.send("Error fining that portal");
    });
});

module.exports = router;
