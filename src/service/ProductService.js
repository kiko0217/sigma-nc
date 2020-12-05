import axios from 'axios';

export default class ProductService {
	getProducts() {
		return axios.get('http://34.66.31.229:3000/api/product').then(res => res.data.response);
    }
}
