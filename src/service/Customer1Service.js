import axios from 'axios'

export default class CustomerService {

    getCustomers() {
        return axios.get('/api/customer').then(res => res.data.response);
    }
    getCustomerMinis() {
        return axios.get('/api/customer/mini').then(res => res.data.response);
    }
    createCustomer(data) {
        // console.log(data)
        return new Promise((resolve, reject) => {
            axios.post('/api/customer/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    editCustomer(data) {
        // console.log(data)
        return new Promise((resolve, reject) => {
            axios.post('/api/customer/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    deleteCustomer(data) {
        // console.log(data)
        return new Promise((resolve, reject) => {
            axios.post('/api/customer/destroy', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
}