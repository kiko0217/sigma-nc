import axios from 'axios';

export default class ProductNC {

    getProductsSmall() {
		return axios.get('assets/layout/data/products-small.json').then(res => res.data.data);
	}

	getProducts() {
		return axios.get('assets/layout/data/products.json').then(res => res.data.data);
    }

    getProductsWithOrdersSmall() {
		return axios.get('assets/layout/data/products-orders-small.json').then(res => res.data.data);
	}
}
