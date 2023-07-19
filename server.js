const express = require("express");
const app = express();
const PORT = 4767;

app.get("/", (req, res) => {
  return res.status(200).send("random-meme-api");
});

app.listen(PORT, () => {
  console.log(`Server up on PORT: ${PORT}`);
});
