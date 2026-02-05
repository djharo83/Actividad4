class Carrito {
    constructor(products, currency) {

        //Añadimos la propiedad quantity a cada producto recibido del API para saber que productos se han elegido.
        this.products = products.map((product)=>{
            product.quantity = 0;
            return product;
        });

        this.currency = currency;
    }

    actualizarUnidades(sku, unidades) {

        // Actualiza el número de unidades que se quieren comprar de un producto

        const product = this.products.find(product=> product.SKU === sku);

        //Buscamos el producto con find y si existe actualizamos su cantidad
        if(product){
            product.quantity = Number(unidades);
        }
    }

    obtenerInformacionProducto(sku) {

        // Devuelve los datos de un producto además de las unidades seleccionadas

        const product = this.products.find(product=> product.SKU === sku);
        
        //devuelvo un objeto con parte de la informacion que queremos del producto
        if(product){
            return {
                    "name":product.title,
                    "sku":product.SKU,
                    "price":Number(product.price),
                    "quantity": product.quantity,
            }
        }

        //Si el producto no existe devolvemos null
        return null;
    }

    obtenerTotalProducto(sku){

        //Devuelve el precio total para un producto 

        const product = this.products.find(product=> product.SKU === sku);

        let totalProdcuto = 0;

        if(product){

            return (Number(product.price) * product.quantity).toFixed(2);
        }
        
        return totalProdcuto;
        
    }

    obtenerCarrito() {

      // Devuelve información de los productos añadidos al carrito
      // Además del total calculado de todos los productos

        //Obtenemos los productos que tienen mas de una unidad y contruimos una lista nueva con la informacion de cada producto mas su cantidad y su total
        const productosFinales = this.products.filter(product=> product.quantity>0).map( product=> {

            return {
                    "name":product.title,
                    "sku":product.SKU,
                    "price":Number(product.price),
                    "quantity": product.quantity,
                    "totalProducts": Number(product.price) * product.quantity
                };
        });

        //Calculamos el total del carrito a partir del array de productosFinales obtenido anteriormente
        let totalCarrito = 0;
        for(const product of productosFinales){
            totalCarrito += product.totalProducts;
        };

        //Devolvemos un objeto con el total del carrito la moneda que se esta utilizando y la información de los productos obtenidos anteriormente
        return {
                "total": totalCarrito.toFixed(2),
                "currency": this.currency,
                "products": productosFinales
        };
    }
}

let carrito;

async function getProducts() {
    try {
		
        const apiUrl = 'https://api.jsonblob.com//019c1939-f3d5-78fa-a477-cb088c462038';
        const apiUrl2 = 'https://api.jsonbin.io/v3/qs/697f64f4ae596e708f093b08';
        const localUrl = './productos.json';
        
		//Caduca en un día
        const apiRequest = await fetch(localUrl/*apiUrl*/);
        
        if (!apiRequest.ok) {
            throw new Error('Error al conectar con la API');
        }

        const apiResponse = await apiRequest.json();
        
        carrito = new Carrito(apiResponse.products, apiResponse.currency);

        processJsonAndPaintProducts(apiResponse);


    } catch (error) {
        console.error('Hubo un problema al llamar a la API:', error);
    }
}

getProducts();

function processJsonAndPaintProducts(dataResponse){
    
    const products = dataResponse.products;
    const currency = dataResponse.currency;

    products.forEach(product => {
        paintProducts(product, currency);
    });
}


const nodeDivDetails = document.querySelector('.details');

function paintProducts(product, currency){

    //Row
    const nodeDivRow = document.createElement('div');
    nodeDivRow.classList.add('row');

    //Product
    const nodeDivProduct = document.createElement('div');
    nodeDivProduct.classList.add('product');

    const nodeDivProductName = document.createElement('div');
    nodeDivProductName.classList.add('name');
    nodeDivProductName.textContent = product.title;
    
    const nodeDivProductRef = document.createElement('div');
    nodeDivProductRef.classList.add('ref');
    nodeDivProductRef.textContent = product.SKU;
    
    nodeDivProduct.appendChild(nodeDivProductName);
    nodeDivProduct.appendChild(nodeDivProductRef);

    //Quantity
    const nodeDivQuantity = document.createElement('div');
    nodeDivQuantity.classList.add('quantity')
    
    const spanLess = document.createElement('span');
    spanLess.textContent = '-';

    const input = document.createElement('input');
    input.type = 'number';
    input.value = "0";
    
    const spanPlus = document.createElement('span');
    spanPlus.textContent = '+';

    nodeDivQuantity.appendChild(spanLess);
    nodeDivQuantity.appendChild(input);
    nodeDivQuantity.appendChild(spanPlus);

    //Unit
    const nodeDivUnit = document.createElement('div');
    nodeDivUnit.classList.add('unit');
    nodeDivUnit.textContent = product.price+currency;

    //Total
    const nodeDivTotal = document.createElement('div');
    nodeDivTotal.classList.add('total');
    nodeDivTotal.textContent = 0+currency;

    //Añadimos los hijos a Row
    nodeDivRow.appendChild(nodeDivProduct);
    nodeDivRow.appendChild(nodeDivQuantity);
    nodeDivRow.appendChild(nodeDivUnit);
    nodeDivRow.appendChild(nodeDivTotal);

    //Añadimos row a details
    nodeDivDetails.appendChild(nodeDivRow);

    //Creacion de eventos

    spanLess.addEventListener('click', () => {

        let valorActual = Number(input.value);
        if(valorActual > 0){
            valorActual--;
            input.value = valorActual;                      
        }

        carrito.actualizarUnidades(product.SKU, valorActual);
        actualizarTotalProducto(product.SKU);
        const estadoActualCarrito = carrito.obtenerCarrito();
    });

    spanPlus.addEventListener('click', () => {
        let valorActual = Number(input.value);
        valorActual++;
        input.value = valorActual;

        carrito.actualizarUnidades(product.SKU, valorActual);
        actualizarTotalProducto(product.SKU);
        const estadoActualCarrito = carrito.obtenerCarrito();

    });


    //Si se escribe la coantidad por teclado.
    input.addEventListener('input', ()=> {

        let valorActual = Number(input.value);

        carrito.actualizarUnidades(product.SKU, valorActual);
        actualizarTotalProducto(product.SKU)
        const estadoActualCarrito = carrito.obtenerCarrito();
    
    });

    const actualizarTotalProducto = (sku)=>{

        let cantidad = input.value === "" ? 0 : Number(input.value);

        if(cantidad < 0){
            cantidad = 0;
            input.value = 0;
        }

        const totalProducto =  carrito.obtenerTotalProducto(sku);
        
        nodeDivTotal.textContent = cantidad > 0 ? `${totalProducto}${currency}` : `${0}${currency}`;
    }
}

/*Intentar que cuando el usuario ponga la cantidad a cero la fila del producto en el resumen (summary)
desaparezca visualmente en css hide ocultando el div donde este el producto?

ver si puedo sacar la clase carrito a un archivo aparte Carrito.js o algo asi y ver que tengo que añadir en el html
en  <script src="carrito.js"></script>

*/