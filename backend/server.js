import app from "./app.js";
import client from "./models/db.js";
import dotenv from "dotenv";
dotenv.config();
import process from "process";

client
  .connect()
  .then(() => {
    console.log("connected to postgresql");
  })
  .catch((err) => {
    console.log("error connecting to database:", err);
  });

const port = process.env.PORT || 8080;

app.listen(port, "0.0.0.0", () => {
  console.log(`server started on port ${port}`);
});
