export class Carrito {
    constructor(products, currency) {

        //Añadimos la propiedad quantity a cada producto recibido del API para saber que productos se han elegido.
        this.products = products.map((product)=>{
            product.quantity = 0;
            return product;
        });

        this.currency = currency;
    }

    updateUnits(sku, unidades) {

        // Actualiza el número de unidades que se quieren comprar de un producto
        const product = this.products.find(product=> product.SKU === sku);

        //Buscamos el producto con find y si existe actualizamos su cantidad
        if(product){
            product.quantity = Number(unidades);
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
        }

        //Si el producto no existe devolvemos null
        return null;
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