import axios from 'axios'

export default class ProductService {

    getProducts() {
        return axios.get('assets/layout/data/product.json').then(res => res.data.Data);
    }
}