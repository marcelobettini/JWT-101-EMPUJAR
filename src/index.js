import express from "express";
import morgan from "morgan";
const PORT = 3030;
const app = express();
app.use(morgan("tiny"));
app.listen(PORT, err => {
  console.log(
    err ? `Server not running. ${err}` : `Server up at http://localhost:${PORT}`
  );
});
