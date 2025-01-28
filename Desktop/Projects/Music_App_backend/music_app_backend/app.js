import express from "express";
import cors from "cors";
import tileRouter from "./routers/tile_router.js";
import homeFeedRouter from "./routers/homefeed_router.js";
import userInfoRouter from "./routers/userinfo_router.js";
import bodyParser from "body-parser";
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  origin: ["http://localhost:5173"],
  // ["https://music-app-7bvk.onrender.com"],
};

app.use(cors());

app.use("/create", tileRouter);
app.use("/get", homeFeedRouter);
app.use("/user", userInfoRouter);
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana", 'Mango'] });
});

// app.listen(8080, () => {
//   console.log("Server started on port 8080");
// });
//try

export default app;
