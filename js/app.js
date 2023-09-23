const express = require('express');
const fs = require('fs');

const app = express();
const port = 8080;

// Middleware para el manejo de JSON
app.use(express.json());

// Rutas para el manejo de productos
const productsRouter = express.Router();
app.use('/api/products', productsRouter);

const productsFile = 'productos.json';

// Listar todos los productos
productsRouter.get('/', (req, res) => {
    const limit = parseInt(req.query.limit);
    fs.readFile(productsFile, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener los productos'
            });
        }
        let products = JSON.parse(data);
        if (limit) {
            products = products.slice(0, limit);
        }
        res.json(products);
    });
});

// Obtener un producto por ID
productsRouter.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    fs.readFile(productsFile, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener el producto'
            });
        }
        const products = JSON.parse(data);
        const product = products.find((p) => p.id === productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({
                error: 'Producto no encontrado'
            });
        }
    });
});

// Agregar un nuevo producto
productsRouter.post('/', (req, res) => {
    const newProduct = req.body;
    fs.readFile(productsFile, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al agregar el producto'
            });
        }
        const products = JSON.parse(data);
        const lastId = products.length > 0 ? products[products.length - 1].id : 0;
        newProduct.id = lastId + 1;
        products.push(newProduct);
        fs.writeFile(productsFile, JSON.stringify(products), (err) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error al guardar el producto'
                });
            }
            res.json(newProduct);
        });
    });
});

// Actualizar un producto por ID
productsRouter.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;
    fs.readFile(productsFile, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al actualizar el producto'
            });
        }
        const products = JSON.parse(data);
        const index = products.findIndex((p) => p.id === productId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                ...updatedProduct
            };
            fs.writeFile(productsFile, JSON.stringify(products), (err) => {
                if (err) {
                    return res.status(500).json({
                        error: 'Error al guardar el producto actualizado'
                    });
                }
                res.json(products[index]);
            });
        } else {
            res.status(404).json({
                error: 'Producto no encontrado'
            });
        }
    });
});

// Eliminar un producto por ID
productsRouter.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    fs.readFile(productsFile, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al eliminar el producto'
            });
        }
        const products = JSON.parse(data);
        const index = products.findIndex((p) => p.id === productId);
        if (index !== -1) {
            const deletedProduct = products.splice(index, 1)[0];
            fs.writeFile(productsFile, JSON.stringify(products), (err) => {
                if (err) {
                    return res.status(500).json({
                        error: 'Error al guardar los productos después de la eliminación'
                    });
                }
                res.json(deletedProduct);
            });
        } else {
            res.status(404).json({
                error: 'Producto no encontrado'
            });
        }
    });
});

// Rutas para el manejo de carritos
const cartsRouter = express.Router();
app.use('/api/carts', cartsRouter);

const cartsFile = 'carrito.json';

// Crear un nuevo carrito
cartsRouter.post('/', (req, res) => {
    const newCart = {
        id: generateUniqueId(),
        products: [],
    };
    fs.readFile(cartsFile, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al crear el carrito'
            });
        }
        const carts = JSON.parse(data);
        carts.push(newCart);
        fs.writeFile(cartsFile, JSON.stringify(carts), (err) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error al guardar el carrito'
                });
            }
            res.json(newCart);
        });
    });
});

// Listar productos en un carrito por ID de carrito
cartsRouter.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    fs.readFile(cartsFile, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener el carrito'
            });
        }
        const carts = JSON.parse(data);
        const cart = carts.find((c) => c.id === cartId);
        if (cart) {
            res.json(cart.products);
        } else {
            res.status(404).json({
                error: 'Carrito no encontrado'
            });
        }
    });
});

// Agregar un producto al carrito por ID de carrito y producto
cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;
    fs.readFile(cartsFile, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al agregar el producto al carrito'
            });
        }
        const carts = JSON.parse(data);
        const cart = carts.find((c) => c.id === cartId);
        if (!cart) {
            return res.status(404).json({
                error: 'Carrito no encontrado'
            });
        }
        const productToAdd = {
            id: productId,
            quantity
        };
        const existingProductIndex = cart.products.findIndex((p) => p.id === productId);
        if (existingProductIndex !== -1) {
            // Si el producto ya está en el carrito, incrementa la cantidad
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push(productToAdd);
        }
        fs.writeFile(cartsFile, JSON.stringify(carts), (err) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error al guardar el carrito actualizado'
                });
            }
            res.json(cart.products);
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Express en ejecución en el puerto ${port}`);
});

function generateUniqueId() {
    // Generador de ID
}
