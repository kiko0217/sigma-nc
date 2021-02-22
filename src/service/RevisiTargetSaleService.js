import axios from 'axios'

export default class RevisiTargetSaleService {
    getRevisiTargetSales() {
        return axios.get('/api/revisi-target-sale').then(res => res.data.response);
    }
    createRevisiTargetSale(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/revisi-target-sale/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
}