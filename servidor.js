const express = require("express");
const { infoLiniasParadas, infoLinias } = require("./api/llamadasApi");

const app = express();
app.use(express.static("./recursos"));
app.use(express.json());
const server = app.listen(4000, () => {
  console.log("El servidor se ha iniciado.");
});

server.on("error", (error, req, res) => {
  if (error.code === "EADDRINUSE") {
    console.log("El servidor ya esta en uso");
  }
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
app.post("*", (req, res, next) => {
  res.status(403).json({
    error: true,
    message: "Te pensabas que podias jaquearme",
  });
});
app.use((error, req, res, next) => {
  err.message = "Error general";
  console.log(error);
  res.status(500).json({
    error: true,
    mensaje: err.message,
  });
});
app.get("*", function (req, res) {
  res.status(404).json({
    error: true,
    mensaje: "Recurso no encontrado",
  });
});
