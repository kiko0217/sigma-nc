import axios from 'axios';

export default class EvaluasiCustomerService {
    getEvaluasiCustomer() {
        return axios.get('assets/layout/data/evl_cus.json').then(res => res.data.response);
    }
}