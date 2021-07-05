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
  console.log(linias);
  return linias;
};

const app = express();

const server = app.listen(4000, () => {
  console.log("El servidor se ha iniciado.");
});

server.on("error", (error) => {
  console.log(error);
});

app.get("/metro/lineas", async (req, res, next) => {
  const respuesta = await llamadaLinias();
  const infoLinias = respuesta.features.map((linia) => {
    const {
      properties: { ID_LINIA, NOM_LINIA, DESC_LINIA },
    } = linia;
    return {
      id: ID_LINIA,
      linea: NOM_LINIA,
      descripcion: DESC_LINIA,
    };
  });
  res.json(infoLinias);
});
/* "properties": {
            "ID_LINIA": 12,
            "CODI_LINIA": 91,
            "NOM_LINIA": "L9S",
            "DESC_LINIA": "Aeroport T1 - Zona Universitària",
            "ORIGEN_LINIA": "Aeroport T1",
            "DESTI_LINIA": "Zona Universitària",
            "NUM_PAQUETS": 1,
            "ID_OPERADOR": 1,
            "NOM_OPERADOR": "Metro",
            "NOM_TIPUS_TRANSPORT": "METRO",
            "CODI_FAMILIA": 1,
            "NOM_FAMILIA": "Metro",
            "ORDRE_FAMILIA": 1,
            "ORDRE_LINIA": 11,
            "CODI_TIPUS_CALENDARI": "1",
            "NOM_TIPUS_CALENDARI": "Tots els dies",
            "DATA": "2021-07-04Z",
            "COLOR_LINIA": "FB712B",
            "COLOR_AUX_LINIA": "FB712B",
            "COLOR_TEXT_LINIA": "FFFFFF"
        } */
