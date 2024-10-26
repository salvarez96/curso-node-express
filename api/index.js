require('module-alias/register')
const express = require('express');
const routerApi = require('@routes/index.routes')
const cors = require('cors');
const os = require('os');
const { internalError, handleBoomErrors } = require('@middlewares/errorHandler');

const app = express()
const port = 8080
const IP = os.networkInterfaces().eth0[0].address

const originWhitelist = ['http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:5500']
const corsOptions = {
  origin: (origin, callback) => {
    if (originWhitelist.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error(`${origin} is not authorized to access this application.`), false)
    }
  }
}

// this middleware adds json parsing when Content-Type header specifies application/json
app.use(express.json())
app.use(cors(corsOptions))
routerApi(app)
app.use(handleBoomErrors)
app.use(internalError)

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
