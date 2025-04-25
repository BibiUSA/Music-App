import app from "./app.js";
import client from "./models/db.js";
import dotenv from "dotenv";
dotenv.config();
import process from "process";
import { environment } from "../frontend/client/src/environment.js";

client
  .connect()
  .then(() => {
    environment.development && console.log("connected to postgresql");
  })
  .catch((err) => {
    environment.development &&
      console.log("error connecting to database:", err);
  });

const port = process.env.PORT || 8080;

app.listen(port, () => {
  environment.development && console.log(`server started on port ${port}`);
});
