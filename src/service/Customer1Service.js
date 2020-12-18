import axios from 'axios'

export default class CustomerService {

    getCustomers() {
        return axios.get('http://34.66.31.229:3000/api/customer').then(res => res.data.response);
    }
}