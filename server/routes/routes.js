const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const encodedData = btoa(req.body.yDocByteArray);
  console.log(req.body);

  console.log(encodedData);
});

module.exports = router;
