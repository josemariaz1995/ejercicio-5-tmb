const express = require("express");
require("dotenv").config();
const fetch = require("node-fetch");
const urlApi = process.env.API_URL;
const appKey = process.env.APP_KEY;
const appId = process.env.APP_ID;
const urlApiLinias = `${urlApi}?app_key=${appKey}&app_id=${appId}`;

const llamadaLinias = async () => {
  const response = await fetch(urlApiLinias);
  const linias = await response.json();
  return linias;
};
const infoLinias = async () => {
  const linias = await llamadaLinias();
  const infoLinias = linias.features.map((linia) => {
    const {
      properties: { ID_LINIA, NOM_LINIA, DESC_LINIA },
    } = linia;
    return {
      id: ID_LINIA,
      linea: NOM_LINIA,
      descripcion: DESC_LINIA,
    };
  });
  return infoLinias;
};
const verEstaciones = async (codigoLinia) => {
  const apiEstaciones = `${urlApi}${codigoLinia}/estacions/?app_key=${appKey}&app_id=${appId}`;
  const response = await fetch(apiEstaciones);
  const estaciones = await response.json();
  return estaciones;
};

const app = express();
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
  const linias = await llamadaLinias();

  const respuestaInfoLinias = await infoLinias();
  const paradas = await linias.features.map(async (linia) => {
    const {
      properties: { NOM_LINIA, DESC_LINIA, CODI_LINIA },
    } = linia;
    const parada = await verEstaciones(CODI_LINIA);

    const infoparada = parada.features.map((parada) => {
      const {
        properties: { ID_ESTACIO_LINIA, NOM_ESTACIO },
      } = parada;
      return { id: ID_ESTACIO_LINIA, nombre: NOM_ESTACIO };
    });
    console.log({
      linea: NOM_LINIA,
      descripcion: DESC_LINIA,

      paradas: infoparada,
    });
    /// este return esta maldito, descubrir el por que
    return {
      linea: NOM_LINIA,
      descripcion: DESC_LINIA,
      paradas: infoparada,
    };
  });

  res.json(paradas);
});
