const express = require("express");
const { infoLiniasParadas, infoLinias } = require("./api/llamadasApi");

const app = express();
app.use(express.static("./recursos"));
app.use(express.json());
const server = app.listen(4000, () => {
  console.log("El servidor se ha iniciado.");
});

server.on("error", (error) => {
  console.log(error);
});

app.get("/metro/lineas", async (req, res, next) => {
  const respuesta = await infoLinias();
  res.json(respuesta);
});

app.get("/metro/linea", async (req, res, next) => {
  const infoParadas = await infoLiniasParadas();
  res.json(infoParadas);
});
