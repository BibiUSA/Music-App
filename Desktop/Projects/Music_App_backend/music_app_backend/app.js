import express from "express";
import cors from "cors";
import tileRouter from "./routers/tile_router.js";
import homeFeedRouter from "./routers/homefeed_router.js";
import bodyParser from "body-parser";
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

app.use("/create", tileRouter);
app.use("/get", homeFeedRouter);
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
});

// app.listen(8080, () => {
//   console.log("Server started on port 8080");
// });

export default app;