import axios from 'axios';

export default class ProductService {
	getProducts() {
		return axios.get('/api/product').then(res => res.data.response);
	}
	getProductMinis() {
		return axios.get('/api/product/mini').then(res => res.data.response);
	}
	createProduct(data) {
        // console.log(data)
        return new Promise((resolve, reject) => {
            axios.post('/api/product/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
	editProduct(data) {
        // console.log(data)
        return new Promise((resolve, reject) => {
            axios.post('/api/product/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
	deleteProduct(data) {
        // console.log(data)
        return new Promise((resolve, reject) => {
            axios.post('/api/product/destroy', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    getProductResult() {
        return axios.get('/api/product/result').then(res => res.data.response);
    }
    getProductTotal() {
        return axios.get('/api/product/total').then(res => res.data.response);
    }
    getProductPlot() {
        return axios.get('/api/product/plot').then(res => res.data.response);
    }
    getProductAchievement(data) {
        return new Promise((resolve, reject) => {
            axios.get('/api/product/achievement', {params: data})
            .then(res => resolve(res.data.response))
            .catch(err => reject(err))
        })
    }
}
