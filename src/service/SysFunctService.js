import axios from 'axios'

export default class SysFunctService {

    getDepts() {
        return axios.get('/api/sys-funct/dept').then(res => res.data.response);
    }
    getDetailerLevel() {
        return axios.get('/api/sys-funct/detailer-level').then(res => res.data.response);
    }
    getOutletType() {
        return axios.get('/api/sys-funct/outlet-type').then(res => res.data.response);
    }
    getCustomerType() {
        return axios.get('/api/sys-funct/customer-type').then(res => res.data.response);
    }
    getCustomerCategory() {
        return axios.get('/api/sys-funct/customer-category').then(res => res.data.response);
    }
}