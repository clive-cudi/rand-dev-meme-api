const express = require("express");
const app = express();
const PORT = 4767;
const { supabase } = require("./supabase.config");

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

app.listen(PORT, () => {
  console.log(`Server up on PORT: ${PORT}`);
});
