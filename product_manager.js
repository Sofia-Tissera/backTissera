const fs = require('fs');

class ProductManager {
    constructor(fileName) {
        this.fileName = fileName;
        this.products = [];
        this.loadProductsFromFile();
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync(this.fileName, 'utf-8');
            if (data) {
                this.products = JSON.parse(data);
            }
        } catch (error) {
            // Si el archivo no existe o hay un error al leerlo, inicializa con un arreglo vacío.
            this.products = [];
        }
    }

    saveProductsToFile() {
        const data = JSON.stringify(this.products);
        fs.writeFileSync(this.fileName, data);
    }

    addProduct(product) {
        // Validar que el código no esté repetido
        if (this.products.some((p) => p.code === product.code)) {
            console.log("El código ya está en uso. No se puede agregar el producto.");
            return;
        }

        // Asignar un id autoincrementable
        const lastId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
        product.id = lastId + 1;

        this.products.push(product);
        this.saveProductsToFile();
        console.log("Producto agregado:", product);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id === id);
        if (product) {
            return product;
        } else {
            console.log("Producto no encontrado. ID:", id);
            return null;
        }
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex((p) => p.id === id);
        if (index !== -1) {
            this.products[index] = {
                ...this.products[index],
                ...updatedProduct
            };
            this.saveProductsToFile();
            console.log("Producto actualizado:", this.products[index]);
        } else {
            console.log("Producto no encontrado. ID:", id);
        }
    }

    deleteProduct(id) {
        const index = this.products.findIndex((p) => p.id === id);
        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1)[0];
            this.saveProductsToFile();
            console.log("Producto eliminado:", deletedProduct);
        } else {
            console.log("Producto no encontrado. ID:", id);
        }
    }
}

module.exports = ProductManager;
