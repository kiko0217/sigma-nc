import axios from 'axios'

export default class SysFunctService {

    getDepts() {
        return axios.get('http://34.66.31.229:3000/api/sys-funct/dept').then(res => res.data.response);
    }
    getDetailerLevel() {
        return axios.get('http://34.66.31.229:3000/api/sys-funct/detailer-level').then(res => res.data.response);
    }
    getOutletType() {
        return axios.get('http://34.66.31.229:3000/api/sys-funct/outlet-type').then(res => res.data.response);
    }
    getCustomerType() {
        return axios.get('http://34.66.31.229:3000/api/sys-funct/customer-type').then(res => res.data.response);
    }
    getCustomerCategory() {
        return axios.get('http://34.66.31.229:3000/api/sys-funct/customer-category').then(res => res.data.response);
    }
}