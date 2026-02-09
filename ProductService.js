export class ProductService{
    
    static async getProducts() {
    
        try {
            
            const apiUrl = 'https://api.jsonblob.com//019c1939-f3d5-78fa-a477-cb088c462038';
            const localUrl = './productos.json';
            
            //Caduca en un día
            const apiRequest = await fetch(localUrl/*apiUrl*/);
            
            if (!apiRequest.ok) {
                throw new Error('Error al conectar con la API');
            }

            const apiResponse = await apiRequest.json();

            return apiResponse;

        } catch (error) {
            console.error('Hubo un problema al llamar a la API:', error);
        }
    }
}