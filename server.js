const express = require("express");
const app = express();
const PORT = 4767;
const { supabase } = require("./supabase.config");
const { getRandomMeme, syncMemes, getRandomMemeURL } = require("./controllers/memes.controller");

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  return res.status(200).send("random-meme-api");
});

app.get("/all", async (req, res) => {
  try {
    const { data, error } = await supabase.storage
      .from("memes")
      .list("pictures", {
        limit: 100,
        offset: 0,
      });

    if (error) {
      throw error;
    }

    console.log(data);
    return res.status(200).json({
      success: true,
      message: "Successfully fetched all memes",
      payload: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "Couldn't fetch all memes",
      payload: null,
    });
  }
});

app.get('/upload', async (req, res) => {
  try {
    res.render('index')
  } catch(err) {
    return res.status(400).json({
      success: false,
      message: "Failed to render upload page"
    })
  }
});

app.get('/random', getRandomMemeURL);
app.get('/api/random', getRandomMeme);
app.get('/sync', syncMemes);

app.listen(PORT, () => {
  console.log(`Server up on PORT: ${PORT}`);
});
