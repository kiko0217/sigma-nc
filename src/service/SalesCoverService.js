import axios from 'axios'

export default class SalesCoverService {
    createSalesCover(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/sales-cover/create',data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }

    getSalesCovers() {
        return axios.get('http://34.66.31.229:3000/api/sales-cover/').then(res => res.data.response);
    }
}