import Fastify from "fastify";
import path from "path";
import fs from "fs";
import fastifyStatic from "@fastify/static";

const app = Fastify();

const PORT = Number(process.env.PORT) || 8081;
const __dirname = path.resolve();
const root = path.join(__dirname, "client/dist");
const htmlTemplate = fs.readFileSync(path.join(root, "index.html"), "utf-8");

app.register(fastifyStatic, { root, index: false });

const setSEO = (res, meta = {}) => {
  res.type("text/html").send(htmlTemplate);
};

app.get("/", (_, res) => setSEO(res));

app.setNotFoundHandler((req, res) => {
  if (req.method === "GET") return setSEO(res);
  res.status(404).send({ message: "Not Found" });
});

app
  .listen({ port: PORT, host: "0.0.0.0" })
  .then(() => console.log(`🚀 Server running on port ${PORT}`))
  .catch(console.error);
