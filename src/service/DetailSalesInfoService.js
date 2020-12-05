import axios from 'axios'

export default class DetailSalesInfo {
    getDetailSalesInfo() {
        return axios.get('http://34.66.31.229:3000/api/trx').then(res => res.data.response)
    }
}