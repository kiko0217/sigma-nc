import axios from 'axios'

export default class CustomerService {

    getCustomers() {
        return axios.get('assets/layout/data/customer.json').then(res => res.data.Data);
    }
}