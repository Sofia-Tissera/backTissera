const express = require('express');
const app = express();
const port = 3000; 
const ProductManager = require('./ProductManager'); 


const productManager = new ProductManager('products.json'); 

// Endpoint para obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener los productos'
        });
    }
});

// Endpoint para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({
                error: 'Producto no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener el producto'
        });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Express en ejecución en el puerto ${port}`);
});