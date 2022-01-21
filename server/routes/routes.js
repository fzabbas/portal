const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

router.post("/", upload.single("portalDoc"), (req, res) => {
  // const encodedData = btoa(req.body.yDocByteArray);
  console.log(req.body);
  console.log(req.file);
});

module.exports = router;
