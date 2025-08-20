import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for the lyrics" });
});

app.post("/submit", async (req, res) => {
  console.log(req.body.artist);
  console.log(req.body.song);
  try {
    const response = await axios.get(
      `https://api.lyrics.ovh/v1/${req.body.artist}/${req.body.song}`
    );
    const rawLyrics = response.data.lyrics;

    const arrayLyrics = rawLyrics.replace(/\r\n/g, "\n").split("\n");
    const cleanLyrics = arrayLyrics.filter((line) => line.trim() !== "");
    console.log("Lyrics array:", cleanLyrics);
    res.render("index.ejs", {
      content: cleanLyrics,
    });
  } catch (error) {
    console.error(error.response.data);
    res.status(505);
    res.render("index.ejs", {
      content: JSON.stringify(error.response.data.error),
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
