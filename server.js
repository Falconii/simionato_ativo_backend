/* fontes gerado automaticamente */
const express = require('express');
const cors = require('cors');
const app = express(); app.use(express.json());
app.use(cors());
app.use('/', require('./route/fotoRoute'));
app.use((err, req, res, next) =>  { res.status(err.httpStatusCode).json({ error: err.message, merda: 'Deu Erro' }) });
app.listen(3000, () => { console.log('Servidor No Ar. Porta 3000'); });
