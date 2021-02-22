import axios from 'axios'

export default class DetailSalesInfo {
    getDetailSalesInfo() {
        return axios.get('/api/trx').then(res => res.data.response)
    }
}