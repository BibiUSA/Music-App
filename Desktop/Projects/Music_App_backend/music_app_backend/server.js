import app from "./app.js";
import client from "./models/db.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./config.env",
});

client
  .connect()
  .then(() => {
    console.log("connected to postgresql");
  })
  .catch((err) => {
    console.log("error connecting to database:", err);
  });

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
