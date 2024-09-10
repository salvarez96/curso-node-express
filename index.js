const express = require('express');

const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Hola, mi server en express')
})

app.listen(port, () => {
  console.log(`Inicia la aplicación en el puerto ${port}`);
})
