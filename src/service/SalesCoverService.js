import axios from 'axios'

export default class SalesCoverService {
    createSalesCover(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/sales-cover/create',data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    editSalesCover(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/sales-cover/edit',data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    deleteSalesCover(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/sales-cover/destroy',data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }

    getSalesCovers() {
        return axios.get('/api/sales-cover/').then(res => res.data.response);
    }
}