const express = require('express');
const consign = require('consign');
const cors = require('cors');

//FUNÇÃO RESPONSÁVEL POR CONFIGURAR O APP DO EXPRESS
module.exports = () => {
  const app = express();

  //http://localhost:3000
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }));
  app.use(express.json({ extended: false, limit: '50mb' }));
  consign().include('controllers').into(app);
  return app;
};
