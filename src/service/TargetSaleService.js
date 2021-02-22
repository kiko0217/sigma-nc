import axios from 'axios'

export default class TargetSaleService {
    getTargetSales() {
        return axios.get('/api/target-sale').then(res => res.data.response);
    }
    getTargetSalesWithRevisi() {
        return axios.get('/api/target-sale/with-revisi').then(res => res.data.response);
    }
    createTargetSale(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/target-sale/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    deleteTargetSale(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/target-sale/destroy', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
}