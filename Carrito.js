export class Carrito {
    constructor(products, currency) {

        //Añadimos la propiedad quantity a cada producto recibido del API para saber que productos se han elegido.
        this.productsCatalog = products;
        this.products = [];
        this.currency = currency;
    }

    updateUnits(sku, units) {

        // Actualiza el número de unidades que se quieren comprar de un producto
        
        units = Number(units);

        const productCart = this.products.find(product=> product.SKU === sku);

        //Buscamos el producto en nuestro carrito y si existe pero la cantidad es cero lo quitamos del carrito y si es mayor que cero añadimos la cantidad al producto
        //Si el producto no esta en nuestro carrito lo buscamos en el catologo productos de API
        if(productCart){
            if(units <= 0){
                this.products = this.products.filter(product=> product.SKU !== sku);
            }else{
                productCart.quantity = units;   
            }                    
        }else if (!productCart && units > 0){
            const productCatalog = this.productsCatalog.find(productCatalog=> productCatalog.SKU === sku);
            const newProduct = {
                    "title":productCatalog.title,
                    "SKU":productCatalog.SKU,
                    "price":Number(productCatalog.price),
                    "quantity": units
            }
            
            this.products.push(newProduct);
        }
    }

    getProductInformation(sku) {

        // Devuelve los datos de un producto además de las unidades seleccionadas

        const product = this.products.find(product=> product.SKU === sku);
        
        //devuelvo un objeto con parte de la informacion que queremos del producto
        if(product){
            return {
                    "name":product.title,
                    "sku":product.SKU,
                    "price":Number(product.price),
                    "quantity": product.quantity,
                    "totalProducts": (Number(product.price) * product.quantity).toFixed(2)
            }
        }else {
            
            const productCatalog = this.productsCatalog.find(productCatalog=> productCatalog.SKU === sku);

            return {
                    "name":productCatalog.title,
                    "sku":productCatalog.SKU,
                    "price":Number(productCatalog.price),
                    "quantity": 0,
                    "totalProducts": '0'
            }
        }
    }

    getCart() {

      // Devuelve información de los productos añadidos al carrito
      // Además del total calculado de todos los productos

        //Obtenemos los productos que tienen mas de una unidad y contruimos una lista nueva con la informacion de cada producto mas su cantidad y su total
        const productosFinales = this.products.filter(product=> product.quantity>0).map( product=> {

            return {
                    "name":product.title,
                    "sku":product.SKU,
                    "price":Number(product.price),
                    "quantity": product.quantity,
                    "totalProducts": (Number(product.price) * product.quantity).toFixed(2)
                };
        });

        //Calculamos el total del carrito a partir del array de productosFinales obtenido anteriormente
        let totalCarrito = 0;
        for(const product of productosFinales){
            totalCarrito += Number(product.totalProducts);
        };

        //Devolvemos un objeto con el total del carrito la moneda que se esta utilizando y la información de los productos obtenidos anteriormente
        return {
                "total": totalCarrito.toFixed(2),
                "currency": this.currency,
                "products": productosFinales
        };
    }
}