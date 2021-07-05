require("dotenv").config();
const fetch = require("node-fetch");
const urlApi = process.env.API_URL;
const appKey = process.env.APP_KEY;
const appId = process.env.APP_ID;
const urlApiLinias = `${urlApi}?app_key=${appKey}&app_id=${appId}`;
const codigoLinia = process.env.CODIGO_LINIA;

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

const infoLiniasParadas = async () => {
  const linias = await llamadaLinias();
  const parada = await verEstaciones(codigoLinia);
  const infoParada = await parada.features.map((infoParada) => {
    const {
      properties: { ID_ESTACIO_LINIA, NOM_ESTACIO },
    } = infoParada;
    return { id: ID_ESTACIO_LINIA, nombre: NOM_ESTACIO };
  });
  const infoParadas = linias.features.reduce((contador, linia) => {
    const {
      properties: { CODI_LINIA, NOM_LINIA, DESC_LINIA },
    } = linia;
    if (+CODI_LINIA === +codigoLinia) {
      return (contador = {
        linea: NOM_LINIA,
        descripcion: DESC_LINIA,
        parada: infoParada,
      });
    } else {
      return contador;
    }
  }, {});
  return infoParadas;
};

module.exports = {
  infoLinias,
  infoLiniasParadas,
};
