const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/routes");

app.use(cors());
app.use(express.json());

app.use("/portal", routes);

app.listen(8080, () => {
  console.log("Listening on 8080");
});
