import { ProductService } from "./ProductService.js";
import { Carrito } from "./Carrito.js";

const paintProductsAndSummary = (carrito) => {

        const nodeDivDetails = document.querySelector('.details');
        const nodeSummaryProducts = document.getElementById('summary-products');
        const nodeSummarySpanTotalPrice = document.getElementById('totalPrice');

        const products = carrito.products;
        const currency = carrito.currency;

        products.forEach(product => {
            
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
        nodeDivUnit.textContent = `${product.price}${currency}`;

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

        //funcion para calcular los totales
        const updateTotalProductAndSummary = (valorActual) => {

            //Actulizamos las unidades del carrito
            carrito.updateUnits(product.SKU, valorActual);

            //Actualizamos el total de los productos añadidos
            const totalProduct = Number(carrito.getProductInformation(product.SKU).totalProducts);
            const totalProductPaint = totalProduct === 0 ? '0' : totalProduct;
            nodeDivTotal.textContent = `${totalProductPaint}${currency}`;
            nodeSpanProductPrice.textContent = `${totalProductPaint}${currency}`;
            nodeSummaryProduct.style.display = valorActual > 0 ? 'flex' : 'none';  
            
            //Pintamos el total del carrito
            const totalCart = carrito.getCart().total;
            const totalCartPaint = Number(totalCart) === 0 ? '0' : totalCart;
            nodeSummarySpanTotalPrice.textContent = `${totalCartPaint}${currency}`;
        }

        //Creacion de eventos
        spanLess.addEventListener('click', () => {

            let valorActual = Number(input.value);
            if(valorActual > 0){
                valorActual--;
                input.value = valorActual;                      
            }

            updateTotalProductAndSummary(valorActual);
        });

        spanPlus.addEventListener('click', () => {
            let valorActual = Number(input.value);
            valorActual++;
            input.value = valorActual;

            updateTotalProductAndSummary(valorActual);

        });

        //Si se escribe la coantidad por teclado.
        input.addEventListener('input', ()=> {

            let valorActual = input.value ==="" ? 0 : Number(input.value);

            if(valorActual < 0){
                valorActual = 0;
                input.value = 0;
            }

            updateTotalProductAndSummary(valorActual);
        
        });
    });
}

const data = await ProductService.getProducts();

const carrito = new Carrito(data.products, data.currency);

paintProductsAndSummary(carrito);