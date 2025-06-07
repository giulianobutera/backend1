const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');

const ProductManager = require('./src/productManager');

const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');
const viewsRouter = require('./src/routes/views.router');

const app = express();
const PORT = 8080;
const httpServer = createServer(app);
const io = new Server(httpServer);

mongoose.connect("mongodb+srv://gbutera140:GtF59kB9vz8qC8nR@cluster0.coyyw28.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Conectado a la base de datos de Mongo Atlas")
  })
  .catch(error => {
    console.error("La conexión no se ha podido realizar", error)
  });

const productManager = new ProductManager('./data/products.json');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// WebSocket
io.on('connection', async socket => {
  // Enviar lista actual
  socket.emit('products', await productManager.getProducts());

  // Crear producto desde formulario
  socket.on('new-product', async data => {
    await productManager.addProduct(data);
    const updatedProducts = await productManager.getProducts();
    io.emit('products', updatedProducts);
  });

  // Eliminar producto
  socket.on('delete-product', async id => {
    await productManager.deleteProduct(id);
    const updatedProducts = await productManager.getProducts();
    io.emit('products', updatedProducts);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
