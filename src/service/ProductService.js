import axios from 'axios';

export default class ProductService {
	getProducts() {
		return axios.get('http://34.66.31.229:3000/api/product').then(res => res.data.response);
	}
	getProductMinis() {
		return axios.get('http://34.66.31.229:3000/api/product/mini').then(res => res.data.response);
	}
	createProduct(data) {
        // console.log(data)
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/product/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
	editProduct(data) {
        // console.log(data)
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/product/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
	deleteProduct(data) {
        // console.log(data)
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/product/destroy', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
}
