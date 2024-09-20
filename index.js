require('module-alias/register')
const express = require('express');
const routerApi = require('@routes/index.routes')
const os = require('os');

const app = express()
const port = 8080
const IP = os.networkInterfaces().eth0[0].address

// this middleware adds json parsing when Content-Type header specifies application/json
app.use(express.json())

routerApi(app)

// ruta a la raíz del proyecto
app.get('/', (req, res) => {
  res.send('Hola, mi server en express')
})

// ruta al home del proyecto
app.get('/home', (req, res) => {
  res.send('Hola, mi server en express que se encuentra en el home')
})

app.listen(port, () => {
  console.log(`Inicia la aplicación en el puerto ${port}`);
  console.log(`Para ver en otros dispositivos:`);
  console.log(`http://${IP}:${port}/`);
})
