import express from "express";
import fs, { appendFileSync } from "fs";
import path from "path";

const app = express();
const videoDir = path.join(process.cwd(), "videos");
const imageDir = path.join(process.cwd(), "images");
const defaultPoster = "/videos/thumbs/default.jpg";

app.use("/videos", express.static(videoDir));
app.use("/images", express.static(imageDir));
app.use(express.static(process.cwd()));

app.get("/api/gallery", (req, res) => {
  const videos = fs.readdirSync(videoDir)
    .filter(f => f.endsWith(".mp4"))
    .map(file => {
      const posterPath = path.join(videoDir, "thumbs", file.replace(".mp4", ".jpg"));
      return {
        type: "video",
        src: "/videos/" + file,
        poster: fs.existsSync(posterPath) ? "/videos/thumbs/" + file.replace(".mp4", ".jpg") : defaultPoster
      };
    });

  let images = [];
  if (fs.existsSync(imageDir)) {
    images = fs.readdirSync(imageDir)
      .filter(f => f.match(/\.(jpg|png|jpeg|webp)$/i))
      .map(file => ({ type: "image", src: "/images/" + file }));
  }

  res.json([...videos, ...images]);
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
