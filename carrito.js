class Carrito {
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

const processJsonAndPaintProducts = (dataResponse) => {
    
    const products = dataResponse.products;
    const currency = dataResponse.currency;

    products.forEach(product => {
        paintProducts(product, currency);
    });
}

const nodeDivDetails = document.querySelector('.details');
const nodeSummaryProducts = document.getElementById('summary-products');
const nodeSummarySpanTotalPrice = document.getElementById('totalPrice');
let carrito;

const paintProducts = (product, currency) => {

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
    nodeDivTotal.textContent = `0${currency}`;

    //Añadimos los hijos a Row
    nodeDivRow.appendChild(nodeDivProduct);
    nodeDivRow.appendChild(nodeDivQuantity);
    nodeDivRow.appendChild(nodeDivUnit);
    nodeDivRow.appendChild(nodeDivTotal);

    //Añadimos row a details
    nodeDivDetails.appendChild(nodeDivRow);

    //Summary
    //Summary product
    const nodeSummaryProduct = document.createElement('div');
    nodeSummaryProduct.classList.add('summary-product');

    const nodeSpanProductName = document.createElement('span');
    nodeSpanProductName.textContent = `${product.title}`;
    const nodeSpanProductPrice = document.createElement('span');
    nodeSpanProductPrice.textContent = `0${currency}`;
    
    nodeSummaryProduct.appendChild(nodeSpanProductName);
    nodeSummaryProduct.appendChild(nodeSpanProductPrice);
	nodeSummaryProduct.style.display = 'none';
	
	nodeSummaryProducts.appendChild(nodeSummaryProduct);

    //Creacion de eventos
    spanLess.addEventListener('click', () => {

        let valorActual = Number(input.value);
        if(valorActual > 0){
            valorActual--;
            input.value = valorActual;                      
        }

        updateTotalProductAndSummary(product.SKU, valorActual);
    });

    spanPlus.addEventListener('click', () => {
        let valorActual = Number(input.value);
        valorActual++;
        input.value = valorActual;

        updateTotalProductAndSummary(product.SKU, valorActual);

    });

    //Si se escribe la coantidad por teclado.
    input.addEventListener('input', ()=> {

        let valorActual = input.value ==="" ? 0 : Number(input.value);

        if(valorActual < 0){
            valorActual = 0;
            input.value = 0;
        }

        updateTotalProductAndSummary(product.SKU, valorActual);
    
    });

    const updateTotalProductAndSummary = (sku, valorActual) => {

        //Actulizamos las unidades del carrito
        carrito.updateUnits(sku, valorActual);

        //Actualizamos el total de los productos añadidos
        const product =  carrito.getProductInformation(sku);
        const totalProduct = Number(product.totalProducts);
        const totalProductPaint = totalProduct === 0 ? '0' : totalProduct;
        nodeDivTotal.textContent = `${totalProductPaint}${currency}`;
        nodeSpanProductPrice.textContent = `${totalProductPaint}${currency}`;;

        if(valorActual > 0){
            nodeSummaryProduct.style.display = 'flex';
        }else{
            nodeSummaryProduct.style.display = 'none';
        }
        
        //Pintamos el total del carrito
        const totalCart = carrito.getCart().total;
        const totalCartPaint = Number(totalCart) === 0 ? '0' : totalCart;
        nodeSummarySpanTotalPrice.textContent = `${totalCartPaint}${currency}`;
    }
}
