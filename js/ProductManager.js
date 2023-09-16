const ProductManager = require('./ProductManager'); 

const manager = new ProductManager('products.json'); 

manager.addProduct({
    title: "Producto 1",
    description: "Descripción 1",
    price: 10.99,
    thumbnail: "imagen1.jpg",
    code: "P1",
    stock: 50,
});

console.log("Todos los productos:", manager.getProducts());
console.log("Producto con ID 1:", manager.getProductById(1));

manager.updateProduct(1, {
    price: 12.99
});
console.log("Producto con ID 1 (después de la actualización):", manager.getProductById(1));

manager.deleteProduct(2);
console.log("Todos los productos (después de la eliminación del ID 2):", manager.getProducts());
