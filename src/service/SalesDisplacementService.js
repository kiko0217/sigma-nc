import axios from 'axios'

export default class SalesDisplacementService {
    createSalesDisplacement(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/sales-displacement/create',data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }

    getSalesDisplacement() {
        return axios.get('/api/sales-displacement/').then(res => res.data.response);
    }
}